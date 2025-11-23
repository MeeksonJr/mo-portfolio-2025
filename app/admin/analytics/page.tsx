import AnalyticsDashboard from '@/components/admin/analytics-dashboard'

export default async function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          View analytics and visitor insights
        </p>
      </div>
      <AnalyticsDashboard />
    </div>
  )
}

