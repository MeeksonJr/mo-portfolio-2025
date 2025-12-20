import { createAdminClient } from '@/lib/supabase/server'
import ResourcesTable from '@/components/admin/resources-table'

export default async function ResourcesPage() {
  let resources = []
  
  try {
    const adminClient = createAdminClient()

    const { data, error } = await adminClient
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error fetching resources:', error)
    } else {
      resources = data || []
    }
  } catch (error: any) {
    console.error('Error in ResourcesPage:', error)
    // Return page with empty resources - component will handle it
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Resources</h1>
          <p className="text-muted-foreground mt-2">
            Manage your resources
          </p>
        </div>
      </div>

      <ResourcesTable initialResources={resources} />
    </div>
  )
}

