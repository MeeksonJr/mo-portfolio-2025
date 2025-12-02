'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  Trophy,
  FileText,
  Cog,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
  getUnreadCount,
  type Notification,
} from '@/lib/notifications'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

const NOTIFICATION_ICONS = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
  achievement: Trophy,
  content: FileText,
  system: Cog,
}

const NOTIFICATION_COLORS = {
  info: 'text-blue-500',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  error: 'text-red-500',
  achievement: 'text-purple-500',
  content: 'text-blue-500',
  system: 'text-gray-500',
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Load notifications
    const loadNotifications = () => {
      const notifs = getNotifications()
      setNotifications(notifs)
      setUnreadCount(getUnreadCount())
    }

    loadNotifications()

    // Listen for new notifications
    const handleNotification = (e: CustomEvent) => {
      loadNotifications()
    }

    window.addEventListener('notification', handleNotification as EventListener)

    // Poll for updates (every 30 seconds)
    const interval = setInterval(loadNotifications, 30000)

    return () => {
      window.removeEventListener('notification', handleNotification as EventListener)
      clearInterval(interval)
    }
  }, [])

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id)
    setNotifications(getNotifications())
    setUnreadCount(getUnreadCount())
  }

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead()
    setNotifications(getNotifications())
    setUnreadCount(0)
  }

  const handleDelete = (id: string) => {
    deleteNotification(id)
    setNotifications(getNotifications())
    setUnreadCount(getUnreadCount())
  }

  const handleClearAll = () => {
    clearAllNotifications()
    setNotifications([])
    setUnreadCount(0)
  }

  const unreadNotifications = notifications.filter((n) => !n.read)
  const readNotifications = notifications.filter((n) => n.read)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="h-7 text-xs"
                >
                  <CheckCheck className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="h-7 text-xs text-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <p className="text-xs text-muted-foreground">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {/* Unread notifications */}
              <AnimatePresence>
                {unreadNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>

              {/* Read notifications */}
              {readNotifications.length > 0 && (
                <div className="p-2 text-xs text-muted-foreground font-semibold">
                  Earlier
                </div>
              )}
              <AnimatePresence>
                {readNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                setOpen(false)
                // Navigate to full notifications page if it exists
                window.location.href = '/notifications'
              }}
            >
              View all notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}

function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const Icon = NOTIFICATION_ICONS[notification.type] || Info
  const colorClass = NOTIFICATION_COLORS[notification.type] || 'text-gray-500'

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className={`p-3 hover:bg-muted/50 transition-colors ${
        !notification.read ? 'bg-muted/30' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${colorClass}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm font-medium">{notification.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{notification.message}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                </span>
                {notification.priority === 'high' && (
                  <Badge variant="destructive" className="text-xs">
                    High
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <Check className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onDelete(notification.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
          {notification.actionUrl && (
            <Link href={notification.actionUrl}>
              <Button variant="link" size="sm" className="h-auto p-0 mt-2 text-xs">
                {notification.actionLabel || 'View'} →
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}

