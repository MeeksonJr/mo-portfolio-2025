import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import CodeReviewSimulator from '@/components/code-review/code-review-simulator'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Code Review Simulator',
  description: 'Interactive code review experience. Practice your code review skills by adding comments, suggestions, and questions to sample code snippets.',
  type: 'website',
  tags: ['code review', 'developer tools', 'interactive', 'education'],
})

export default function CodeReviewPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main-content" role="main" className="pt-20 pb-16" tabIndex={-1}>
        <CodeReviewSimulator />
      </main>
      <FooterLight />
    </div>
  )
}

