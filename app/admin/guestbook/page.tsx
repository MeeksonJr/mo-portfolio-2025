import { Metadata } from 'next'
import GuestbookTable from '@/components/admin/guestbook-table'

export const metadata: Metadata = {
  title: 'Guestbook Management | Admin',
  description: 'Manage guestbook messages',
}

export default function AdminGuestbookPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <GuestbookTable />
    </div>
  )
}

