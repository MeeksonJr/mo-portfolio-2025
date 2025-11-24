import AIToolsDashboard from '@/components/admin/ai-tools-dashboard'

export default async function AIToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Tools</h1>
        <p className="text-muted-foreground mt-2">
          Generate content, images, and enhance your work with AI
        </p>
      </div>
      <AIToolsDashboard />
    </div>
  )
}

