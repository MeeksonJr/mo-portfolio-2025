import AIGenerationsDashboard from '@/components/admin/ai-generations-dashboard'
import { TYPOGRAPHY } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

export default async function AIGenerationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className={cn(TYPOGRAPHY.h2)}>AI Generations</h1>
        <p className="text-muted-foreground mt-2">
          Track and analyze AI usage, costs, and performance
        </p>
      </div>
      <AIGenerationsDashboard />
    </div>
  )
}

