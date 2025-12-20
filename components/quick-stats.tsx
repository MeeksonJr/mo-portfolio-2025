"use client"

import EnhancedQuickStats from '@/components/homepage/enhanced-quick-stats'
import BentoCardWrapper from '@/components/homepage/bento-card-wrapper'

export default function QuickStats() {
  return (
    <BentoCardWrapper variant="compact" delay={0.1}>
      <EnhancedQuickStats />
    </BentoCardWrapper>
  )
}
