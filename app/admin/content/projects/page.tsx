import { createAdminClient } from '@/lib/supabase/server'
import ProjectsTable from '@/components/admin/projects-table'

export default async function ProjectsPage() {
  const adminClient = createAdminClient()

  let projects = []
  try {
    const { data, error } = await adminClient
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error fetching projects:', error)
    } else {
      projects = data || []
    }
  } catch (error) {
    console.error('Error in ProjectsPage:', error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage your projects
          </p>
        </div>
      </div>

      <ProjectsTable initialProjects={projects} />
    </div>
  )
}

