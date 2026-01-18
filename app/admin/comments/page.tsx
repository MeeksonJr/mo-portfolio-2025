import { Metadata } from 'next'
import CommentsTable from '@/components/admin/comments-table'
import PageContainer from '@/components/layout/page-container'

export const metadata: Metadata = {
  title: 'Comments Management | Admin',
  description: 'Manage and moderate comments',
}

export default function AdminCommentsPage() {
  return (
    <PageContainer width="wide" padding="default">
      <div className="py-8">
        <CommentsTable />
      </div>
    </PageContainer>
  )
}

