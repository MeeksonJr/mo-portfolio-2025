'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Calendar, Users, Eye, MousePointerClick, ArrowRight, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { format } from 'date-fns'
import Link from 'next/link'

interface NewsletterCampaign {
  id: string
  title: string
  subject: string
  preview_text?: string | null
  featured_image_url?: string | null
  sent_at: string
  sent_to_count: number
  opened_count: number
  clicked_count: number
}

interface ArchiveData {
  campaigns: NewsletterCampaign[]
  total: number
  limit: number
  offset: number
}

export default function NewsletterArchiveViewer() {
  const [data, setData] = useState<ArchiveData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCampaign, setSelectedCampaign] = useState<NewsletterCampaign | null>(null)

  useEffect(() => {
    fetchArchive()
  }, [])

  const fetchArchive = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/newsletter/archive?limit=20')
      if (response.ok) {
        const data = await response.json()
        setData(data)
      }
    } catch (error) {
      console.error('Error fetching newsletter archive:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const openRate = (campaign: NewsletterCampaign) => {
    if (campaign.sent_to_count === 0) return 0
    return Math.round((campaign.opened_count / campaign.sent_to_count) * 100)
  }

  const clickRate = (campaign: NewsletterCampaign) => {
    if (campaign.sent_to_count === 0) return 0
    return Math.round((campaign.clicked_count / campaign.sent_to_count) * 100)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!data || data.campaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No newsletters archived yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Newsletter Archive</h2>
          <p className="text-muted-foreground">
            {data.total} newsletter{data.total !== 1 ? 's' : ''} sent
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.campaigns.map((campaign, index) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-background/95 backdrop-blur-sm"
              onClick={() => setSelectedCampaign(campaign)}
            >
              {campaign.featured_image_url && (
                <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={campaign.featured_image_url}
                    alt={campaign.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="line-clamp-2">{campaign.title}</CardTitle>
                  <Badge variant="outline" className="ml-2 flex-shrink-0">
                    <Mail className="h-3 w-3 mr-1" />
                    Sent
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {campaign.subject}
                </CardDescription>
                {campaign.preview_text && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {campaign.preview_text}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(campaign.sent_at), 'MMM d, yyyy')}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                        <Users className="h-3 w-3" />
                      </div>
                      <div className="text-sm font-semibold">{campaign.sent_to_count}</div>
                      <div className="text-xs text-muted-foreground">Sent</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                        <Eye className="h-3 w-3" />
                      </div>
                      <div className="text-sm font-semibold">{openRate(campaign)}%</div>
                      <div className="text-xs text-muted-foreground">Opened</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                        <MousePointerClick className="h-3 w-3" />
                      </div>
                      <div className="text-sm font-semibold">{clickRate(campaign)}%</div>
                      <div className="text-xs text-muted-foreground">Clicked</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Campaign Detail Modal */}
      {selectedCampaign && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCampaign(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{selectedCampaign.title}</h3>
                  <p className="text-muted-foreground">{selectedCampaign.subject}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedCampaign(null)}
                >
                  ×
                </Button>
              </div>

              {selectedCampaign.featured_image_url && (
                <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={selectedCampaign.featured_image_url}
                    alt={selectedCampaign.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-muted rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Sent</div>
                  <div className="text-lg font-semibold">{selectedCampaign.sent_to_count}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Open Rate</div>
                  <div className="text-lg font-semibold">{openRate(selectedCampaign)}%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Click Rate</div>
                  <div className="text-lg font-semibold">{clickRate(selectedCampaign)}%</div>
                </div>
              </div>

              {selectedCampaign.preview_text && (
                <p className="text-muted-foreground mb-4">{selectedCampaign.preview_text}</p>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Sent on {format(new Date(selectedCampaign.sent_at), 'MMMM d, yyyy')}</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

