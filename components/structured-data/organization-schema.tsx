/**
 * Organization Schema (JSON-LD) for the website
 * Should be added to the root layout
 */

export default function OrganizationSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Mohamed Datt',
    jobTitle: 'Full Stack Developer',
    description: 'Creative Full Stack Developer specializing in AI-powered web applications, Next.js, TypeScript, and modern web technologies.',
    url: siteUrl,
    image: `${siteUrl}/og-image.png`,
    sameAs: [
      'https://github.com/MeeksonJr',
      'https://www.linkedin.com/in/mohamed-datt-b60907296',
      // Add more social links as needed
    ],
    knowsAbout: [
      'Web Development',
      'Full Stack Development',
      'Next.js',
      'React',
      'TypeScript',
      'AI Integration',
      'Machine Learning',
      'Software Engineering',
    ],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Old Dominion University',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Norfolk',
      addressRegion: 'VA',
      addressCountry: 'US',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

