import AIGenerationsDashboard from '@/components/admin/ai-generations-dashboard'

export default async function AIGenerationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Generations</h1>
        <p className="text-muted-foreground mt-2">
          Track and analyze AI usage, costs, and performance
        </p>
      </div>
      <AIGenerationsDashboard />
    </div>
  )
}

