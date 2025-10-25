"use client"

import { motion } from "framer-motion"
import { Github, Star, GitFork, ExternalLink, Calendar, Eye, AlertCircle, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import Inspectable from "./inspectable"

interface Repository {
  id: number
  name: string
  description: string
  stars: number
  forks: number
  language: string
  url: string
  homepage?: string
  topics: string[]
  updated_at?: string
  created_at?: string
  size?: number
  open_issues?: number
  is_featured?: boolean
}

interface GitHubStats {
  total_repos: number
  total_stars: number
  total_forks: number
  followers: number
  following: number
  profile_url: string
  avatar_url?: string
  bio?: string
  location?: string
  blog?: string
  company?: string
  created_at?: string
}

interface GitHubData {
  success: boolean
  repositories: Repository[]
  stats: GitHubStats
  error?: string
  fetched_at: string
  rate_limit_remaining?: string
}

export default function GitHubShowcase() {
  const [data, setData] = useState<GitHubData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGitHubData = async () => {
    try {
      console.log("🐙 GitHub Showcase: Fetching data...")
      setLoading(true)
      setError(null)

      const response = await fetch("/api/github-repos", {
        next: { revalidate: 300 }, // Cache for 5 minutes
      })

      const result: GitHubData = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch GitHub data")
      }

      console.log("✅ GitHub Showcase: Data fetched successfully")
      setData(result)
    } catch (err) {
      console.error("❌ GitHub Showcase: Error fetching data:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGitHubData()
  }, [])

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      TypeScript: "#3178c6",
      JavaScript: "#f1e05a",
      Python: "#3572A5",
      Java: "#b07219",
      HTML: "#e34c26",
      CSS: "#1572B6",
      Go: "#00ADD8",
      Rust: "#dea584",
      PHP: "#4F5D95",
    }
    return colors[language] || "#6b7280"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="text-green-400 text-sm mb-4">$ git log --oneline --graph</div>
            <div className="flex items-center gap-3 mb-12">
              <Github className="text-white" size={32} />
              <h2 className="text-3xl md:text-4xl font-bold">GitHub Showcase</h2>
            </div>

            <div className="flex items-center justify-center py-20">
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Fetching live GitHub data...</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  if (error && !data) {
    return (
      <section className="py-20 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="text-green-400 text-sm mb-4">$ git log --oneline --graph</div>
            <div className="flex items-center gap-3 mb-12">
              <Github className="text-white" size={32} />
              <h2 className="text-3xl md:text-4xl font-bold">GitHub Showcase</h2>
            </div>

            <div className="bg-red-900/50 border border-red-500 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-red-400" size={24} />
                <h3 className="text-red-400 font-semibold">Failed to load GitHub data</h3>
              </div>
              <p className="text-red-200 mb-4">{error}</p>
              <button
                onClick={fetchGitHubData}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition-colors"
              >
                <RefreshCw size={16} />
                Retry
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  const repos = data?.repositories || []
  const stats = data?.stats

  return (
    <section className="py-20 px-4 bg-gray-900/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-green-400 text-sm mb-4">$ git log --oneline --graph</div>
          <div className="flex items-center gap-3 mb-8">
            <Github className="text-white" size={32} />
            <h2 className="text-3xl md:text-4xl font-bold">GitHub Showcase</h2>
            {!data?.success && (
              <span className="px-2 py-1 bg-yellow-900/50 text-yellow-400 text-xs rounded">Fallback Data</span>
            )}
          </div>

          {/* GitHub Stats */}
          {stats && (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-black/50 border border-gray-700 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-400">{stats.total_repos}</div>
                <div className="text-sm text-gray-400">Repositories</div>
              </div>
              <div className="bg-black/50 border border-gray-700 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-400">{stats.total_stars}</div>
                <div className="text-sm text-gray-400">Total Stars</div>
              </div>
              <div className="bg-black/50 border border-gray-700 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-400">{stats.total_forks}</div>
                <div className="text-sm text-gray-400">Total Forks</div>
              </div>
              <div className="bg-black/50 border border-gray-700 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-400">{stats.followers}</div>
                <div className="text-sm text-gray-400">Followers</div>
              </div>
            </motion.div>
          )}

          {/* Repository Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {repos.map((repo, index) => (
              <Inspectable key={repo.id} elementId="github-repo">
                <motion.div
                  className="border border-gray-700 p-6 rounded-lg bg-black/50 hover:border-green-400/50 transition-colors group relative h-full flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -3 }}
                >
                  {repo.is_featured && (
                    <div className="absolute top-0 right-0 bg-green-400 text-black px-2 py-1 text-xs font-semibold rounded-bl">
                      FEATURED
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-green-400 group-hover:text-green-300 transition-colors">
                      {repo.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      {repo.homepage && (
                        <a
                          href={repo.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-400 transition-colors"
                          title="Live Demo"
                        >
                          <Eye size={16} />
                        </a>
                      )}
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                        title="View on GitHub"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4 leading-relaxed text-sm flex-grow">{repo.description}</p>

                  {/* Topics */}
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {repo.topics.slice(0, 3).map((topic) => (
                        <span key={topic} className="px-2 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Star size={14} />
                        <span>{repo.stars}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork size={14} />
                        <span>{repo.forks}</span>
                      </div>
                      {repo.updated_at && (
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{formatDate(repo.updated_at)}</span>
                        </div>
                      )}
                    </div>

                    {repo.language && (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getLanguageColor(repo.language) }}
                        ></div>
                        <span className="text-sm text-gray-400">{repo.language}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </Inspectable>
            ))}
          </div>

          {/* Footer with GitHub Profile Link */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <a
              href={stats?.profile_url || "https://github.com/MeeksonJr"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-green-400 text-green-400 rounded hover:bg-green-400 hover:text-black transition-colors"
            >
              <Github size={20} />
              View All Repositories
            </a>

            {data?.fetched_at && (
              <p className="text-xs text-gray-500 mt-4">
                Last updated: {formatDate(data.fetched_at)}
                {data.rate_limit_remaining && (
                  <span className="ml-2">• API calls remaining: {data.rate_limit_remaining}</span>
                )}
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
