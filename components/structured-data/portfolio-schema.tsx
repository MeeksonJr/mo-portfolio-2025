/**
 * Portfolio/CreativeWork Schema for portfolio items
 */

interface PortfolioSchemaProps {
  name: string
  description: string
  url: string
  image?: string
  dateCreated?: string
  dateModified?: string
  technologies?: string[]
  githubUrl?: string
  homepageUrl?: string
}

export default function PortfolioSchema({
  name,
  description,
  url,
  image,
  dateCreated,
  dateModified,
  technologies,
  githubUrl,
  homepageUrl,
}: PortfolioSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com'
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`
  const fullImage = image
    ? image.startsWith('http')
      ? image
      : `${siteUrl}${image}`
    : `${siteUrl}/og-image.png`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    description,
    url: fullUrl,
    image: fullImage,
    creator: {
      '@type': 'Person',
      name: 'Mohamed Datt',
      url: siteUrl,
    },
    ...(dateCreated && { dateCreated }),
    ...(dateModified && { dateModified }),
    ...(technologies && technologies.length > 0 && {
      about: technologies.map((tech) => ({
        '@type': 'Thing',
        name: tech,
      })),
    }),
    ...(githubUrl && {
      codeRepository: {
        '@type': 'SoftwareSourceCode',
        url: githubUrl,
        codeRepositoryType: 'GitHub',
      },
    }),
    ...(homepageUrl && {
      mainEntity: {
        '@type': 'WebApplication',
        url: homepageUrl,
      },
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

