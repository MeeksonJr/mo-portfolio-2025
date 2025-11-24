'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, Calendar, Linkedin, Github, MessageCircle, Phone, 
  MessageSquare, Clock, CheckCircle2, XCircle, Zap, 
  ExternalLink, Copy, Check, Globe, Send
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import { resumeData } from '@/lib/resume-data'
import { toast } from 'sonner'

interface ContactMethod {
  id: string
  name: string
  icon: typeof Mail
  description: string
  action: () => void
  available: boolean
  responseTime?: string
  color: string
}

export default function UniversalContactHub() {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [status, setStatus] = useState<'available' | 'busy' | 'away'>('available')
  const { personal } = resumeData

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      toast.error('Failed to copy')
    }
  }

  const contactMethods: ContactMethod[] = [
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      description: 'Send a direct email. I typically respond within 24 hours.',
      action: () => window.open(`mailto:${personal.email}?subject=Inquiry from Portfolio`, '_blank'),
      available: true,
      responseTime: '24 hours',
      color: 'text-blue-500',
    },
    {
      id: 'calendar',
      name: 'Book a Meeting',
      icon: Calendar,
      description: 'Schedule a call or meeting directly. Pick a time that works for you.',
      action: () => {
        // Cal.com integration - replace with your actual Cal.com link
        const calLink = `https://cal.com/mohameddatt/30min` // Update with your actual Cal.com link
        window.open(calLink, '_blank')
      },
      available: true,
      responseTime: 'Instant booking',
      color: 'text-purple-500',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      description: 'Connect on LinkedIn or send a message. Great for professional networking.',
      action: () => window.open(`${personal.linkedin}`, '_blank'),
      available: true,
      responseTime: '24-48 hours',
      color: 'text-blue-600',
    },
    {
      id: 'github',
      name: 'GitHub Discussions',
      icon: Github,
      description: 'Start a discussion on GitHub. Perfect for technical questions or collaboration.',
      action: () => {
        // Link to GitHub discussions or create issue
        window.open(`${personal.github}?tab=repositories`, '_blank')
      },
      available: true,
      responseTime: '24-48 hours',
      color: 'text-gray-700 dark:text-gray-300',
    },
    {
      id: 'phone',
      name: 'Phone',
      icon: Phone,
      description: 'Call me directly. Available during business hours (EST).',
      action: () => {
        if (personal.phone) {
          window.open(`tel:${personal.phone.replace(/\s/g, '')}`, '_blank')
        } else {
          toast.info('Phone number not available. Please use email or calendar booking.')
        }
      },
      available: !!personal.phone,
      responseTime: 'Business hours',
      color: 'text-green-500',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageSquare,
      description: 'Message me on WhatsApp. Quick responses for urgent matters.',
      action: () => {
        if (personal.phone) {
          const phoneNumber = personal.phone.replace(/\D/g, '')
          window.open(`https://wa.me/${phoneNumber}`, '_blank')
        } else {
          toast.info('WhatsApp not available. Please use email or calendar booking.')
        }
      },
      available: !!personal.phone,
      responseTime: 'Same day',
      color: 'text-green-600',
    },
  ]

  const getStatusColor = () => {
    switch (status) {
      case 'available':
        return 'bg-green-500'
      case 'busy':
        return 'bg-yellow-500'
      case 'away':
        return 'bg-gray-500'
      default:
        return 'bg-green-500'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'available':
        return 'Available'
      case 'busy':
        return 'Busy'
      case 'away':
        return 'Away'
      default:
        return 'Available'
    }
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <MessageCircle className="h-10 w-10 text-primary" />
              Universal Contact Hub
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Get in touch through any channel you prefer. Choose the method that works best for you.
            </p>
            
            {/* Status Indicator */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className={`h-3 w-3 rounded-full ${getStatusColor()} animate-pulse`}></div>
              <span className="text-sm font-medium">{getStatusText()}</span>
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Response time: 24 hours
              </Badge>
            </div>
          </motion.div>

          {/* Contact Methods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {contactMethods.map((method, idx) => {
              const Icon = method.icon
              const isCopied = copiedId === method.id
              
              return (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className={`h-full hover:shadow-lg transition-all duration-300 ${
                    !method.available ? 'opacity-60' : ''
                  }`}>
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className={`p-3 rounded-lg bg-primary/10 ${method.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        {method.available ? (
                          <Badge variant="default" className="bg-green-500">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Available
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <XCircle className="h-3 w-3 mr-1" />
                            Unavailable
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">{method.name}</CardTitle>
                      <CardDescription>{method.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {method.responseTime && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{method.responseTime}</span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          onClick={method.action}
                          disabled={!method.available}
                          className="flex-1"
                          variant={method.available ? 'default' : 'secondary'}
                        >
                          {method.available ? (
                            <>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open
                            </>
                          ) : (
                            'Unavailable'
                          )}
                        </Button>
                        {method.id === 'email' && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(personal.email, 'email')}
                            title="Copy email address"
                          >
                            {isCopied ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        {method.id === 'phone' && personal.phone && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(personal.phone!, 'phone')}
                            title="Copy phone number"
                          >
                            {isCopied ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Contact Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Send a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and I'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="form" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="form">Contact Form</TabsTrigger>
                    <TabsTrigger value="quick">Quick Contact</TabsTrigger>
                  </TabsList>
                  <TabsContent value="form" className="mt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" placeholder="Your name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="your.email@example.com" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" placeholder="What's this about?" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell me about your project, opportunity, or question..."
                          className="min-h-[150px]"
                        />
                      </div>
                      <Button className="w-full" size="lg" onClick={() => {
                        toast.info('Redirecting to contact form...')
                        window.location.href = '/#contact'
                      }}>
                        <Send className="h-4 w-4 mr-2" />
                        Go to Full Contact Form
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="quick" className="mt-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold mb-2">Quick Contact Info</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-primary" />
                            <span>{personal.email}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 ml-auto"
                              onClick={() => copyToClipboard(personal.email, 'quick-email')}
                            >
                              {copiedId === 'quick-email' ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                          {personal.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-primary" />
                              <span>{personal.phone}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 ml-auto"
                                onClick={() => copyToClipboard(personal.phone!, 'quick-phone')}
                              >
                                {copiedId === 'quick-phone' ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-primary" />
                            <span>{personal.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => window.open(`mailto:${personal.email}`, '_blank')}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => window.open(personal.linkedin, '_blank')}
                        >
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => window.open(personal.github, '_blank')}
                        >
                          <Github className="h-4 w-4 mr-2" />
                          GitHub
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Why Multiple Contact Methods?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Flexibility</p>
                      <p className="text-xs text-muted-foreground">
                        Choose the method that fits your workflow and urgency
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Reliability</p>
                      <p className="text-xs text-muted-foreground">
                        Multiple channels ensure your message gets through
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Efficiency</p>
                      <p className="text-xs text-muted-foreground">
                        Book meetings instantly, no back-and-forth emails
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

