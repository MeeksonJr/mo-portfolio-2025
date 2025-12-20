import { Metadata } from 'next'
import EnhancedPageLayout from '@/components/layout/enhanced-page-layout'
import TestimonialsPageContent from '@/components/testimonials/testimonials-page-content'
import StructuredData from '@/components/structured-data'

export const metadata: Metadata = {
  title: 'Testimonials | Mohamed Datt',
  description: 'Client testimonials and reviews from projects, colleagues, and collaborators',
}

export default function TestimonialsPage() {
  return (
    <>
      <StructuredData
        type="Person"
        title="Testimonials - Mohamed Datt"
        description="Client testimonials and reviews"
        url="/testimonials"
      />
      <EnhancedPageLayout
        title="Testimonials"
        description="Client testimonials and reviews from projects, colleagues, and collaborators."
      >
        <TestimonialsPageContent />
      </EnhancedPageLayout>
    </>
  )
}

