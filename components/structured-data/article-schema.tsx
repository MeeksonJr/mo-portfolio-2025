'use client'

interface ArticleSchemaProps {
  title: string
  description?: string | null
  url: string
  image?: string | null
  publishedTime?: string | null
  modifiedTime?: string | null
  author?: string
  tags?: string[] | null
  category?: string | null
}

export default function ArticleSchema({
  title,
  description,
  url,
  image,
  publishedTime,
  modifiedTime,
  author = 'Mohamed Datt',
  tags,
  category,
}: ArticleSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com'
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`
  const fullImage = image
    ? image.startsWith('http')
      ? image
      : `${siteUrl}${image}`
    : `${siteUrl}/og-image.png`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description || undefined,
    url: fullUrl,
    image: fullImage,
    author: {
      '@type': 'Person',
      name: author,
      url: siteUrl,
      sameAs: [
        'https://github.com/MeeksonJr',
        'https://linkedin.com/in/mohamed-datt',
      ],
    },
    publisher: {
      '@type': 'Person',
      name: 'Mohamed Datt',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/og-image.png`,
      },
    },
    ...(publishedTime && { datePublished: publishedTime }),
    ...(modifiedTime && { dateModified: modifiedTime }),
    ...(category && { articleSection: category }),
    ...(tags && tags.length > 0 && {
      keywords: tags.join(', '),
    }),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

