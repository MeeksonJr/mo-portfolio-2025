'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    googleTranslateElementInit: () => void
    google: {
      translate: {
        TranslateElement: new (options: object, element: string) => void
      }
    }
  }
}

/**
 * Mounts the Google Translate widget (hidden via CSS).
 * The LanguageSwitcher component triggers translation by directly
 * manipulating the hidden <select> element the widget renders.
 */
export function GoogleTranslateScript() {
  useEffect(() => {
    if (document.getElementById('google-translate-script')) return

    window.googleTranslateElementInit = () => {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages:
              'en,fr,es,ar,zh-CN,de,pt,ru,ja,ko,hi,sw,it,nl',
            layout: 0,
            autoDisplay: false,
            multilanguagePage: false,
          },
          'google_translate_element'
        )
      } catch (e) {
        console.warn('Google Translate failed to initialize:', e)
      }
    }

    const script = document.createElement('script')
    script.id = 'google-translate-script'
    script.src =
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    script.defer = true
    script.onerror = () => {
      console.warn('Google Translate script failed to load.')
    }
    document.head.appendChild(script)
  }, [])

  return (
    <>
      {/* Required mount point for the Google Translate widget */}
      <div id="google_translate_element" style={{ display: 'none' }} aria-hidden="true" />
      {/* Completely suppress the Google Translate toolbar that appears at top-of-page */}
      <style>{`
        .goog-te-banner-frame.skiptranslate,
        .goog-te-balloon-frame,
        .VIpgJd-ZVi9od-aZ2wEe-wOHMyf,
        .VIpgJd-ZVi9od-aZ2wEe-OiiCO,
        body > .skiptranslate {
          display: none !important;
        }
        body {
          top: 0 !important;
          position: static !important;
        }
        .goog-te-menu-value span:last-child {
          display: none;
        }
      `}</style>
    </>
  )
}
