/**
 * Widget Utility Functions for iOS and Android
 */

import { isIOS, isAndroid } from './pwa-utils'

/**
 * Check if device supports widget installation
 */
export function canInstallWidgets(): boolean {
  if (typeof window === 'undefined') return false
  return isIOS() || isAndroid()
}

/**
 * Get platform-specific widget installation instructions
 */
export function getWidgetInstallInstructions(): {
  platform: 'ios' | 'android' | 'unsupported'
  steps: string[]
  tips: string[]
} {
  if (typeof window === 'undefined') {
    return {
      platform: 'unsupported',
      steps: [],
      tips: [],
    }
  }

  if (isIOS()) {
    return {
      platform: 'ios',
      steps: [
        'Tap the "Install" button on any widget',
        'The widget page will open in Safari',
        'Tap the Share button (square with arrow)',
        'Scroll down and select "Add to Home Screen"',
        'Customize the widget name if desired',
        'Tap "Add" in the top right corner',
      ],
      tips: [
        'Widgets automatically refresh every few minutes',
        'Long press the widget icon for additional options',
        'Organize widgets into folders on your home screen',
      ],
    }
  }

  if (isAndroid()) {
    return {
      platform: 'android',
      steps: [
        'Tap the "Install" button on any widget',
        'The widget page will open in Chrome/Edge',
        'Tap the menu button (three dots) in the top right',
        'Select "Add to Home screen" or "Install app"',
        'Customize the widget name if desired',
        'Tap "Add" or "Install"',
      ],
      tips: [
        'Widgets automatically refresh every 2-5 minutes via background sync',
        'Works with Chrome, Edge, Samsung Internet, and other Chromium browsers',
        'Background sync ensures widgets stay updated even when closed',
        'Long press the widget icon for additional options',
      ],
    }
  }

  return {
    platform: 'unsupported',
    steps: [],
    tips: [],
  }
}

/**
 * Install widget to home screen
 */
export async function installWidget(widgetUrl: string, widgetName: string): Promise<boolean> {
  if (typeof window === 'undefined') return false

  try {
    // For iOS - just open the URL, user needs to manually add
    if (isIOS()) {
      window.open(widgetUrl, '_blank')
      return true
    }

    // For Android - check if beforeinstallprompt event is available
    if (isAndroid() && 'serviceWorker' in navigator) {
      // Register service worker if not already registered
      try {
        const registration = await navigator.serviceWorker.ready
        if (!registration) {
          await navigator.serviceWorker.register('/sw.js')
        }
      } catch (error) {
        console.error('Service worker registration error:', error)
      }

      // Open the widget URL for manual installation
      window.open(widgetUrl, '_blank')
      return true
    }

    return false
  } catch (error) {
    console.error('Error installing widget:', error)
    return false
  }
}

/**
 * Check if widget is installed
 */
export function isWidgetInstalled(widgetId: string): boolean {
  if (typeof window === 'undefined') return false

  try {
    const installed = localStorage.getItem('installed_widgets')
    if (installed) {
      const widgets = JSON.parse(installed)
      return Array.isArray(widgets) && widgets.includes(widgetId)
    }
  } catch (error) {
    console.error('Error checking widget installation:', error)
  }

  return false
}

/**
 * Mark widget as installed
 */
export function markWidgetInstalled(widgetId: string): void {
  if (typeof window === 'undefined') return

  try {
    const installed = localStorage.getItem('installed_widgets')
    const widgets = installed ? JSON.parse(installed) : []
    
    if (!widgets.includes(widgetId)) {
      widgets.push(widgetId)
      localStorage.setItem('installed_widgets', JSON.stringify(widgets))
    }
  } catch (error) {
    console.error('Error marking widget as installed:', error)
  }
}

/**
 * Get widget refresh interval based on platform
 */
export function getWidgetRefreshInterval(): number {
  if (isAndroid()) {
    return 2 * 60 * 1000 // 2 minutes for Android (better background sync)
  }
  if (isIOS()) {
    return 5 * 60 * 1000 // 5 minutes for iOS
  }
  return 5 * 60 * 1000 // Default 5 minutes
}

