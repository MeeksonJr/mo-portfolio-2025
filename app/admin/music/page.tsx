import MusicUploadManager from '@/components/admin/music-upload-manager'

export default async function MusicAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Music Management</h1>
        <p className="text-muted-foreground mt-2">
          Upload and manage your music library
        </p>
      </div>
      <MusicUploadManager />
    </div>
  )
}

