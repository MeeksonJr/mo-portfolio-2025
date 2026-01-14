import { Metadata } from 'next'
import TestimonialSubmissionForm from '@/components/testimonials/testimonial-submission-form'
import EnhancedPageLayout from '@/components/layout/enhanced-page-layout'
import { generateMetadata } from '@/lib/seo'
import { generateMetaDescription } from '@/lib/seo-descriptions'

export const metadata: Metadata = generateMetadata({
  title: 'Submit Testimonial',
  description: generateMetaDescription('testimonials'),
})

export default function TestimonialSubmitPage() {
  return (
    <EnhancedPageLayout
      title="Submit a Testimonial"
      description="Share your experience working with Mohamed Datt"
      showBreadcrumbs={true}
    >
      <TestimonialSubmissionForm />
    </EnhancedPageLayout>
  )
}

