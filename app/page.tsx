import FooterLight from "@/components/footer-light"
import Navigation from "@/components/navigation"
import { AIChatbotVoice } from "@/components/chatbot/chatbot-wrappers"
import ScrollProgress from "@/components/scroll-progress"
import StructuredData from "@/components/structured-data"
import FloatingActionMenu from "@/components/floating-action-menu"
import CustomizableHomepage from "@/components/homepage/customizable-homepage"
import HomepageCustomizer from "@/components/homepage/homepage-customizer"
import TouchGestures from "@/components/mobile/touch-gestures"
import MetaTags from "@/components/seo/meta-tags"
import ResourcePreloader from "@/components/seo/resource-preloader"

export default function Home() {
  return (
    <>
      <MetaTags
        title="Mohamed Datt | Full Stack Developer"
        description="Creative Full Stack Developer specializing in AI-powered web applications, Next.js, TypeScript, and modern web technologies"
        url="/"
        type="website"
        keywords={["Full Stack Developer", "Next.js", "TypeScript", "React", "AI", "Web Development", "Portfolio"]}
      />
      <StructuredData
        type="Person"
        title="Mohamed Datt - Full Stack Developer"
        description="Creative Full Stack Developer specializing in AI-powered web applications, Next.js, TypeScript, and modern web technologies"
        url="/"
      />
      <ResourcePreloader
        images={['/og-image.png', '/images/Photo.jpg']}
        resources={[
          { href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
        ]}
      />
      <TouchGestures>
        <div className="min-h-screen bg-background relative">
          <ScrollProgress />
          <Navigation />

          <main id="main-content" className="relative z-10" role="main" tabIndex={-1}>
            <CustomizableHomepage />
          </main>

          <HomepageCustomizer />

          <FooterLight />
          <AIChatbotVoice />
        </div>
      </TouchGestures>
    </>
  )
}
