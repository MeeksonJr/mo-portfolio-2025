/**
 * PWA Utility Functions
 */

/**
 * Check if the app is installed as a PWA
 */
export function isPWAInstalled(): boolean {
  if (typeof window === 'undefined') return false

  // Check if running in standalone mode
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true
  }

  // Check if running in fullscreen mode (iOS)
  if ((window.navigator as any).standalone === true) {
    return true
  }

  // Check localStorage flag
  return localStorage.getItem('pwa-installed') === 'true'
}

/**
 * Check if device is iOS
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
}

/**
 * Check if device is Android
 */
export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false
  return /Android/.test(navigator.userAgent)
}

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return isIOS() || isAndroid() || window.innerWidth < 768
}

/**
 * Check if device likely has a keyboard (desktop/laptop)
 * Uses screen size and touch capability as indicators
 */
export function hasKeyboard(): boolean {
  if (typeof window === 'undefined') return false
  
  // Check screen width - desktop/laptop typically have larger screens
  const isLargeScreen = window.innerWidth >= 1024 || window.screen.width >= 1024
  
  // Check if device is touch-capable (mobile/tablet usually are, desktop usually aren't)
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  
  // Check user agent for desktop indicators
  const userAgent = navigator.userAgent.toLowerCase()
  const isDesktopUA = !userAgent.includes('mobile') && 
                      !userAgent.includes('android') && 
                      !userAgent.includes('iphone') && 
                      !userAgent.includes('ipad') &&
                      !userAgent.includes('tablet')
  
  // Device has keyboard if:
  // - Large screen AND (not touch device OR desktop user agent)
  // - OR specifically desktop user agent
  return (isLargeScreen && (!isTouchDevice || isDesktopUA)) || isDesktopUA
}

/**
 * Register service worker for background sync
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    })

    console.log('Service Worker registered:', registration.scope)
    return registration
  } catch (error) {
    console.error('Service Worker registration failed:', error)
    return null
  }
}

/**
 * Request notification permission
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

  try {
    const permission = await Notification.requestPermission()
    return permission
  } catch (error) {
    console.error('Error requesting notification permission:', error)
    return 'denied'
  }
}

/**
 * Show a notification (if permission is granted)
 */
export function showNotification(title: string, options?: NotificationOptions): void {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return
  }

  if (Notification.permission !== 'granted') {
    return
  }

  try {
    new Notification(title, {
      icon: '/placeholder-logo.png',
      badge: '/placeholder-logo.png',
      ...options,
    })
  } catch (error) {
    console.error('Error showing notification:', error)
  }
}

