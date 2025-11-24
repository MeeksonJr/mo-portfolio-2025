import { Metadata } from 'next'
import PortfolioAssistant from '@/components/portfolio-assistant/portfolio-assistant'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'AI Portfolio Assistant | Mohamed Datt',
  description: 'Ask questions about Mohamed Datt\'s portfolio, projects, experience, and skills in natural language. Get instant answers powered by AI.',
  type: 'website',
  tags: ['AI assistant', 'portfolio', 'chatbot', 'Mohamed Datt', 'natural language'],
})

export default function PortfolioAssistantPage() {
  return <PortfolioAssistant />
}

