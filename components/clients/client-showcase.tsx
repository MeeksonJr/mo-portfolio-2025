'use client'

import { motion } from 'framer-motion'
import { Building2, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { clients } from '@/lib/client-data'

export default function ClientShowcase() {
  if (clients.length === 0) {
    return null // Don't show if no clients
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="py-16"
    >
      <PageContainer width="standard" padding="default">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Building2 className="h-8 w-8 text-primary" />
            <h2 className={cn(TYPOGRAPHY.h2)}>Trusted By</h2>
          </div>
          <p className={cn(TYPOGRAPHY.lead, "text-muted-foreground")}>
            Companies and organizations I've had the pleasure of working with
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {clients.map((client, index) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow bg-background/95 backdrop-blur-sm">
                <CardContent className="p-6 flex flex-col items-center justify-center min-h-[120px]">
                  {client.website ? (
                    <Link
                      href={client.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center gap-2 w-full"
                    >
                      <div className="relative w-32 h-16 flex items-center justify-center">
                        <Image
                          src={client.logo}
                          alt={client.name}
                          fill
                          className="object-contain grayscale group-hover:grayscale-0 transition-all"
                        />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                        <span>{client.name}</span>
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </Link>
                  ) : (
                    <div className="flex flex-col items-center gap-2 w-full">
                      <div className="relative w-32 h-16 flex items-center justify-center">
                        <Image
                          src={client.logo}
                          alt={client.name}
                          fill
                          className="object-contain grayscale"
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{client.name}</span>
                    </div>
                  )}
                  {client.description && (
                    <p className="text-xs text-muted-foreground text-center mt-2 line-clamp-2">
                      {client.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </PageContainer>
    </motion.section>
  )
}

