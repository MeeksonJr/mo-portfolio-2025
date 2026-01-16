'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import BreadcrumbNavigation from '@/components/navigation/breadcrumb-navigation'
import { EnhancedScrollReveal } from '@/components/animations/enhanced-scroll-reveal'
import ScrollProgressIndicator from '@/components/animations/scroll-progress-indicator'
import PageContainer, { getContainerClasses } from '@/components/layout/page-container'
import { CONTAINER_WIDTHS, SPACING, TYPOGRAPHY, type ContainerWidth } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

interface EnhancedPageLayoutProps {
  children: ReactNode
  title?: string
  description?: string
  showBreadcrumbs?: boolean
  className?: string
  headerContent?: ReactNode
  footerContent?: ReactNode
  containerWidth?: ContainerWidth
  containerPadding?: 'default' | 'tight' | 'wide'
}

export default function EnhancedPageLayout({
  children,
  title,
  description,
  showBreadcrumbs = true,
  className = '',
  headerContent,
  footerContent,
  containerWidth = 'standard',
  containerPadding = 'default',
}: EnhancedPageLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-background relative', className)}>
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
            <PageContainer width={containerWidth} padding={containerPadding}>
              <div className={cn('py-6 sm:py-8 md:py-12')}>
                {headerContent || (
                  <>
                    {title && (
                      <motion.h1
                        className={cn(TYPOGRAPHY.h1, 'mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent')}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        {title}
                      </motion.h1>
                    )}
                    {description && (
                      <motion.p
                        className={cn(TYPOGRAPHY.lead, 'text-muted-foreground max-w-3xl')}
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
            </PageContainer>
          </EnhancedScrollReveal>
        )}
        
        <PageContainer width={containerWidth} padding={containerPadding}>
          <div className={cn('pb-12 sm:pb-16')}>
            {children}
          </div>
        </PageContainer>
        
        {footerContent && (
          <PageContainer width="standard" padding="default">
            <div className="pb-8">
              {footerContent}
            </div>
          </PageContainer>
        )}
      </main>
      
      <FooterLight />
    </div>
  )
}

