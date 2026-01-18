import MusicUploadManager from '@/components/admin/music-upload-manager'
import { Metadata } from 'next'
import { TYPOGRAPHY } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Music Management | Admin',
  description: 'Upload and manage your music library',
}

export default async function MusicAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn(TYPOGRAPHY.h2)}>Music Management</h1>
          <p className="text-muted-foreground mt-2">
            Upload and manage your music library
          </p>
        </div>
        <a
          href="/music/submit"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          Share Submission Link ↗
        </a>
      </div>
      <MusicUploadManager />
    </div>
  )
}

