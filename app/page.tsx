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
import AIChatbotEnhanced from "@/components/ai-chatbot-enhanced"
import AIChatbotVoice from "@/components/ai-chatbot-voice"
import MusicPlayer from "@/components/music-player"
import ScrollProgress from "@/components/scroll-progress"
import Experience from "@/components/experience"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <ScrollProgress />
      <Navigation />

      <main>
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
      <AIChatbotEnhanced />
      <AIChatbotVoice />
      <MusicPlayer />
    </div>
  )
}
