import { Metadata } from 'next'
import TestimonialsTable from '@/components/admin/testimonials-table'
import { TYPOGRAPHY } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Testimonials | Admin Dashboard',
  description: 'Manage client testimonials and reviews',
}

export default function TestimonialsAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn(TYPOGRAPHY.h2)}>Testimonials</h1>
          <p className="text-muted-foreground mt-2">
            Manage client testimonials and reviews
          </p>
        </div>
        <a
          href="/testimonials/submit"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          Share Submission Link ↗
        </a>
      </div>
      <TestimonialsTable />
    </div>
  )
}

