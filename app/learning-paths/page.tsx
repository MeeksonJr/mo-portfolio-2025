import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import { generateMetadata as genMeta } from '@/lib/seo'
import LearningPathGenerator from '@/components/learning/learning-path-generator'

export const metadata: Metadata = genMeta({
  title: 'Learning Paths | Mohamed Datt',
  description: 'Generate personalized learning paths for frontend, full-stack, or AI development based on your goals and time commitment.',
  type: 'website',
  tags: ['learning', 'career', 'education', 'Mohamed Datt'],
})

export default function LearningPathsPage() {
  return (
    <>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20 pb-16">
          <LearningPathGenerator />
        </main>
        <FooterLight />
      </div>
    </>
  )
}

