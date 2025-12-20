'use client'

import { useEffect, useState } from 'react'
import {
  AdminNotification,
  adminNotificationManager,
} from '@/lib/notifications/admin-notifications'

export function useAdminNotifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Set up callbacks
    adminNotificationManager.setCallbacks({
      onAdd: () => {
        setNotifications(adminNotificationManager.getAll())
        setUnreadCount(adminNotificationManager.getUnreadCount())
      },
      onRemove: () => {
        setNotifications(adminNotificationManager.getAll())
        setUnreadCount(adminNotificationManager.getUnreadCount())
      },
      onRead: () => {
        setNotifications(adminNotificationManager.getAll())
        setUnreadCount(adminNotificationManager.getUnreadCount())
      },
      onReadAll: () => {
        setNotifications(adminNotificationManager.getAll())
        setUnreadCount(adminNotificationManager.getUnreadCount())
      },
    })

    // Load initial state
    setNotifications(adminNotificationManager.getAll())
    setUnreadCount(adminNotificationManager.getUnreadCount())

    // Poll for updates
    const interval = setInterval(() => {
      setNotifications(adminNotificationManager.getAll())
      setUnreadCount(adminNotificationManager.getUnreadCount())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return {
    notifications,
    unreadCount,
    markAsRead: (id: string) => adminNotificationManager.markAsRead(id),
    markAllAsRead: () => adminNotificationManager.markAllAsRead(),
    remove: (id: string) => adminNotificationManager.remove(id),
    clear: () => adminNotificationManager.clear(),
    clearRead: () => adminNotificationManager.clearRead(),
  }
}
