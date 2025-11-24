import { Metadata } from 'next'
import ContentRecommendations from '@/components/recommendations/content-recommendations'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Content Recommendations | Mohamed Datt',
  description: 'AI-powered content recommendations based on your interests. Discover relevant projects, blog posts, and resources tailored to you.',
  type: 'website',
  tags: ['recommendations', 'AI', 'personalized content', 'Mohamed Datt'],
})

export default function RecommendationsPage() {
  return <ContentRecommendations />
}

