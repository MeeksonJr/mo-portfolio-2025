import AIToolsDashboard from '@/components/admin/ai-tools-dashboard'
import { TYPOGRAPHY } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

export default async function AIToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className={cn(TYPOGRAPHY.h2)}>AI Tools</h1>
        <p className="text-muted-foreground mt-2">
          Generate content, images, and enhance your work with AI
        </p>
      </div>
      <AIToolsDashboard />
    </div>
  )
}

