import { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohameddatt.com'
const siteName = 'Mohamed Datt'
const defaultDescription = 'Creative Full Stack Developer specializing in AI-powered web applications, Next.js, TypeScript, and modern web technologies.'

export interface SEOProps {
  title?: string
  description?: string
  image?: string
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  tags?: string[]
  noindex?: boolean
  nofollow?: boolean
}

export function generateMetadata({
  title,
  description = defaultDescription,
  image = `${siteUrl}/og-image.png`,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors = ['Mohamed Datt'],
  tags,
  noindex = false,
  nofollow = false,
}: SEOProps): Metadata {
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} | Full Stack Developer`
  const url = siteUrl

  return {
    title: fullTitle,
    description,
    keywords: tags?.join(', '),
    authors: authors.map((name) => ({ name })),
    creator: 'Mohamed Datt',
    publisher: 'Mohamed Datt',
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      publishedTime,
      modifiedTime,
      authors,
      tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@MohamedDatt', // Update with your actual Twitter handle
    },
    alternates: {
      canonical: url,
    },
    metadataBase: new URL(siteUrl),
  }
}

export function generateStructuredData({
  type = 'WebSite',
  title,
  description,
  url,
  image,
  publishedTime,
  modifiedTime,
  author,
}: {
  type?: 'WebSite' | 'Article' | 'Person' | 'ProfilePage'
  title?: string
  description?: string
  url?: string
  image?: string
  publishedTime?: string
  modifiedTime?: string
  author?: string
}) {
  const baseUrl = siteUrl
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl

  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type,
    name: title || siteName,
    description: description || defaultDescription,
    url: fullUrl,
    ...(image && { image: image.startsWith('http') ? image : `${baseUrl}${image}` }),
  }

  if (type === 'Article') {
    return {
      ...baseSchema,
      headline: title,
      datePublished: publishedTime,
      dateModified: modifiedTime || publishedTime,
      author: {
        '@type': 'Person',
        name: author || 'Mohamed Datt',
        url: baseUrl,
      },
      publisher: {
        '@type': 'Person',
        name: 'Mohamed Datt',
        url: baseUrl,
      },
    }
  }

  if (type === 'Person' || type === 'ProfilePage') {
    return {
      ...baseSchema,
      jobTitle: 'Full Stack Developer',
      worksFor: {
        '@type': 'Organization',
        name: 'Freelance',
      },
      sameAs: [
        'https://github.com/MeeksonJr',
        // Add more social links here
      ],
    }
  }

  return baseSchema
}

