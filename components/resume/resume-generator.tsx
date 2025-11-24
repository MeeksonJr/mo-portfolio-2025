'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, Sparkles, Briefcase, Share2, QrCode, Copy, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import ResumeViewer from './resume-viewer'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import { QRCodeSVG } from 'qrcode.react'

type ResumeFormat = 'ats' | 'creative' | 'traditional'

interface ResumeData {
  personal: any
  experience: any[]
  education: any[]
  skills: any
  projects: any[]
  certifications?: any[]
  languages?: any[]
}

export default function ResumeGenerator() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<ResumeFormat>('ats')
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchResumeData()
  }, [])

  const fetchResumeData = async () => {
    try {
      const response = await fetch('/api/resume')
      if (!response.ok) throw new Error('Failed to fetch resume data')
      const data = await response.json()
      setResumeData(data)
    } catch (error) {
      console.error('Error fetching resume data:', error)
      toast.error('Failed to load resume data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!resumeData) return

    setIsGeneratingPDF(true)
    try {
      const response = await fetch('/api/resume/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format: selectedFormat,
          data: resumeData,
        }),
      })

      if (!response.ok) {
        // Fallback to print if PDF generation fails
        window.print()
        toast.info('Using browser print as fallback. Server PDF generation is being optimized.')
        return
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Mohamed-Datt-Resume-${selectedFormat}-${new Date().getFullYear()}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('Resume downloaded successfully!')
    } catch (error) {
      console.error('Error generating PDF:', error)
      // Fallback to print
      window.print()
      toast.info('Using browser print. Server PDF generation will be available soon.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/resume?format=${selectedFormat}`
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Mohamed Datt - Resume',
          text: 'Check out Mohamed Datt\'s resume',
          url,
        })
        toast.success('Resume shared!')
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        toast.success('Resume link copied to clipboard!')
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (error) {
      // User cancelled share
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error('Failed to share resume')
      }
    }
  }

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/resume?format=${selectedFormat}` : ''

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!resumeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Failed to load resume data</p>
      </div>
    )
  }

  return (
    <>
      <Navigation />
      <div className="pt-20 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Resume</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Download my resume in multiple formats. Choose the format that best fits your needs.
            </p>
          </motion.div>

          {/* Format Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Tabs value={selectedFormat} onValueChange={(v) => setSelectedFormat(v as ResumeFormat)}>
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
                <TabsTrigger value="ats" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  ATS-Friendly
                </TabsTrigger>
                <TabsTrigger value="creative" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Creative
                </TabsTrigger>
                <TabsTrigger value="traditional" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Traditional
                </TabsTrigger>
              </TabsList>

              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  {selectedFormat === 'ats' && 'Optimized for Applicant Tracking Systems. Clean, keyword-rich format.'}
                  {selectedFormat === 'creative' && 'Modern, visually appealing design with color and graphics.'}
                  {selectedFormat === 'traditional' && 'Professional, classic format suitable for all industries.'}
                </p>
              </div>
            </Tabs>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            <Button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              size="lg"
              className="gap-2"
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download PDF
                </>
              )}
            </Button>

            <Button
              onClick={handleShare}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  Share Link
                </>
              )}
            </Button>

            <Button
              onClick={() => setShowQRCode(!showQRCode)}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <QrCode className="h-4 w-4" />
              QR Code
            </Button>
          </motion.div>

          {/* QR Code Modal */}
          {showQRCode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              onClick={() => setShowQRCode(false)}
            >
              <Card className="max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
                <CardHeader>
                  <CardTitle>Scan to View Resume</CardTitle>
                  <CardDescription>Share this QR code for easy access</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <QRCodeSVG value={shareUrl} size={200} />
                  </div>
                  <p className="text-sm text-muted-foreground text-center break-all">{shareUrl}</p>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl)
                      toast.success('Link copied!')
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="h-3 w-3 mr-2" />
                    Copy Link
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Resume Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ResumeViewer data={resumeData} format={selectedFormat} />
          </motion.div>
        </div>
      </div>
      <FooterLight />
    </>
  )
}

