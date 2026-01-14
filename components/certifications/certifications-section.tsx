'use client'

import { motion } from 'framer-motion'
import { Award, ExternalLink, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { resumeData } from '@/lib/resume-data'
import { format } from 'date-fns'

export default function CertificationsSection() {
  const certifications = resumeData.certifications || []

  if (certifications.length === 0) {
    return null
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mb-16"
    >
      <div className="flex items-center gap-2 mb-8">
        <Award className="text-primary" size={28} />
        <h2 className="text-3xl md:text-4xl font-bold">Certifications & Credentials</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert, index) => (
          <motion.div
            key={cert.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow bg-background/95 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Award className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={`View ${cert.name} certification`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <CardTitle className="text-lg">{cert.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 mt-2">
                  <span>{cert.issuer}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(cert.date), 'MMM yyyy')}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

