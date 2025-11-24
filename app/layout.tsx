import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import CommandPalette from "@/components/command-palette"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import TerminalBackground from "@/components/terminal-background"
import { Toaster } from "@/components/ui/sonner"
import AchievementTracker from "@/components/achievements/achievement-tracker"
import KeyboardShortcutHint from "@/components/keyboard-shortcut-hint"
import InteractiveOnboarding from "@/components/onboarding/interactive-onboarding"

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
        <TerminalBackground />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <CommandPalette />
          <AchievementTracker />
          <KeyboardShortcutHint />
          <InteractiveOnboarding />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <Toaster />
      </body>
    </html>
  )
}
