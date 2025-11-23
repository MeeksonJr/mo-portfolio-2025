import { generateStructuredData } from '@/lib/seo'

interface StructuredDataProps {
  type?: 'WebSite' | 'Article' | 'Person' | 'ProfilePage'
  title?: string
  description?: string
  url?: string
  image?: string
  publishedTime?: string
  modifiedTime?: string
  author?: string
}

export default function StructuredData({
  type = 'WebSite',
  title,
  description,
  url,
  image,
  publishedTime,
  modifiedTime,
  author,
}: StructuredDataProps) {
  const structuredData = generateStructuredData({
    type,
    title,
    description,
    url,
    image,
    publishedTime,
    modifiedTime,
    author,
  })

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

