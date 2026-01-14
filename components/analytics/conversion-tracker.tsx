'use client'

import { useEffect } from 'react'
import { initEnhancedAnalytics } from '@/lib/analytics-enhanced'

/**
 * Conversion tracker component
 * Initializes enhanced analytics and tracks conversions
 */
export default function ConversionTracker() {
  useEffect(() => {
    // Initialize enhanced analytics
    initEnhancedAnalytics()

    // Track resume downloads
    const resumeLinks = document.querySelectorAll('a[href*="resume"], a[download*="resume"], a[download*="Resume"]')
    resumeLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (typeof window !== 'undefined' && window.va) {
          window.va('event', {
            name: 'conversion',
            params: {
              type: 'resume_download',
              value: 0,
            },
          })
        }
      })
    })

    // Track contact form submissions
    const contactForms = document.querySelectorAll('form[action*="contact"], form[id*="contact"]')
    contactForms.forEach((form) => {
      form.addEventListener('submit', () => {
        if (typeof window !== 'undefined' && window.va) {
          window.va('event', {
            name: 'conversion',
            params: {
              type: 'contact_form',
              value: 0,
            },
          })
        }
      })
    })

    // Track newsletter signups
    const newsletterForms = document.querySelectorAll('form[action*="newsletter"], form[id*="newsletter"]')
    newsletterForms.forEach((form) => {
      form.addEventListener('submit', () => {
        if (typeof window !== 'undefined' && window.va) {
          window.va('event', {
            name: 'conversion',
            params: {
              type: 'newsletter_signup',
              value: 0,
            },
          })
        }
      })
    })
  }, [])

  return null
}

