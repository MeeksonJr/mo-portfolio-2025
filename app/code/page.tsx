import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import CodeHub from '@/components/code/code-hub'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Code Hub | Mohamed Datt',
  description: 'Explore, learn, and interact with real production code. Interactive playgrounds, code reviews, portfolio source code, and a searchable library of code snippets.',
  type: 'website',
  tags: ['code', 'programming', 'code examples', 'code review', 'portfolio code', 'Mohamed Datt'],
})

export default function CodePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main-content" role="main" className="pt-20" tabIndex={-1}>
        <CodeHub />
      </main>
      <FooterLight />
    </div>
  )
}

