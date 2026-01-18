import { createAdminClient } from '@/lib/supabase/server'
import CaseStudiesTable from '@/components/admin/case-studies-table'
import { TYPOGRAPHY } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

export default async function CaseStudiesPage() {
  let caseStudies = []
  
  try {
    const adminClient = createAdminClient()

    // Fetch case studies
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
  } catch (error: any) {
    console.error('Error in CaseStudiesPage:', error)
    // Return page with empty case studies - component will handle it
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn(TYPOGRAPHY.h2)}>Case Studies</h1>
          <p className="text-muted-foreground mt-2">
            Manage your case studies
          </p>
        </div>
      </div>

      <CaseStudiesTable initialCaseStudies={caseStudies} />
    </div>
  )
}

