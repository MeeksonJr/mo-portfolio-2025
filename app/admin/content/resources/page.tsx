import { createAdminClient } from '@/lib/supabase/server'
import ResourcesTable from '@/components/admin/resources-table'

export default async function ResourcesPage() {
  const adminClient = createAdminClient()

  let resources = []
  try {
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
  } catch (error) {
    console.error('Error in ResourcesPage:', error)
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

