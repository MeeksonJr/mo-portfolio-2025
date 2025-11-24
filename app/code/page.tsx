import { Metadata } from 'next'
import CodeSnippetLibrary from '@/components/code/code-snippet-library'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Code Snippets Library | Mohamed Datt',
  description: 'Browse and learn from real production code snippets. Searchable library of code examples with syntax highlighting, categorized by technology and use case.',
  type: 'website',
  tags: ['code snippets', 'code examples', 'programming', 'tutorials', 'Mohamed Datt'],
})

export default function CodePage() {
  return <CodeSnippetLibrary />
}

