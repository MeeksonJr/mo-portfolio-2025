import { Metadata } from 'next'
import GuestbookTable from '@/components/admin/guestbook-table'
import PageContainer from '@/components/layout/page-container'

export const metadata: Metadata = {
  title: 'Guestbook Management | Admin',
  description: 'Manage guestbook messages',
}

export default function AdminGuestbookPage() {
  return (
    <PageContainer width="wide" padding="default">
      <div className="py-8">
        <GuestbookTable />
      </div>
    </PageContainer>
  )
}

