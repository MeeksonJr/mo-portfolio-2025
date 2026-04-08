import { LayoutTemplate, BrainCircuit, Database, ArrowRight } from 'lucide-react'

export default function ServicesGrid() {
  const services = [
    {
      title: "Full-Stack Web Architecture",
      description: "End-to-end development of interactive, highly scalable web applications using Next.js, React, and robust APIs.",
      icon: LayoutTemplate,
      features: ["Server-Side Rendering (SSR)", "Responsive UI/UX", "API Integrations"]
    },
    {
      title: "AI Integration Pipelines",
      description: "Implementing cutting-edge LLMs (Gemini, Groq, local models) into your existing workflows to automate complex business logic.",
      icon: BrainCircuit,
      features: ["RAG Systems", "Automated Workflows", "Vector Databases"]
    },
    {
      title: "Cloud & Database Security",
      description: "Architecting secure, isolated multi-tenant databases with PostgreSQL, Supabase RLS, and secure Edge authentication.",
      icon: Database,
      features: ["PostgreSQL / Supabase", "Row Level Security", "OAuth & Edge Middleware"]
    }
  ]

  return (
    <div className="w-full space-y-8">
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Dedicated Engineering Services</h2>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Partnering with businesses to rapidly prototype, build, and scale digital products. From deep technical backend infrastructure to pixel-perfect frontend experiences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, idx) => {
          const Icon = service.icon
          return (
            <div key={idx} className="group flex flex-col p-8 rounded-3xl bg-secondary/30 hover:bg-secondary/60 border border-transparent hover:border-primary/20 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-muted-foreground mb-6 flex-grow">{service.description}</p>
              
              <ul className="space-y-2 mb-8">
                {service.features.map(feature => (
                  <li key={feature} className="flex items-center text-sm font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
