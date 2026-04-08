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
 * Injects the Google Translate script and initializes the widget.
 * The visible widget is hidden via CSS; translation is triggered
 * programmatically by changing the `googtrans` cookie.
 */
export function GoogleTranslateScript() {
  useEffect(() => {
    // Prevent double-injection
    if (document.getElementById('google-translate-script')) return

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages:
            'en,fr,es,ar,zh-CN,de,pt,ru,ja,ko,hi,sw,it,nl,pl',
          layout: 0, // SIMPLE layout, keeps no visible branding bar
          autoDisplay: false,
        },
        'google_translate_element'
      )
    }

    const script = document.createElement('script')
    script.id = 'google-translate-script'
    script.src =
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }, [])

  return (
    <>
      {/* Hidden container required by the Google Translate widget */}
      <div id="google_translate_element" className="hidden" aria-hidden="true" />
      {/* Suppress the floating Google Translate toolbar */}
      <style>{`
        .goog-te-banner-frame,
        .goog-te-balloon-frame,
        .goog-te-gadget,
        .goog-logo-link,
        body > .skiptranslate {
          display: none !important;
          visibility: hidden !important;
        }
        body {
          top: 0 !important;
        }
      `}</style>
    </>
  )
}
