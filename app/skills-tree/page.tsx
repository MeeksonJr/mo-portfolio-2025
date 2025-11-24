import { Metadata } from 'next'
import InteractiveSkillTree from '@/components/skills/skill-tree'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Skill Tree | Mohamed Datt',
  description: 'Interactive skill tree visualization showing technical skills, dependencies, and related projects. Explore the journey of skill development.',
  type: 'website',
  tags: ['skills', 'skill tree', 'technical skills', 'Mohamed Datt'],
})

export default function SkillTreePage() {
  return <InteractiveSkillTree />
}

