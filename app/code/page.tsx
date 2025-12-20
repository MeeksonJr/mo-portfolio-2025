import { Metadata } from 'next'
import EnhancedPageLayout from '@/components/layout/enhanced-page-layout'
import CodeHub from '@/components/code/code-hub'
import StructuredData from '@/components/structured-data'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Code Hub | Mohamed Datt',
  description: 'Explore, learn, and interact with real production code. Interactive playgrounds, code reviews, portfolio source code, and a searchable library of code snippets.',
  type: 'website',
  tags: ['code', 'programming', 'code examples', 'code review', 'portfolio code', 'Mohamed Datt'],
})

export default function CodePage() {
  return (
    <>
      <StructuredData
        type="WebSite"
        title="Code Hub | Mohamed Datt"
        description="Explore, learn, and interact with real production code"
        url="/code"
      />
      <EnhancedPageLayout
        title="Code Hub"
        description="Explore, learn, and interact with real production code. Interactive playgrounds, code reviews, portfolio source code, and a searchable library of code snippets."
      >
        <CodeHub />
      </EnhancedPageLayout>
    </>
  )
}

