import { Metadata } from 'next'
import UniversalContactHub from '@/components/contact-hub/universal-contact-hub'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Contact Hub | Mohamed Datt',
  description: 'Get in touch with Mohamed Datt through any channel you prefer. Email, calendar booking, LinkedIn, GitHub, and more.',
  type: 'website',
  tags: ['contact', 'get in touch', 'Mohamed Datt', 'hiring', 'collaboration'],
})

export default function ContactHubPage() {
  return <UniversalContactHub />
}

