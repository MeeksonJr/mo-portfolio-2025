/**
 * Enhanced Toast Helpers
 * Provides utility functions for creating toasts with actions, progress, and custom styling
 */

import { toast as sonnerToast, type ExternalToast } from 'sonner'

interface ToastAction {
  label: string
  onClick: () => void
}

interface ToastOptions {
  duration?: number
  action?: ToastAction
  cancel?: {
    label: string
    onClick?: () => void
  }
  description?: string
  icon?: React.ReactNode
  onDismiss?: () => void
  onAutoClose?: () => void
}

/**
 * Show a success toast with optional action button
 */
export const showSuccessToast = (message: string, options?: ToastOptions) => {
  const toastOptions: ExternalToast = {
    description: options?.description,
    duration: options?.duration || 4000,
    icon: options?.icon,
    onDismiss: options?.onDismiss,
    onAutoClose: options?.onAutoClose,
  }

  if (options?.action) {
    toastOptions.action = {
      label: options.action.label,
      onClick: (event) => {
        event.preventDefault()
        options.action!.onClick()
      },
    }
  }

  if (options?.cancel) {
    toastOptions.cancel = {
      label: options.cancel.label,
      onClick: options.cancel.onClick
        ? (event) => {
            event.preventDefault()
            options.cancel!.onClick!()
          }
        : () => {}, // Provide empty function if onClick not provided
    }
  }

  return sonnerToast.success(message, toastOptions)
}

/**
 * Show an error toast with optional action button
 */
export const showErrorToast = (message: string, options?: ToastOptions) => {
  const toastOptions: ExternalToast = {
    description: options?.description,
    duration: options?.duration || 5000,
    icon: options?.icon,
    onDismiss: options?.onDismiss,
    onAutoClose: options?.onAutoClose,
  }

  if (options?.action) {
    toastOptions.action = {
      label: options.action.label,
      onClick: (event) => {
        event.preventDefault()
        options.action!.onClick()
      },
    }
  }

  if (options?.cancel) {
    toastOptions.cancel = {
      label: options.cancel.label,
      onClick: options.cancel.onClick
        ? (event) => {
            event.preventDefault()
            options.cancel!.onClick!()
          }
        : () => {}, // Provide empty function if onClick not provided
    }
  }

  return sonnerToast.error(message, toastOptions)
}

/**
 * Show an info toast with optional action button
 */
export const showInfoToast = (message: string, options?: ToastOptions) => {
  const toastOptions: ExternalToast = {
    description: options?.description,
    duration: options?.duration || 4000,
    icon: options?.icon,
    onDismiss: options?.onDismiss,
    onAutoClose: options?.onAutoClose,
  }

  if (options?.action) {
    toastOptions.action = {
      label: options.action.label,
      onClick: (event) => {
        event.preventDefault()
        options.action!.onClick()
      },
    }
  }

  if (options?.cancel) {
    toastOptions.cancel = {
      label: options.cancel.label,
      onClick: options.cancel.onClick
        ? (event) => {
            event.preventDefault()
            options.cancel!.onClick!()
          }
        : () => {}, // Provide empty function if onClick not provided
    }
  }

  return sonnerToast.info(message, toastOptions)
}

/**
 * Show a warning toast with optional action button
 */
export const showWarningToast = (message: string, options?: ToastOptions) => {
  const toastOptions: ExternalToast = {
    description: options?.description,
    duration: options?.duration || 4000,
    icon: options?.icon,
    onDismiss: options?.onDismiss,
    onAutoClose: options?.onAutoClose,
  }

  if (options?.action) {
    toastOptions.action = {
      label: options.action.label,
      onClick: (event) => {
        event.preventDefault()
        options.action!.onClick()
      },
    }
  }

  if (options?.cancel) {
    toastOptions.cancel = {
      label: options.cancel.label,
      onClick: options.cancel.onClick
        ? (event) => {
            event.preventDefault()
            options.cancel!.onClick!()
          }
        : () => {}, // Provide empty function if onClick not provided
    }
  }

  return sonnerToast.warning(message, toastOptions)
}

/**
 * Show a loading toast that can be updated or dismissed
 */
export const showLoadingToast = (message: string, description?: string) => {
  return sonnerToast.loading(message, {
    description,
    duration: Infinity, // Don't auto-dismiss loading toasts
  })
}

/**
 * Show a toast with progress indicator
 */
export const showProgressToast = (
  message: string,
  progress: number,
  options?: Omit<ToastOptions, 'duration'>
) => {
  const progressDescription = options?.description
    ? `${options.description} (${Math.round(progress)}%)`
    : `${Math.round(progress)}%`

  const toastOptions: ExternalToast = {
    description: progressDescription,
    duration: Infinity,
    icon: options?.icon,
    onDismiss: options?.onDismiss,
  }

  if (options?.action) {
    toastOptions.action = {
      label: options.action.label,
      onClick: (event) => {
        event.preventDefault()
        options.action!.onClick()
      },
    }
  }

  return sonnerToast(message, toastOptions)
}

/**
 * Promise-based toast - shows loading, then success/error
 */
export const showPromiseToast = <T,>(
  promise: Promise<T>,
  {
    loading,
    success,
    error,
  }: {
    loading: string
    success: string | ((data: T) => string)
    error: string | ((error: any) => string)
  }
) => {
  return sonnerToast.promise(promise, {
    loading,
    success,
    error,
  })
}

