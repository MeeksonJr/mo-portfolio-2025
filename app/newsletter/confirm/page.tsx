'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import Link from 'next/link'

function NewsletterConfirmContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (!token) {
      setStatus('error')
      setMessage('Invalid confirmation link')
      return
    }

    const confirmSubscription = async () => {
      try {
        const response = await fetch(`/api/newsletter/confirm?token=${token}`)
        const data = await response.json()

        if (response.ok) {
          setStatus('success')
          setMessage(data.message || 'Email confirmed successfully!')
        } else {
          setStatus('error')
          setMessage(data.error || 'Failed to confirm subscription')
        }
      } catch (error) {
        console.error('Confirmation error:', error)
        setStatus('error')
        setMessage('An error occurred. Please try again later.')
      }
    }

    confirmSubscription()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card>
            <CardHeader className="text-center">
              {status === 'loading' && (
                <Loader2 className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
              )}
              {status === 'success' && (
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              )}
              {status === 'error' && (
                <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              )}
              <CardTitle className="text-2xl">
                {status === 'loading' && 'Confirming Subscription...'}
                {status === 'success' && 'Subscription Confirmed!'}
                {status === 'error' && 'Confirmation Failed'}
              </CardTitle>
              <CardDescription>{message}</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              {status === 'success' && (
                <>
                  <p className="text-muted-foreground">
                    Welcome to the newsletter! You'll receive updates about new blog posts, 
                    projects, and insights.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button asChild>
                      <Link href="/">Go Home</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/blog">Read Blog</Link>
                    </Button>
                  </div>
                </>
              )}
              {status === 'error' && (
                <>
                  <p className="text-muted-foreground">
                    The confirmation link may be invalid or expired.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button asChild>
                      <Link href="/">Go Home</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/#contact">Contact Support</Link>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default function NewsletterConfirmPage() {
  return (
    <>
      <Navigation />
      <Suspense fallback={
        <div className="min-h-screen bg-background pt-20 pb-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      }>
        <NewsletterConfirmContent />
      </Suspense>
      <FooterLight />
    </>
  )
}

