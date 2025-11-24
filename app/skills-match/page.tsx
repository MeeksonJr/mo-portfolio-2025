import { Metadata } from 'next'
import SkillsMatchingTool from '@/components/skills-match/skills-matching-tool'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Skills Matching Tool | Mohamed Datt',
  description: 'Input job requirements and see how Mohamed Datt\'s skills match. Get instant match percentage and detailed analysis.',
  type: 'website',
  tags: ['skills', 'matching', 'recruiter', 'job requirements'],
})

export default function SkillsMatchPage() {
  return <SkillsMatchingTool />
}

