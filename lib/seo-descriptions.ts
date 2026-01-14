/**
 * Enhanced SEO descriptions for different pages
 * Provides unique, compelling meta descriptions for better SEO
 */

const siteName = 'Mohamed Datt'

export const pageDescriptions = {
  home: `Creative Full Stack Developer specializing in AI-powered web applications, Next.js, TypeScript, and modern web technologies. Building innovative solutions from Guinea to Norfolk.`,
  
  about: `Learn about Mohamed Datt - a Full Stack Developer from Guinea, raised in NYC, now building in Norfolk. Discover the journey from cartoons to code, and the passion for creating innovative SaaS solutions.`,
  
  blog: `Explore technical articles, tutorials, and insights on web development, AI integration, Next.js, TypeScript, and modern software engineering from Full Stack Developer Mohamed Datt.`,
  
  projects: `View portfolio of live projects, SaaS applications, and innovative web solutions built by Full Stack Developer Mohamed Datt. Includes AI-powered applications, e-commerce platforms, and more.`,
  
  resume: `Download the resume of Mohamed Datt - Full Stack Developer specializing in AI-powered applications, Next.js, TypeScript, React, and modern web technologies. Available for freelance and full-time opportunities.`,
  
  contact: `Get in touch with Mohamed Datt - Full Stack Developer. Available for freelance projects, partnerships, and full-time opportunities. Let's build something amazing together.`,
  
  testimonials: `Read testimonials and reviews from clients and colleagues about working with Mohamed Datt - Full Stack Developer specializing in AI-powered web applications.`,
  
  caseStudies: `In-depth case studies showcasing real-world projects, challenges, and solutions by Full Stack Developer Mohamed Datt. Learn about the development process and outcomes.`,
  
  tools: `Discover tools, resources, and utilities for web developers. Curated collection of helpful resources for building modern web applications.`,
  
  code: `Explore code snippets, examples, and technical resources by Full Stack Developer Mohamed Datt. Learn from real-world implementations and best practices.`,
  
  insights: `Insights, thoughts, and perspectives on web development, technology trends, and the software engineering industry from Full Stack Developer Mohamed Datt.`,
  
  games: `Play interactive games and experiments built by Full Stack Developer Mohamed Datt. Includes classic games like Snake, Tetris, Memory, and more with score tracking.`,
}

export function generatePageDescription(
  page: keyof typeof pageDescriptions,
  customDescription?: string
): string {
  return customDescription || pageDescriptions[page] || pageDescriptions.home
}

/**
 * Generate a compelling meta description from content
 * Ensures it's between 120-160 characters for optimal SEO
 */
export function generateMetaDescription(
  content: string,
  maxLength: number = 160,
  minLength: number = 120
): string {
  // Remove markdown, HTML, and extra whitespace
  const cleanContent = content
    .replace(/[#*`_~\[\]()]/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/\n+/g, ' ')
    .trim()

  if (cleanContent.length <= maxLength) {
    return cleanContent
  }

  // Try to cut at sentence boundary
  const sentences = cleanContent.match(/[^.!?]+[.!?]+/g) || []
  let description = ''

  for (const sentence of sentences) {
    if ((description + sentence).length <= maxLength) {
      description += sentence
    } else {
      break
    }
  }

  // If we have a good description, return it
  if (description.length >= minLength) {
    return description.trim()
  }

  // Otherwise, cut at word boundary
  const words = cleanContent.split(' ')
  description = ''

  for (const word of words) {
    if ((description + ' ' + word).length <= maxLength) {
      description += (description ? ' ' : '') + word
    } else {
      break
    }
  }

  return description.trim() + '...'
}

