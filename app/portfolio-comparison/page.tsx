import { Metadata } from 'next'
import EnhancedPageLayout from '@/components/layout/enhanced-page-layout'
import PortfolioComparisonContent from '@/components/portfolio-comparison/portfolio-comparison-content'
import StructuredData from '@/components/structured-data'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Portfolio Comparison | Mohamed Datt',
  description: 'Compare skills, experience, and qualifications side-by-side. Useful tool for recruiters and hiring managers to evaluate candidates.',
  type: 'website',
  tags: ['comparison', 'recruiter', 'candidate', 'skills', 'evaluation'],
})

export default function PortfolioComparisonPage() {
  return (
    <>
      <StructuredData
        type="WebSite"
        title="Portfolio Comparison | Mohamed Datt"
        description="Compare skills, experience, and qualifications side-by-side"
        url="/portfolio-comparison"
      />
      <EnhancedPageLayout
        title="Portfolio Comparison"
        description="Compare skills, experience, and qualifications side-by-side. Useful tool for recruiters and hiring managers to evaluate candidates."
        className="bg-muted/30"
      >
        <PortfolioComparisonContent />
      </EnhancedPageLayout>
    </>
  )
}

