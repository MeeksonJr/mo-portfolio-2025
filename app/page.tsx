import FooterLight from "@/components/footer-light"
import Navigation from "@/components/navigation"
import { AIChatbotVoice } from "@/components/chatbot/chatbot-wrappers"
import ScrollProgress from "@/components/scroll-progress"
import StructuredData from "@/components/structured-data"
import FloatingActionMenu from "@/components/floating-action-menu"
import CustomizableHomepage from "@/components/homepage/customizable-homepage"
import HomepageCustomizer from "@/components/homepage/homepage-customizer"

export default function Home() {
  return (
    <>
      <StructuredData
        type="Person"
        title="Mohamed Datt - Full Stack Developer"
        description="Creative Full Stack Developer specializing in AI-powered web applications, Next.js, TypeScript, and modern web technologies"
        url="/"
      />
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
    </>
  )
}
