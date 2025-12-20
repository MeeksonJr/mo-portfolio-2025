import { Metadata } from 'next'
import EnhancedPageLayout from '@/components/layout/enhanced-page-layout'
import TechnicalArchitectureShowcase from '@/components/architecture/technical-architecture-showcase'
import StructuredData from '@/components/structured-data'
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
      <StructuredData
        type="WebSite"
        title="Technical Architecture | Mohamed Datt"
        description="Explore technical architecture patterns, scalability solutions, and security implementations"
        url="/architecture"
      />
      <EnhancedPageLayout
        title="Technical Architecture"
        description="Explore technical architecture patterns, scalability solutions, and security implementations. Interactive diagrams showcasing full-stack, scalability, and security architectures."
      >
        <TechnicalArchitectureShowcase />
      </EnhancedPageLayout>
    </>
  )
}

