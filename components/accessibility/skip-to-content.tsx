'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function SkipToContent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show skip link when Tab is pressed
      if (e.key === 'Tab' && !isVisible) {
        setIsVisible(true)
      }
    }

    const handleClick = () => {
      // Hide skip link after a short delay when clicked
      setTimeout(() => setIsVisible(false), 100)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('click', handleClick)
    }
  }, [isVisible])

  return (
    <Link
      href="#main-content"
      className={`skip-to-content ${
        isVisible ? 'visible' : ''
      }`}
      onClick={(e) => {
        e.preventDefault()
        const mainContent = document.getElementById('main-content')
        if (mainContent) {
          mainContent.focus()
          mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }}
    >
      Skip to main content
    </Link>
  )
}

