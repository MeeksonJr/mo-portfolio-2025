'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import Link from 'next/link'
import { toast } from 'sonner'

export default function NewsletterUnsubscribePage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token && !email) {
      toast.error('Please provide an email address or use the unsubscribe link from your email')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token || null, email: email.trim() || null }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        if (data.alreadyUnsubscribed) {
          toast.info('You are already unsubscribed')
        } else {
          toast.success('Successfully unsubscribed')
        }
      } else {
        toast.error(data.error || 'Failed to unsubscribe')
      }
    } catch (error) {
      console.error('Unsubscribe error:', error)
      toast.error('An error occurred. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-20 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader className="text-center">
                {isSuccess ? (
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                ) : (
                  <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
                )}
                <CardTitle className="text-2xl">
                  {isSuccess ? 'Unsubscribed Successfully' : 'Unsubscribe from Newsletter'}
                </CardTitle>
                <CardDescription>
                  {isSuccess
                    ? "You've been unsubscribed from the newsletter. We're sorry to see you go!"
                    : token
                      ? 'Click the button below to unsubscribe'
                      : 'Enter your email address to unsubscribe'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSuccess ? (
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">
                      You will no longer receive newsletter emails from us.
                    </p>
                    <Button asChild>
                      <Link href="/">Go Home</Link>
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleUnsubscribe} className="space-y-4">
                    {!token && (
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    )}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Unsubscribing...
                        </>
                      ) : (
                        'Unsubscribe'
                      )}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      You can resubscribe at any time from the newsletter signup form.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <FooterLight />
    </>
  )
}

