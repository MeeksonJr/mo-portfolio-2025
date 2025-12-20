import { Metadata } from 'next'
import EnhancedPageLayout from '@/components/layout/enhanced-page-layout'
import PortfolioAssistant from '@/components/portfolio-assistant/portfolio-assistant'
import StructuredData from '@/components/structured-data'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'AI Portfolio Assistant | Mohamed Datt',
  description: 'Ask questions about Mohamed Datt\'s portfolio, projects, experience, and skills in natural language. Get instant answers powered by AI.',
  type: 'website',
  tags: ['AI assistant', 'portfolio', 'chatbot', 'Mohamed Datt', 'natural language'],
})

export default function PortfolioAssistantPage() {
  return (
    <>
      <StructuredData
        type="WebSite"
        title="AI Portfolio Assistant | Mohamed Datt"
        description="Ask questions about portfolio, projects, experience, and skills in natural language"
        url="/portfolio-assistant"
      />
      <EnhancedPageLayout
        title="AI Portfolio Assistant"
        description="Ask questions about my portfolio, projects, experience, and skills in natural language. Get instant answers powered by AI."
        className="bg-gradient-to-b from-background to-muted/20"
      >
        <PortfolioAssistant />
      </EnhancedPageLayout>
    </>
  )
}

