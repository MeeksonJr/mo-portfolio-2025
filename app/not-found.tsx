'use client'

import Link from 'next/link'
import { Home, ArrowLeft, Terminal, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Terminal-style error display */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Terminal className="h-12 w-12 text-primary" />
            <h1 className="text-6xl font-bold text-foreground">404</h1>
          </div>
          
          <div className="font-mono text-left bg-muted/50 p-6 rounded-lg border border-primary/20">
            <div className="text-primary mb-2">$ error --code 404</div>
            <div className="text-muted-foreground">
              <div className="mb-2">❌ Page not found</div>
              <div className="text-sm opacity-75">
                The requested resource could not be located.
                <br />
                Possible causes:
                <br />
                • URL typo or outdated link
                <br />
                • Page moved or deleted
                <br />
                • Invalid route
              </div>
            </div>
          </div>

          <div className="text-lg text-muted-foreground">
            Looks like you've wandered into uncharted territory.
            <br />
            Let's get you back on track.
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/blog">
              <Search className="mr-2 h-4 w-4" />
              Browse Blog
            </Link>
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Quick links */}
        <div className="pt-8 border-t">
          <p className="text-sm text-muted-foreground mb-4">Quick Links:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/about" className="text-primary hover:underline">
              About
            </Link>
            <Link href="/projects" className="text-primary hover:underline">
              Projects
            </Link>
            <Link href="/case-studies" className="text-primary hover:underline">
              Case Studies
            </Link>
            <Link href="/resources" className="text-primary hover:underline">
              Resources
            </Link>
            <Link href="/contact" className="text-primary hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

