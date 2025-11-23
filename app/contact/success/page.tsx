import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import ContactSuccessContent from '@/components/contact-success-content'
import StructuredData from '@/components/structured-data'
import { generateMetadata as genMeta } from '@/lib/seo'
import { Metadata } from 'next'

export const metadata: Metadata = genMeta({
  title: 'Message Sent Successfully',
  description: 'Thank you for reaching out! Your message has been sent successfully. I will get back to you soon.',
  type: 'website',
})

export default function ContactSuccessPage() {
  return (
    <>
      <StructuredData
        type="WebSite"
        title="Contact Success"
        description="Thank you for your message"
        url="/contact/success"
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20 pb-16">
          <ContactSuccessContent />
        </main>
        <FooterLight />
      </div>
    </>
  )
}

