'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Sparkles, Loader2, CheckCircle2, AlertCircle, Code2, Database, Wrench, Lightbulb } from 'lucide-react'

interface ProjectAnalysis {
  repoUrl: string
  techStack: {
    languages: string[]
    frameworks: string[]
    databases: string[]
    tools: string[]
  }
  codeQuality: {
    score: number
    metrics: {
      testCoverage?: string
      documentation?: string
      codeStyle?: string
      dependencies?: string
    }
  }
  insights: {
    strengths: string[]
    improvements: string[]
    recommendations: string[]
  }
  documentation?: {
    readme: string
    apiDocs?: string
  }
  analyzedAt: string
}

export default function ProjectAnalyzer() {
  const [repoUrl, setRepoUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<ProjectAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [options, setOptions] = useState({
    includeCodeQuality: true,
    includeSuggestions: true,
    includeDocumentation: false,
  })

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) {
      setError('Please enter a GitHub repository URL')
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setAnalysis(null)

    try {
      const response = await fetch('/api/project-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repoUrl: repoUrl.trim(),
          ...options,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze project')
      }

      const data = await response.json()
      setAnalysis(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI Project Analyzer
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Get AI-powered insights about any GitHub repository
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="space-y-4">
          <div>
            <label htmlFor="repo-url" className="block text-sm font-medium mb-2">
              GitHub Repository URL
            </label>
            <div className="flex gap-2">
              <input
                id="repo-url"
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && !isAnalyzing && handleAnalyze()}
              />
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analyze
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="flex flex-wrap gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeCodeQuality}
                onChange={(e) => setOptions({ ...options, includeCodeQuality: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm">Code Quality</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeSuggestions}
                onChange={(e) => setOptions({ ...options, includeSuggestions: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm">Suggestions</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeDocumentation}
                onChange={(e) => setOptions({ ...options, includeDocumentation: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm">Documentation</span>
            </label>
          </div>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Tech Stack */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-blue-600" />
                Tech Stack
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TechStackSection title="Languages" items={analysis.techStack.languages} icon={<Code2 />} />
                <TechStackSection title="Frameworks" items={analysis.techStack.frameworks} icon={<Wrench />} />
                <TechStackSection title="Databases" items={analysis.techStack.databases} icon={<Database />} />
                <TechStackSection title="Tools" items={analysis.techStack.tools} icon={<Wrench />} />
              </div>
            </div>

            {/* Code Quality */}
            {options.includeCodeQuality && analysis.codeQuality && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Code Quality Score: {analysis.codeQuality.score}/100
                </h3>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${analysis.codeQuality.score}%` }}
                    transition={{ duration: 1 }}
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                  />
                </div>
                {Object.entries(analysis.codeQuality.metrics).length > 0 && (
                  <div className="space-y-2">
                    {Object.entries(analysis.codeQuality.metrics).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Insights */}
            {options.includeSuggestions && analysis.insights && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  Insights & Recommendations
                </h3>
                <div className="space-y-4">
                  {analysis.insights.strengths.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-green-600 mb-2">Strengths</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {analysis.insights.strengths.map((strength, idx) => (
                          <li key={idx} className="text-gray-700 dark:text-gray-300">{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysis.insights.improvements.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-orange-600 mb-2">Areas for Improvement</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {analysis.insights.improvements.map((improvement, idx) => (
                          <li key={idx} className="text-gray-700 dark:text-gray-300">{improvement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysis.insights.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-blue-600 mb-2">Recommendations</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {analysis.insights.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-gray-700 dark:text-gray-300">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Documentation */}
            {options.includeDocumentation && analysis.documentation && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4">Documentation Suggestions</h3>
                <div className="space-y-4">
                  {analysis.documentation.readme && (
                    <div>
                      <h4 className="font-semibold mb-2">README Improvements</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {analysis.documentation.readme}
                      </p>
                    </div>
                  )}
                  {analysis.documentation.apiDocs && (
                    <div>
                      <h4 className="font-semibold mb-2">API Documentation</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {analysis.documentation.apiDocs}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Analyzed at: {new Date(analysis.analyzedAt).toLocaleString()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TechStackSection({ title, items, icon }: { title: string; items: string[]; icon: React.ReactNode }) {
  if (items.length === 0) return null

  return (
    <div>
      <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
        {icon}
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

