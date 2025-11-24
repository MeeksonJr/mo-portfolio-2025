import { createAdminClient } from '@/lib/supabase/server'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import ProjectsListing from '@/components/projects-listing'
import StructuredData from '@/components/structured-data'
import { generateMetadata as genMeta } from '@/lib/seo'
import { Metadata } from 'next'

export const metadata: Metadata = genMeta({
  title: 'Projects',
  description: 'Portfolio of projects, applications, and technical implementations. Showcasing full-stack web applications, AI-powered solutions, and modern web technologies',
  type: 'website',
  tags: ['projects', 'portfolio', 'web development', 'applications'],
})

export default async function ProjectsPage() {
  const supabase = createAdminClient()

  // Fetch published projects
  let projects = []
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching projects:', error)
    } else {
      projects = data || []
    }
  } catch (error) {
    console.error('Error in ProjectsPage:', error)
  }

  return (
    <>
      <StructuredData
        type="WebSite"
        title="Projects | Mohamed Datt"
        description="Portfolio of projects, applications, and technical implementations"
        url="/projects"
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20 pb-16">
          <ProjectsListing projects={projects} />
        </main>
        <FooterLight />
      </div>
    </>
  )
}

