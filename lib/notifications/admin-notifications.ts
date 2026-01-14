export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export interface AdminNotification {
  id: string
  type: NotificationType
  title: string
  message?: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
    url?: string
  }
  autoDismiss?: boolean
  dismissAfter?: number // milliseconds
  // Database fields (optional, for synced notifications)
  action_label?: string
  action_url?: string
  metadata?: Record<string, any>
}

interface NotificationCallbacks {
  onAdd?: (notification: AdminNotification) => void
  onRemove?: (id: string) => void
  onRead?: (id: string) => void
  onReadAll?: () => void
}

class AdminNotificationManager {
  private notifications: AdminNotification[] = []
  private callbacks: NotificationCallbacks = {}
  private maxNotifications = 50
  private syncInProgress = false
  private lastSyncTime = 0
  private syncInterval = 30000 // 30 seconds

  setCallbacks(callbacks: NotificationCallbacks) {
    this.callbacks = callbacks
  }

  /**
   * Sync notifications from database
   */
  async syncFromDatabase(): Promise<void> {
    if (this.syncInProgress) return
    if (Date.now() - this.lastSyncTime < 5000) return // Throttle to max once per 5 seconds

    this.syncInProgress = true
    try {
      const response = await fetch('/api/admin/notifications?limit=100')
      if (!response.ok) {
        console.error('Failed to sync notifications from database')
        return
      }

      const { data } = await response.json()
      if (!data || !Array.isArray(data)) return

      // Convert database format to AdminNotification format
      const dbNotifications: AdminNotification[] = data.map((dbNotif: any) => ({
        id: dbNotif.id,
        type: dbNotif.type as NotificationType,
        title: dbNotif.title,
        message: dbNotif.message || undefined,
        timestamp: new Date(dbNotif.created_at),
        read: dbNotif.read || false,
        action: dbNotif.action_label
          ? {
              label: dbNotif.action_label,
              url: dbNotif.action_url || undefined,
              onClick: dbNotif.action_url
                ? () => {
                    if (typeof window !== 'undefined') {
                      window.location.href = dbNotif.action_url
                    }
                  }
                : () => {},
            }
          : undefined,
        autoDismiss: dbNotif.auto_dismiss ?? true,
        dismissAfter: dbNotif.dismiss_after || undefined,
        action_label: dbNotif.action_label || undefined,
        action_url: dbNotif.action_url || undefined,
        metadata: dbNotif.metadata || {},
      }))

      // Merge with existing notifications (avoid duplicates)
      const existingIds = new Set(this.notifications.map((n) => n.id))
      const newNotifications = dbNotifications.filter((n) => !existingIds.has(n.id))

      // Update existing notifications with database state
      dbNotifications.forEach((dbNotif) => {
        const existing = this.notifications.find((n) => n.id === dbNotif.id)
        if (existing) {
          existing.read = dbNotif.read
          existing.timestamp = dbNotif.timestamp
        }
      })

      // Add new notifications
      this.notifications = [...dbNotifications, ...newNotifications]
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, this.maxNotifications)

      this.lastSyncTime = Date.now()
      this.callbacks.onAdd?.({} as AdminNotification) // Trigger refresh
    } catch (error) {
      console.error('Error syncing notifications:', error)
    } finally {
      this.syncInProgress = false
    }
  }

  /**
   * Save notification to database
   */
  private async saveToDatabase(notification: AdminNotification): Promise<void> {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: notification.type,
          title: notification.title,
          message: notification.message || null,
          action_label: notification.action?.label || null,
          action_url: notification.action?.url || null,
          metadata: notification.metadata || {},
          auto_dismiss: notification.autoDismiss ?? true,
          dismiss_after: notification.dismissAfter || null,
        }),
      })

      if (!response.ok) {
        console.error('Failed to save notification to database')
        return
      }

      const { data } = await response.json()
      if (data && data.id && data.id !== notification.id) {
        // Update local ID with database ID
        notification.id = data.id
      }
    } catch (error) {
      console.error('Error saving notification to database:', error)
      // Don't throw - allow notification to work client-side even if DB save fails
    }
  }

  add(notification: Omit<AdminNotification, 'id' | 'timestamp' | 'read'>): string {
    const newNotification: AdminNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
      autoDismiss: notification.autoDismiss ?? true,
      dismissAfter: notification.dismissAfter ?? 5000,
    }

    this.notifications.unshift(newNotification)

    // Keep only the most recent notifications
    if (this.notifications.length > this.maxNotifications) {
      this.notifications = this.notifications.slice(0, this.maxNotifications)
    }

    this.callbacks.onAdd?.(newNotification)

    // Save to database (async, don't wait - fire and forget)
    this.saveToDatabase(newNotification).catch(console.error)

    // Auto-dismiss if enabled
    if (newNotification.autoDismiss && newNotification.dismissAfter) {
      setTimeout(() => {
        this.remove(newNotification.id)
      }, newNotification.dismissAfter)
    }

    return newNotification.id
  }

  async remove(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id)
    this.callbacks.onRemove?.(id)

    // Delete from database (async, don't wait)
    try {
      await fetch(`/api/admin/notifications/${id}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error('Error deleting notification from database:', error)
    }
  }

  async markAsRead(id: string) {
    const notification = this.notifications.find((n) => n.id === id)
    if (notification && !notification.read) {
      notification.read = true
      this.callbacks.onRead?.(id)

      // Update in database (async, don't wait)
      try {
        await fetch(`/api/admin/notifications/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ read: true }),
        })
      } catch (error) {
        console.error('Error updating notification in database:', error)
      }
    }
  }

  async markAllAsRead() {
    this.notifications.forEach((n) => {
      if (!n.read) {
        n.read = true
      }
    })
    this.callbacks.onReadAll?.()

    // Update in database (async, don't wait)
    try {
      await fetch('/api/admin/notifications/mark-all-read', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Error marking all notifications as read in database:', error)
    }
  }

  getAll() {
    return [...this.notifications]
  }

  getUnreadCount() {
    return this.notifications.filter((n) => !n.read).length
  }

  clear() {
    this.notifications = []
    this.callbacks.onRemove?.('all')
  }

  async clearRead() {
    const readNotifications = this.notifications.filter((n) => n.read)
    this.notifications = this.notifications.filter((n) => !n.read)

    // Delete from database (async, don't wait)
    try {
      await fetch('/api/admin/notifications/clear-read', {
        method: 'DELETE',
      })
    } catch (error) {
      console.error('Error clearing read notifications from database:', error)
    }
  }

  /**
   * Start periodic sync from database
   */
  startSync() {
    // Initial sync
    this.syncFromDatabase()

    // Periodic sync
    setInterval(() => {
      this.syncFromDatabase()
    }, this.syncInterval)
  }

  // Helper methods for common notification types
  success(title: string, message?: string, options?: Partial<AdminNotification>): string {
    return this.add({
      type: 'success',
      title,
      message,
      ...options,
    })
  }

  error(title: string, message?: string, options?: Partial<AdminNotification>): string {
    return this.add({
      type: 'error',
      title,
      message,
      autoDismiss: false, // Errors don't auto-dismiss by default
      ...options,
    })
  }

  info(title: string, message?: string, options?: Partial<AdminNotification>): string {
    return this.add({
      type: 'info',
      title,
      message,
      ...options,
    })
  }

  warning(title: string, message?: string, options?: Partial<AdminNotification>): string {
    return this.add({
      type: 'warning',
      title,
      message,
      ...options,
    })
  }
}

export const adminNotificationManager = new AdminNotificationManager()
