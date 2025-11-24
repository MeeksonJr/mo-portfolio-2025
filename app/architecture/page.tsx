import { Metadata } from 'next'
import TechnicalArchitectureShowcase from '@/components/architecture/technical-architecture-showcase'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Technical Architecture | Mohamed Datt',
  description: 'Explore technical architecture patterns, scalability solutions, and security implementations. Interactive diagrams showcasing full-stack, scalability, and security architectures.',
  type: 'website',
  tags: ['architecture', 'technical', 'scalability', 'security', 'full-stack'],
})

export default function ArchitecturePage() {
  return (
    <>
      <div className="min-h-screen bg-background">
        <Navigation />
        <TechnicalArchitectureShowcase />
        <FooterLight />
      </div>
    </>
  )
}

