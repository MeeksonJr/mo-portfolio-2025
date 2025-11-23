import { createAdminClient } from '@/lib/supabase/server'
import CaseStudiesTable from '@/components/admin/case-studies-table'

export default async function CaseStudiesPage() {
  const adminClient = createAdminClient()

  // Fetch case studies
  let caseStudies = []
  try {
    const { data, error } = await adminClient
      .from('case_studies')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error fetching case studies:', error)
    } else {
      caseStudies = data || []
    }
  } catch (error) {
    console.error('Error in CaseStudiesPage:', error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Case Studies</h1>
          <p className="text-muted-foreground mt-2">
            Manage your case studies
          </p>
        </div>
      </div>

      <CaseStudiesTable initialCaseStudies={caseStudies} />
    </div>
  )
}

