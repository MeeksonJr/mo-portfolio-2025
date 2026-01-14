/**
 * WebSite Schema (JSON-LD) for the main website
 * Includes search action for Google site search
 */

export default function WebsiteSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Mohamed Datt',
    description: 'Portfolio website of Mohamed Datt - Full Stack Developer specializing in AI-powered web applications',
    url: siteUrl,
    publisher: {
      '@type': 'Person',
      name: 'Mohamed Datt',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

