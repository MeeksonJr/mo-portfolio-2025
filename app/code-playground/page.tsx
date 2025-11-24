import { Metadata } from 'next'
import CodePlayground from '@/components/code-playground/code-playground'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Code Playground',
  description: 'Interactive code examples and snippets. Run, copy, and experiment with code in your browser. Examples include React, TypeScript, JavaScript, and Next.js.',
  type: 'website',
  tags: ['code', 'playground', 'examples', 'snippets', 'javascript', 'typescript', 'react'],
})

export default function CodePlaygroundPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <CodePlayground />
      <FooterLight />
    </div>
  )
}

