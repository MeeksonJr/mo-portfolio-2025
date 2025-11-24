import { Metadata } from 'next'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
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
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20 pb-16">
          <TestimonialsPageContent />
        </main>
        <FooterLight />
      </div>
    </>
  )
}

