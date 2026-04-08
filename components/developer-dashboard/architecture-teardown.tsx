import { Server, Database, Container, Network, Layers, ShieldCheck } from 'lucide-react'

export default function ArchitectureTeardown() {
  return (
    <div className="w-full space-y-8">
      <div className="flex items-center gap-3 border-b border-primary/20 pb-4">
        <Server className="w-5 h-5 text-primary" />
        <h2 className="text-2xl font-mono font-bold tracking-tight text-primary">System Architecture</h2>
      </div>

      <p className="text-muted-foreground font-mono text-sm">
        Deep dive into the underlying architecture of my SaaS products and this portfolio platform. Designed for high availability, low latency, and robust DX.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TeardownBlock 
          icon={Layers}
          title="Frontend Tiers (Next.js 15)"
          tags={['App Router', 'RSC', 'Framer Motion', 'Tailwind']}
          description="Strict adherence to React Server Components (RSC) for zero-JS initial loads, streaming HTML, and highly localized client boundaries."
        />
        <TeardownBlock 
          icon={Database}
          title="Persistence (Supabase)"
          tags={['PostgreSQL', 'RLS', 'pgvector']}
          description="Leveraging Supabase for Auth and PostgreSQL. Heavy use of Row Level Security (RLS) policies to enforce tenant isolation at the database layer."
        />
        <TeardownBlock 
          icon={Network}
          title="AI Orchestration Pipeline"
          tags={['Gemini 2.0', 'Hugging Face', 'Groq']}
          description="Polyglot AI architecture. Routing complex reasoning to Gemini 2.0, high-speed inferences through Groq, and specialized models via Hugging Face."
        />
        <TeardownBlock 
          icon={ShieldCheck}
          title="Auth & Security"
          tags={['JWT', 'Middleware Edge', 'OAuth']}
          description="Authentication processed entirely at the Edge via Next.js Middleware, preventing unauthorized hits to the server execution environment."
        />
      </div>
    </div>
  )
}

function TeardownBlock({ icon: Icon, title, tags, description }: any) {
  return (
    <div className="border border-border bg-card/10 rounded-xl p-6 hover:bg-card/30 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-mono font-bold text-lg">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground font-mono leading-relaxed mb-6">
        {description}
      </p>
      <div className="flex flex-wrap gap-2 mt-auto">
        {tags.map((tag: string) => (
          <span key={tag} className="px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-mono">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
