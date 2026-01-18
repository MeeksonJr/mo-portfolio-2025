import { Metadata } from 'next'
import PageCMSDashboard from '@/components/admin/page-cms-dashboard'
import PageContainer from '@/components/layout/page-container'

export const metadata: Metadata = {
  title: 'Page CMS | Admin Dashboard',
  description: 'Manage page content and images across the site',
}

export default function PageCMSPage() {
  return (
    <PageContainer width="wide" padding="default">
      <div className="py-8">
        <PageCMSDashboard />
      </div>
    </PageContainer>
  )
}

