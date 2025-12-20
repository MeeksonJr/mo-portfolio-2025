'use client'

import { useEffect } from 'react'

export default function AccessibilityAudit() {
  useEffect(() => {
    // Check for accessibility issues
    const checkAccessibility = () => {
      // Check for missing alt text on images
      const images = document.querySelectorAll('img')
      images.forEach((img) => {
        if (!img.getAttribute('alt') && !img.getAttribute('aria-hidden')) {
          console.warn('Image missing alt text:', img.src)
        }
      })

      // Check for missing labels on form inputs
      const inputs = document.querySelectorAll('input, textarea, select')
      inputs.forEach((input) => {
        const id = input.getAttribute('id')
        const label = id ? document.querySelector(`label[for="${id}"]`) : null
        const ariaLabel = input.getAttribute('aria-label')
        const ariaLabelledBy = input.getAttribute('aria-labelledby')
        
        if (!label && !ariaLabel && !ariaLabelledBy && !input.getAttribute('aria-hidden')) {
          console.warn('Input missing label:', input)
        }
      })

      // Check for proper heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      let previousLevel = 0
      headings.forEach((heading) => {
        const level = parseInt(heading.tagName.charAt(1))
        if (level > previousLevel + 1) {
          console.warn('Heading hierarchy skip detected:', heading)
        }
        previousLevel = level
      })

      // Check for sufficient color contrast (basic check)
      const checkContrast = (element: HTMLElement) => {
        const style = window.getComputedStyle(element)
        const color = style.color
        const bgColor = style.backgroundColor
        // This is a simplified check - full contrast checking would require color parsing
        if (color === bgColor) {
          console.warn('Potential contrast issue:', element)
        }
      }

      // Check focus indicators
      const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      )
      focusableElements.forEach((element) => {
        const style = window.getComputedStyle(element)
        const outline = style.outline
        const outlineWidth = style.outlineWidth
        if (outline === 'none' && outlineWidth === '0px') {
          // Check if there's an alternative focus indicator
          const boxShadow = style.boxShadow
          if (!boxShadow || boxShadow === 'none') {
            console.warn('Element may lack visible focus indicator:', element)
          }
        }
      })
    }

    // Run audit after page load
    const timer = setTimeout(checkAccessibility, 1000)

    return () => clearTimeout(timer)
  }, [])

  return null
}

