import { Metadata } from 'next'
import PageCMSDashboard from '@/components/admin/page-cms-dashboard'

export const metadata: Metadata = {
  title: 'Page CMS | Admin Dashboard',
  description: 'Manage page content and images across the site',
}

export default function PageCMSPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <PageCMSDashboard />
    </div>
  )
}

