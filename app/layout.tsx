import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import CommandPalette from "@/components/command-palette"
import { ThemeProvider } from "@/components/theme-provider"
import { PreferencesProvider } from "@/components/preferences/preferences-provider"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import TerminalBackground from "@/components/terminal-background"
import { Toaster } from "@/components/ui/sonner"
import AchievementTracker from "@/components/achievements/achievement-tracker"
import KeyboardShortcutHint from "@/components/keyboard-shortcut-hint"
import InteractiveOnboarding from "@/components/onboarding/interactive-onboarding"
import { BottomNavigation } from "@/components/mobile/bottom-navigation"
import { SwipeNavigation } from "@/components/mobile/swipe-navigation"
import { InstallPrompt } from "@/components/pwa/install-prompt"
import { OfflineIndicator } from "@/components/pwa/offline-indicator"
import { ErrorBoundary } from "@/components/error-boundary"
import { ErrorHandler } from "@/components/error-handler"
import FloatingActionMenu from "@/components/floating-action-menu"
import VisitorProfileProvider from "@/components/personalization/visitor-profile-provider"
import MobileBottomNav from "@/components/mobile/mobile-bottom-nav"
import SkipToContent from "@/components/accessibility/skip-to-content"
import CustomCursor from "@/components/ui/custom-cursor"
import { TranslationProvider } from "@/components/i18n/translation-provider"
import KeyboardShortcutsHandler from "@/components/keyboard-shortcuts-handler"
import KeyboardShortcutsModal from "@/components/keyboard-shortcuts-modal"
import EnhancedKeyboardNavigation from "@/components/accessibility/enhanced-keyboard-navigation"
import ClientLayoutWrapper from "@/components/layout/client-layout-wrapper"
import AccessibilityAudit from "@/components/accessibility/accessibility-audit"
import OrganizationSchema from "@/components/structured-data/organization-schema"
import WebsiteSchema from "@/components/structured-data/website-schema"
import ConversionTracker from "@/components/analytics/conversion-tracker"
import GuidedTour from "@/components/onboarding/guided-tour"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Mohamed Datt | Full Stack Developer",
    template: "%s | Mohamed Datt",
  },
  description: "Creative Full Stack Developer specializing in AI-powered web applications, Next.js, TypeScript, and modern web technologies. Building innovative solutions from Guinea to Norfolk.",
  keywords: ["Full Stack Developer", "Next.js", "TypeScript", "React", "AI", "Web Development", "Portfolio"],
  authors: [{ name: "Mohamed Datt" }],
  creator: "Mohamed Datt",
  publisher: "Mohamed Datt",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com'),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mohamed Datt",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com',
    siteName: "Mohamed Datt",
    title: "Mohamed Datt | Full Stack Developer",
    description: "Creative Full Stack Developer specializing in AI-powered web applications",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mohamed Datt - Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohamed Datt | Full Stack Developer",
    description: "Creative Full Stack Developer specializing in AI-powered web applications",
    creator: "@MohamedDatt", // Update with your actual Twitter handle
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={inter.className}>
        <OrganizationSchema />
        <WebsiteSchema />
        <SkipToContent />
        <div
          id="screen-reader-announcements"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        />
        <CustomCursor />
        <TerminalBackground />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          enableColorScheme
        >
          <PreferencesProvider>
            <TranslationProvider>
              <VisitorProfileProvider>
                <ErrorHandler />
                <ErrorBoundary>
                  <KeyboardShortcutsHandler />
                  <EnhancedKeyboardNavigation />
                  <AccessibilityAudit />
                  <ClientLayoutWrapper>
                    {children}
                  </ClientLayoutWrapper>
              <CommandPalette />
              <KeyboardShortcutsModal />
              <AchievementTracker />
              <KeyboardShortcutHint />
              <InteractiveOnboarding />
              <BottomNavigation />
              <SwipeNavigation />
              <InstallPrompt />
              <OfflineIndicator />
              <FloatingActionMenu />
                </ErrorBoundary>
              </VisitorProfileProvider>
            </TranslationProvider>
          </PreferencesProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <ConversionTracker />
        <GuidedTour />
        <Toaster />
      </body>
    </html>
  )
}
