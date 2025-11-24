import { Metadata } from 'next'
import TestimonialsTable from '@/components/admin/testimonials-table'

export const metadata: Metadata = {
  title: 'Testimonials | Admin Dashboard',
  description: 'Manage client testimonials and reviews',
}

export default function TestimonialsAdminPage() {
  return (
    <div className="space-y-6">
      <TestimonialsTable />
    </div>
  )
}

