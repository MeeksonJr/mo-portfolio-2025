import { Metadata } from 'next'
import EnhancedPageLayout from '@/components/layout/enhanced-page-layout'
import ToolsHub from '@/components/tools/tools-hub'
import StructuredData from '@/components/structured-data'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Tools Hub | Mohamed Datt',
  description: 'Interactive tools and utilities: AI project analyzer, skills matching, ROI calculator, assessment dashboard, contact hub, and virtual business card.',
  type: 'website',
  tags: ['tools', 'project analyzer', 'skills match', 'ROI calculator', 'assessment', 'contact hub', 'business card'],
})

export default function ToolsPage() {
  return (
    <>
      <StructuredData
        type="WebSite"
        title="Tools Hub | Mohamed Datt"
        description="Interactive tools and utilities for developers and businesses"
        url="/tools"
      />
      <EnhancedPageLayout
        title="Tools Hub"
        description="Interactive tools and utilities: AI project analyzer, skills matching, ROI calculator, assessment dashboard, contact hub, and virtual business card."
      >
        <ToolsHub />
      </EnhancedPageLayout>
    </>
  )
}

