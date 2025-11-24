'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  QrCode, Download, Share2, Mail, Phone, MapPin, 
  Github, Linkedin, Globe, User, Briefcase, Copy, 
  Check, Smartphone, CreditCard, Save
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import { resumeData } from '@/lib/resume-data'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'sonner'
import Image from 'next/image'

export default function VirtualBusinessCard() {
  const [copied, setCopied] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const { personal, skills } = resumeData
  const cardUrl = typeof window !== 'undefined' ? window.location.href : 'https://mohameddatt.com/card'

  const generateVCard = () => {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${personal.name}`,
      `N:${personal.name.split(' ').reverse().join(';')};;;`,
      `ORG:${personal.title}`,
      `TITLE:${personal.title}`,
      `EMAIL;TYPE=WORK:${personal.email}`,
      personal.phone ? `TEL;TYPE=CELL:${personal.phone.replace(/\s/g, '')}` : '',
      `ADR;TYPE=WORK:;;${personal.location};;;;`,
      `URL:${personal.website || personal.github}`,
      `URL;TYPE=GITHUB:${personal.github}`,
      `URL;TYPE=LINKEDIN:${personal.linkedin}`,
      `NOTE:${personal.summary}`,
      'END:VCARD',
    ].filter(Boolean).join('\n')
    
    return vcard
  }

  const handleDownloadVCard = () => {
    const vcard = generateVCard()
    const blob = new Blob([vcard], { type: 'text/vcard' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${personal.name.replace(/\s/g, '-')}-contact.vcf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    toast.success('vCard downloaded! Add it to your contacts.')
  }

  const handleCopyVCard = async () => {
    const vcard = generateVCard()
    try {
      await navigator.clipboard.writeText(vcard)
      setCopied(true)
      toast.success('vCard copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy vCard')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${personal.name} - ${personal.title}`,
          text: personal.summary,
          url: cardUrl,
        })
        toast.success('Card shared!')
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          toast.error('Failed to share')
        }
      }
    } else {
      await navigator.clipboard.writeText(cardUrl)
      toast.success('Card link copied to clipboard!')
    }
  }

  const topSkills: string[] = [
    ...skills.frontend.slice(0, 3),
    ...skills.backend.slice(0, 2),
    ...skills.ai.slice(0, 2),
  ].slice(0, 6) as string[]

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <CreditCard className="h-10 w-10 text-primary" />
              Virtual Business Card
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Digital business card with QR code. Share your contact information instantly.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Business Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-2 shadow-2xl">
                <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-1">{personal.name}</CardTitle>
                      <CardDescription className="text-base">{personal.title}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowQRCode(!showQRCode)}
                      className="h-10 w-10"
                    >
                      <QrCode className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-primary" />
                      <a href={`mailto:${personal.email}`} className="hover:underline text-sm">
                        {personal.email}
                      </a>
                    </div>
                    {personal.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-primary" />
                        <a href={`tel:${personal.phone.replace(/\s/g, '')}`} className="hover:underline text-sm">
                          {personal.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-sm">{personal.location}</span>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <a href={personal.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <a href={personal.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                    {personal.website && (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <a href={personal.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4 mr-2" />
                          Website
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="pt-2 border-t">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Key Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {topSkills.map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* QR Code */}
                  {showQRCode && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="pt-4 border-t flex flex-col items-center gap-3"
                    >
                      <div className="bg-white p-4 rounded-lg">
                        <QRCodeSVG value={cardUrl} size={150} />
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Scan to view this card
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Actions & Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={handleDownloadVCard}
                    className="w-full gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download vCard (.vcf)
                  </Button>
                  <Button
                    onClick={handleCopyVCard}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        vCard Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy vCard
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share Card
                  </Button>
                  <Button
                    onClick={() => setShowQRCode(!showQRCode)}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <QrCode className="h-4 w-4" />
                    {showQRCode ? 'Hide' : 'Show'} QR Code
                  </Button>
                </CardContent>
              </Card>

              {/* How to Use */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    How to Use
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="mobile" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="mobile">Mobile</TabsTrigger>
                      <TabsTrigger value="desktop">Desktop</TabsTrigger>
                    </TabsList>
                    <TabsContent value="mobile" className="space-y-2 text-sm">
                      <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                        <li>Download the vCard file</li>
                        <li>Open it on your phone</li>
                        <li>Tap "Add to Contacts"</li>
                        <li>Or scan the QR code to view online</li>
                      </ol>
                    </TabsContent>
                    <TabsContent value="desktop" className="space-y-2 text-sm">
                      <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                        <li>Download the vCard file</li>
                        <li>Import it into your email client (Outlook, Apple Mail, etc.)</li>
                        <li>Or copy the vCard text and import manually</li>
                        <li>Share the QR code or link with others</li>
                      </ol>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Share Link */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Shareable Link
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <label htmlFor="card-url" className="sr-only">
                      Shareable card link
                    </label>
                    <input
                      id="card-url"
                      type="text"
                      value={cardUrl}
                      readOnly
                      aria-label="Shareable card link"
                      className="flex-1 px-3 py-2 text-sm border rounded-md bg-muted font-mono"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(cardUrl)
                        toast.success('Link copied!')
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Share this link to let others view your business card
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Why a Virtual Business Card?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-start gap-3">
                    <QrCode className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Instant Sharing</p>
                      <p className="text-xs text-muted-foreground">
                        Share contact info with a QR code scan or link
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Save className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Easy Import</p>
                      <p className="text-xs text-muted-foreground">
                        Download vCard and add to contacts with one tap
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Always Updated</p>
                      <p className="text-xs text-muted-foreground">
                        Your card stays current, no reprinting needed
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <FooterLight />
    </>
  )
}

