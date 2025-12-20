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
  }
  autoDismiss?: boolean
  dismissAfter?: number // milliseconds
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

  setCallbacks(callbacks: NotificationCallbacks) {
    this.callbacks = callbacks
  }

  add(notification: Omit<AdminNotification, 'id' | 'timestamp' | 'read'>) {
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

    // Auto-dismiss if enabled
    if (newNotification.autoDismiss && newNotification.dismissAfter) {
      setTimeout(() => {
        this.remove(newNotification.id)
      }, newNotification.dismissAfter)
    }

    return newNotification.id
  }

  remove(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id)
    this.callbacks.onRemove?.(id)
  }

  markAsRead(id: string) {
    const notification = this.notifications.find((n) => n.id === id)
    if (notification && !notification.read) {
      notification.read = true
      this.callbacks.onRead?.(id)
    }
  }

  markAllAsRead() {
    this.notifications.forEach((n) => {
      if (!n.read) {
        n.read = true
      }
    })
    this.callbacks.onReadAll?.()
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

  clearRead() {
    this.notifications = this.notifications.filter((n) => !n.read)
  }

  // Helper methods for common notification types
  success(title: string, message?: string, options?: Partial<AdminNotification>) {
    return this.add({
      type: 'success',
      title,
      message,
      ...options,
    })
  }

  error(title: string, message?: string, options?: Partial<AdminNotification>) {
    return this.add({
      type: 'error',
      title,
      message,
      autoDismiss: false, // Errors don't auto-dismiss by default
      ...options,
    })
  }

  info(title: string, message?: string, options?: Partial<AdminNotification>) {
    return this.add({
      type: 'info',
      title,
      message,
      ...options,
    })
  }

  warning(title: string, message?: string, options?: Partial<AdminNotification>) {
    return this.add({
      type: 'warning',
      title,
      message,
      ...options,
    })
  }
}

export const adminNotificationManager = new AdminNotificationManager()
