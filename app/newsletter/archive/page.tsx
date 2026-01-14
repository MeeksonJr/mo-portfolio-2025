import EnhancedPageLayout from '@/components/layout/enhanced-page-layout'
import NewsletterArchiveViewer from '@/components/newsletter/archive-viewer'

export const metadata = {
  title: 'Newsletter Archive',
  description: 'Browse past newsletters and updates from Mohamed Datt',
}

export default function NewsletterArchivePage() {
  return (
    <EnhancedPageLayout
      title="Newsletter Archive"
      description="Browse past newsletters and updates"
      showBreadcrumbs={true}
    >
      <NewsletterArchiveViewer />
    </EnhancedPageLayout>
  )
}

