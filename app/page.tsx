import HeroLight from "@/components/hero-light"
import QuickStats from "@/components/quick-stats"
import TechSnapshot from "@/components/tech-snapshot"
import AboutLight from "@/components/about-light"
import ProjectsLight from "@/components/projects-light"
import ServicesPricing from "@/components/services-pricing"
import CoursesSection from "@/components/courses-section"
import Contact from "@/components/contact"
import FooterLight from "@/components/footer-light"
import Navigation from "@/components/navigation"
import AIChatbotVoice from "@/components/ai-chatbot-voice"
import ScrollProgress from "@/components/scroll-progress"
import Experience from "@/components/experience"
import StructuredData from "@/components/structured-data"
import FloatingActionMenu from "@/components/floating-action-menu"

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

      <main className="relative z-10">
        <HeroLight />
        <QuickStats />
        <TechSnapshot />
        <AboutLight />
        <ProjectsLight />
        <Experience />
        <ServicesPricing />
        <CoursesSection />
        <Contact />
      </main>

      <FooterLight />
      <AIChatbotVoice />
      <FloatingActionMenu />
    </div>
    </>
  )
}
