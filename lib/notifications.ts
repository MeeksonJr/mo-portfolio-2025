/**
 * Smart Notifications System
 * Handles browser notifications, in-app notifications, and notification preferences
 */

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'achievement' | 'content' | 'system'

export type NotificationPriority = 'low' | 'medium' | 'high'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  priority: NotificationPriority
  timestamp: Date
  read: boolean
  actionUrl?: string
  actionLabel?: string
  icon?: string
  metadata?: Record<string, any>
}

const NOTIFICATIONS_KEY = 'portfolio_notifications'
const NOTIFICATION_PREFERENCES_KEY = 'portfolio_notification_preferences'
const MAX_NOTIFICATIONS = 50

export interface NotificationPreferences {
  browser: boolean
  email: boolean
  inApp: boolean
  types: {
    achievement: boolean
    content: boolean
    system: boolean
  }
  doNotDisturb: boolean
  doNotDisturbHours: { start: number; end: number } // 0-23
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  browser: false,
  email: false,
  inApp: true,
  types: {
    achievement: true,
    content: true,
    system: true,
  },
  doNotDisturb: false,
  doNotDisturbHours: { start: 22, end: 8 },
}

/**
 * Get notification preferences
 */
export function getNotificationPreferences(): NotificationPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES

  const stored = localStorage.getItem(NOTIFICATION_PREFERENCES_KEY)
  if (!stored) return DEFAULT_PREFERENCES

  try {
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

/**
 * Save notification preferences
 */
export function saveNotificationPreferences(prefs: Partial<NotificationPreferences>): void {
  if (typeof window === 'undefined') return

  const current = getNotificationPreferences()
  const updated = { ...current, ...prefs }
  localStorage.setItem(NOTIFICATION_PREFERENCES_KEY, JSON.stringify(updated))
}

/**
 * Get all notifications
 */
export function getNotifications(): Notification[] {
  if (typeof window === 'undefined') return []

  const stored = localStorage.getItem(NOTIFICATIONS_KEY)
  if (!stored) return []

  try {
    const notifications = JSON.parse(stored) as Notification[]
    return notifications.map((n) => ({
      ...n,
      timestamp: new Date(n.timestamp),
    }))
  } catch {
    return []
  }
}

/**
 * Add a notification
 */
export function addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
  if (typeof window === 'undefined') return

  const notifications = getNotifications()
  const newNotification: Notification = {
    ...notification,
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    read: false,
  }

  // Add to beginning and limit total
  const updated = [newNotification, ...notifications].slice(0, MAX_NOTIFICATIONS)
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated))

  // Show browser notification if enabled
  const prefs = getNotificationPreferences()
  if (prefs.browser && shouldShowNotification(newNotification, prefs)) {
    showBrowserNotification(newNotification)
  }

  // Dispatch custom event for in-app notifications
  if (prefs.inApp) {
    window.dispatchEvent(
      new CustomEvent('notification', {
        detail: newNotification,
      })
    )
  }
}

/**
 * Mark notification as read
 */
export function markNotificationAsRead(id: string): void {
  if (typeof window === 'undefined') return

  const notifications = getNotifications()
  const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated))
}

/**
 * Mark all notifications as read
 */
export function markAllNotificationsAsRead(): void {
  if (typeof window === 'undefined') return

  const notifications = getNotifications()
  const updated = notifications.map((n) => ({ ...n, read: true }))
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated))
}

/**
 * Delete notification
 */
export function deleteNotification(id: string): void {
  if (typeof window === 'undefined') return

  const notifications = getNotifications()
  const updated = notifications.filter((n) => n.id !== id)
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated))
}

/**
 * Clear all notifications
 */
export function clearAllNotifications(): void {
  if (typeof window === 'undefined') return

  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]))
}

/**
 * Get unread count
 */
export function getUnreadCount(): number {
  const notifications = getNotifications()
  return notifications.filter((n) => !n.read).length
}

/**
 * Request browser notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied'
  }

  if (Notification.permission === 'granted') {
    return 'granted'
  }

  if (Notification.permission === 'denied') {
    return 'denied'
  }

  const permission = await Notification.requestPermission()
  return permission
}

/**
 * Show browser notification
 */
function showBrowserNotification(notification: Notification): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return
  if (Notification.permission !== 'granted') return

  const prefs = getNotificationPreferences()
  if (prefs.doNotDisturb && isDoNotDisturbTime(prefs.doNotDisturbHours)) {
    return
  }

  const options: NotificationOptions = {
    body: notification.message,
    icon: notification.icon || '/placeholder-logo.png',
    badge: '/placeholder-logo.png',
    tag: notification.id,
    requireInteraction: notification.priority === 'high',
  }

  const browserNotification = new Notification(notification.title, options)

  browserNotification.onclick = () => {
    window.focus()
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
    browserNotification.close()
  }

  // Auto-close after 5 seconds (unless high priority)
  if (notification.priority !== 'high') {
    setTimeout(() => {
      browserNotification.close()
    }, 5000)
  }
}

/**
 * Check if should show notification based on preferences
 */
function shouldShowNotification(notification: Notification, prefs: NotificationPreferences): boolean {
  // Check do not disturb
  if (prefs.doNotDisturb && isDoNotDisturbTime(prefs.doNotDisturbHours)) {
    return false
  }

  // Check type preferences
  if (notification.type === 'achievement' && !prefs.types.achievement) return false
  if (notification.type === 'content' && !prefs.types.content) return false
  if (notification.type === 'system' && !prefs.types.system) return false

  return true
}

/**
 * Check if current time is in do not disturb hours
 */
function isDoNotDisturbTime(hours: { start: number; end: number }): boolean {
  const now = new Date()
  const currentHour = now.getHours()

  if (hours.start > hours.end) {
    // Overnight (e.g., 22:00 - 08:00)
    return currentHour >= hours.start || currentHour < hours.end
  } else {
    // Same day (e.g., 09:00 - 17:00)
    return currentHour >= hours.start && currentHour < hours.end
  }
}

/**
 * Create achievement notification
 */
export function notifyAchievement(achievement: { title: string; description: string; icon: string }): void {
  addNotification({
    type: 'achievement',
    title: 'Achievement Unlocked! 🎉',
    message: `${achievement.title}: ${achievement.description}`,
    priority: 'medium',
    icon: achievement.icon,
    actionUrl: '/achievements',
    actionLabel: 'View Achievements',
  })
}

/**
 * Create content notification
 */
export function notifyNewContent(type: 'blog' | 'case-study' | 'project', title: string, url: string): void {
  const typeLabels = {
    blog: 'New Blog Post',
    'case-study': 'New Case Study',
    project: 'New Project',
  }

  addNotification({
    type: 'content',
    title: typeLabels[type],
    message: title,
    priority: 'low',
    actionUrl: url,
    actionLabel: 'View',
  })
}

/**
 * Create system notification
 */
export function notifySystem(title: string, message: string, priority: NotificationPriority = 'medium'): void {
  addNotification({
    type: 'system',
    title,
    message,
    priority,
  })
}

