import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import ProjectAnalyzer from '@/components/project-analyzer/project-analyzer'
import { generateMetadata as genMeta } from '@/lib/seo'
import { Metadata } from 'next'

export const metadata: Metadata = genMeta({
  title: 'AI Project Analyzer',
  description: 'Analyze any GitHub repository with AI-powered insights. Get code quality metrics, tech stack detection, improvement suggestions, and documentation recommendations.',
  type: 'website',
  tags: ['project analyzer', 'github', 'ai', 'code analysis', 'tech stack'],
})

export default function ProjectAnalyzerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20 pb-16">
        <ProjectAnalyzer />
      </main>
      <FooterLight />
    </div>
  )
}

