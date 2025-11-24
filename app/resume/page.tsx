import { Metadata } from 'next'
import ResumeGenerator from '@/components/resume/resume-generator'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Resume | Mohamed Datt',
  description: 'Download Mohamed Datt\'s resume in multiple formats. Full Stack Developer specializing in AI-powered web applications.',
  type: 'website',
  tags: ['resume', 'CV', 'Mohamed Datt', 'Full Stack Developer'],
})

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-background">
      <ResumeGenerator />
    </div>
  )
}

