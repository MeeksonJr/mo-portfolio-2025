import { Metadata } from 'next'
import VirtualBusinessCard from '@/components/business-card/virtual-business-card'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Virtual Business Card | Mohamed Datt',
  description: 'Digital business card with QR code. Share contact information instantly. Download vCard or add to contacts.',
  type: 'website',
  tags: ['business card', 'contact', 'QR code', 'vCard', 'Mohamed Datt'],
})

export default function BusinessCardPage() {
  return <VirtualBusinessCard />
}

