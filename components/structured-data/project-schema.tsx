'use client'

interface ProjectSchemaProps {
  name: string
  description?: string | null
  url: string
  image?: string | null
  githubUrl?: string | null
  homepageUrl?: string | null
  techStack?: string[] | null
  dateCreated?: string
  dateModified?: string
}

export default function ProjectSchema({
  name,
  description,
  url,
  image,
  githubUrl,
  homepageUrl,
  techStack,
  dateCreated,
  dateModified,
}: ProjectSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com'
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`
  const fullImage = image
    ? image.startsWith('http')
      ? image
      : `${siteUrl}${image}`
    : `${siteUrl}/og-image.png`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description: description || undefined,
    url: fullUrl,
    image: fullImage,
    applicationCategory: 'WebApplication',
    operatingSystem: 'Web',
    author: {
      '@type': 'Person',
      name: 'Mohamed Datt',
      url: siteUrl,
      sameAs: [
        'https://github.com/MeeksonJr',
        'https://linkedin.com/in/mohamed-datt',
      ],
    },
    ...(dateCreated && { dateCreated }),
    ...(dateModified && { dateModified }),
    ...(githubUrl && {
      codeRepository: {
        '@type': 'SoftwareSourceCode',
        url: githubUrl,
        codeRepositoryType: 'GitHub',
      },
    }),
    ...(homepageUrl && {
      installUrl: homepageUrl,
    }),
    ...(techStack && techStack.length > 0 && {
      programmingLanguage: techStack,
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

