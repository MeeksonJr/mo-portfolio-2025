'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import BreadcrumbNavigation from '@/components/navigation/breadcrumb-navigation'
import { EnhancedScrollReveal } from '@/components/animations/enhanced-scroll-reveal'
import ScrollProgressIndicator from '@/components/animations/scroll-progress-indicator'

interface EnhancedPageLayoutProps {
  children: ReactNode
  title?: string
  description?: string
  showBreadcrumbs?: boolean
  className?: string
  headerContent?: ReactNode
  footerContent?: ReactNode
}

export default function EnhancedPageLayout({
  children,
  title,
  description,
  showBreadcrumbs = true,
  className = '',
  headerContent,
  footerContent,
}: EnhancedPageLayoutProps) {
  return (
    <div className={`min-h-screen bg-background relative ${className}`}>
      <ScrollProgressIndicator />
      <Navigation />
      
      {showBreadcrumbs && <BreadcrumbNavigation />}
      
      <main 
        id="main-content" 
        role="main" 
        className="relative z-10 pt-20" 
        tabIndex={-1}
      >
        {(title || description || headerContent) && (
          <EnhancedScrollReveal variant="fade" delay={0.1}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
              {headerContent || (
                <>
                  {title && (
                    <motion.h1
                      className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {title}
                    </motion.h1>
                  )}
                  {description && (
                    <motion.p
                      className="text-lg md:text-xl text-muted-foreground max-w-3xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      {description}
                    </motion.p>
                  )}
                </>
              )}
            </div>
          </EnhancedScrollReveal>
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
          {children}
        </div>
        
        {footerContent && (
          <div className="max-w-6xl mx-auto px-4 pb-8">
            {footerContent}
          </div>
        )}
      </main>
      
      <FooterLight />
    </div>
  )
}

