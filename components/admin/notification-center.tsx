'use client'

import { useState, useEffect } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bell, Check, CheckCheck, X, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  AdminNotification,
  adminNotificationManager,
  NotificationType,
} from '@/lib/notifications/admin-notifications'
import { formatDistanceToNow } from 'date-fns'

const notificationIcons = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
}

const notificationColors = {
  success: 'bg-green-500/10 text-green-600 border-green-500/20',
  error: 'bg-red-500/10 text-red-600 border-red-500/20',
  info: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  warning: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
}

interface NotificationItemProps {
  notification: AdminNotification
  onRead: (id: string) => void
  onRemove: (id: string) => void
}

const NotificationItem = ({
  notification,
  onRead,
  onRemove,
}: NotificationItemProps) => {
  return (
    <div
      className={cn(
        'p-3 rounded-lg border transition-colors',
        notification.read
          ? 'bg-muted/50'
          : 'bg-background hover:bg-accent/50',
        notificationColors[notification.type]
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-6 h-6 rounded-full bg-current/20 flex items-center justify-center text-xs font-bold">
            {notificationIcons[notification.type]}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p
                className={cn(
                  'text-sm font-medium',
                  notification.read ? 'text-muted-foreground' : ''
                )}
              >
                {notification.title}
              </p>
              {notification.message && (
                <p
                  className={cn(
                    'text-xs mt-1',
                    notification.read ? 'text-muted-foreground' : 'text-muted-foreground'
                  )}
                >
                  {notification.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onRead(notification.id)}
                  title="Mark as read"
                >
                  <Check className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onRemove(notification.id)}
                title="Remove"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
          {notification.action && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2 h-7 text-xs"
              onClick={notification.action.onClick}
            >
              {notification.action.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Set up callbacks
    adminNotificationManager.setCallbacks({
      onAdd: (notification) => {
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

    // Load initial notifications
    setNotifications(adminNotificationManager.getAll())
    setUnreadCount(adminNotificationManager.getUnreadCount())

    // Poll for updates (in case notifications are added from other sources)
    const interval = setInterval(() => {
      setNotifications(adminNotificationManager.getAll())
      setUnreadCount(adminNotificationManager.getUnreadCount())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleRead = (id: string) => {
    adminNotificationManager.markAsRead(id)
  }

  const handleRemove = (id: string) => {
    adminNotificationManager.remove(id)
  }

  const handleReadAll = () => {
    adminNotificationManager.markAllAsRead()
  }

  const handleClearRead = () => {
    adminNotificationManager.clearRead()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={handleReadAll}
                >
                  <CheckCheck className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
            </div>
          </div>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground"
              onClick={handleClearRead}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={handleRead}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
