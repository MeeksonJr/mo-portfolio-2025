import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import PortfolioComparisonContent from '@/components/portfolio-comparison/portfolio-comparison-content'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Portfolio Comparison | Mohamed Datt',
  description: 'Compare skills, experience, and qualifications side-by-side. Useful tool for recruiters and hiring managers to evaluate candidates.',
  type: 'website',
  tags: ['comparison', 'recruiter', 'candidate', 'skills', 'evaluation'],
})

export default function PortfolioComparisonPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <PortfolioComparisonContent />
      <FooterLight />
    </div>
  )
}

