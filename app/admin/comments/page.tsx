import { Metadata } from 'next'
import CommentsTable from '@/components/admin/comments-table'

export const metadata: Metadata = {
  title: 'Comments Management | Admin',
  description: 'Manage and moderate comments',
}

export default function AdminCommentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <CommentsTable />
    </div>
  )
}

