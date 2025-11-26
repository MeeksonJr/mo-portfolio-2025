import { createServerClient } from '@/lib/supabase/server'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import ProjectContent from '@/components/project-content'
import StructuredData from '@/components/structured-data'
import ProjectSchema from '@/components/structured-data/project-schema'
import BreadcrumbSchema from '@/components/structured-data/breadcrumb-schema'
import PageViewTracker from '@/components/page-view-tracker'
import { generateMetadata as genMeta } from '@/lib/seo'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

// Helper function to create slug from name
const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServerClient()

  // Fetch all published projects and find the one matching the slug
  const { data: projects } = await supabase
    .from('projects')
    .select('name, description, featured_image, created_at, updated_at, tech_stack')
    .eq('status', 'published')

  if (!projects) {
    return {
      title: 'Project Not Found',
    }
  }

  const project = projects.find((p) => createSlug(p.name) === slug)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com'
  const image = project.featured_image 
    ? (project.featured_image.startsWith('http') ? project.featured_image : `${siteUrl}${project.featured_image}`)
    : `${siteUrl}/og-image.png`

  return genMeta({
    title: project.name,
    description: project.description || undefined,
    type: 'article',
    image,
    publishedTime: project.created_at || undefined,
    modifiedTime: project.updated_at || project.created_at || undefined,
    tags: project.tech_stack || undefined,
  })
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const supabase = await createServerClient()

  // Fetch all published projects and find the one matching the slug
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')

  if (error || !projects) {
    notFound()
  }

  const project = projects.find((p) => createSlug(p.name) === slug)

  if (!project) {
    notFound()
  }

  // Increment views (fire and forget)
  supabase
    .from('projects')
    .update({ views: (project.views || 0) + 1 })
    .eq('id', project.id)
    .then(() => {}) // Fire and forget

  // Fetch related projects (similar tech stack or featured)
  let relatedProjects: Array<{
    id: string
    name: string
    description: string | null
    featured_image: string | null
    tech_stack: string[] | null
    homepage_url: string | null
    github_url: string
  }> = []
  try {
    const { data } = await supabase
      .from('projects')
      .select('id, name, description, featured_image, tech_stack, homepage_url, github_url')
      .eq('status', 'published')
      .neq('id', project.id)
      .limit(3)

    relatedProjects = data || []
  } catch (error) {
    console.error('Error fetching related projects:', error)
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com'
  const image = project.featured_image 
    ? (project.featured_image.startsWith('http') ? project.featured_image : `${siteUrl}${project.featured_image}`)
    : undefined

  return (
    <>
      <ProjectSchema
        name={project.name}
        description={project.description}
        url={`/projects/${slug}`}
        image={image}
        githubUrl={project.github_url}
        homepageUrl={project.homepage_url}
        techStack={project.tech_stack}
        dateCreated={project.created_at}
        dateModified={project.updated_at || project.created_at}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Projects', url: '/projects' },
          { name: project.name, url: `/projects/${slug}` },
        ]}
      />
      <div className="min-h-screen bg-background">
        <PageViewTracker contentType="project" contentId={project.id} />
        <Navigation />
        <main id="main-content" role="main" className="pt-20 pb-16" tabIndex={-1}>
          <ProjectContent project={project} relatedProjects={relatedProjects} />
        </main>
        <FooterLight />
      </div>
    </>
  )
}

