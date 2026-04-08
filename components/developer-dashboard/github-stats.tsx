'use client'

import { useEffect, useState } from 'react'
import { GitBranch, Star, Code2, Users, Activity, ExternalLink, Loader2 } from 'lucide-react'

export default function GithubStats() {
  const [data, setData] = useState<{ user: any; repos: any[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/github')
      .then((res) => {
        if (!res.ok) throw new Error('API Error')
        return res.json()
      })
      .then((json) => {
        if (json.error) throw new Error(json.error)
        setData(json)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError(true)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="w-full h-48 border border-primary/20 bg-card/10 rounded-xl flex items-center justify-center text-primary font-mono">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Establishing Telemetry Link...
      </div>
    )
  }

  if (error || !data || !data.user) {
    return (
      <div className="p-8 border border-red-500/20 bg-red-500/5 rounded-xl text-center text-red-400 font-mono">
        Failed to fetch target telemetry: Signal lost or API limited.
      </div>
    )
  }

  const { user, repos } = data
  const totalStars = repos.reduce((acc: number, repo: any) => acc + (repo.stargazers_count || 0), 0)

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-3 border-b border-primary/20 pb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h2 className="text-2xl font-mono font-bold tracking-tight text-primary">Live Telemetry</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Code2} label="Public Repos" value={user.public_repos} />
        <StatCard icon={Users} label="Followers" value={user.followers} />
        <StatCard icon={Star} label="Total Stars" value={totalStars} />
        <StatCard icon={GitBranch} label="Recent Activity" value="Active" />
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4">// RECENT DEPLOYMENTS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {repos.map((repo: any) => (
            <a 
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-5 rounded-lg border border-border bg-card/40 hover:bg-card hover:border-primary/50 transition-all font-mono"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                  {repo.name}
                </span>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              </div>
              <p className="text-xs text-muted-foreground min-h-[40px] mb-4 line-clamp-2">
                {repo.description || "No description provided."}
              </p>
              <div className="flex items-center gap-4 text-xs">
                {repo.language && (
                  <span className="flex items-center gap-1.5 text-primary">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    {repo.language}
                  </span>
                )}
                <span className="text-muted-foreground flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {repo.stargazers_count || 0}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value }: any) {
  return (
    <div className="p-4 rounded-lg bg-card/30 border border-border flex flex-col justify-between h-24">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="w-4 h-4" />
        <span className="text-xs uppercase font-mono">{label}</span>
      </div>
      <div className="text-2xl font-mono font-bold text-foreground">
        {value}
      </div>
    </div>
  )
}
