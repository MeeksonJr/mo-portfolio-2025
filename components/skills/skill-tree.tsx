'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Code2, Database, Zap, Globe, Brain, 
  Lock, Unlock, ChevronRight, ExternalLink,
  Award, TrendingUp, Target, Info
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import { resumeData } from '@/lib/resume-data'
import Link from 'next/link'

interface SkillNode {
  id: string
  name: string
  category: 'frontend' | 'backend' | 'ai' | 'tools' | 'languages'
  level: number // 1-5, determines position in tree
  dependencies?: string[] // IDs of prerequisite skills
  icon: typeof Code2
  color: string
  description: string
  relatedProjects?: string[]
  unlocked: boolean
  progress: number // 0-100
}

const SKILL_CATEGORIES = {
  frontend: { icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500' },
  backend: { icon: Database, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500' },
  ai: { icon: Brain, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500' },
  tools: { icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500' },
  languages: { icon: Code2, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500' },
}

export default function InteractiveSkillTree() {
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [unlockedSkills, setUnlockedSkills] = useState<Set<string>>(new Set())

  // Build skill tree from resume data
  const skillNodes = useMemo<SkillNode[]>(() => {
    const nodes: SkillNode[] = []
    const { skills } = resumeData

    // Frontend skills
    skills.frontend.forEach((skill, idx) => {
      nodes.push({
        id: `frontend-${idx}`,
        name: skill,
        category: 'frontend',
        level: Math.min(5, Math.floor(idx / 2) + 1),
        dependencies: idx > 0 ? [`frontend-${idx - 1}`] : undefined,
        icon: Globe,
        color: 'text-blue-500',
        description: `Frontend technology: ${skill}`,
        unlocked: idx < 3, // First 3 unlocked by default
        progress: Math.min(100, (idx + 1) * 20),
      })
    })

    // Backend skills
    skills.backend.forEach((skill, idx) => {
      nodes.push({
        id: `backend-${idx}`,
        name: skill,
        category: 'backend',
        level: Math.min(5, Math.floor(idx / 2) + 1),
        dependencies: idx > 0 ? [`backend-${idx - 1}`] : undefined,
        icon: Database,
        color: 'text-green-500',
        description: `Backend technology: ${skill}`,
        unlocked: idx < 2, // First 2 unlocked by default
        progress: Math.min(100, (idx + 1) * 25),
      })
    })

    // AI skills
    skills.ai.forEach((skill, idx) => {
      nodes.push({
        id: `ai-${idx}`,
        name: skill,
        category: 'ai',
        level: Math.min(5, Math.floor(idx / 1) + 1),
        dependencies: idx > 0 ? [`ai-${idx - 1}`] : undefined,
        icon: Brain,
        color: 'text-purple-500',
        description: `AI/ML technology: ${skill}`,
        unlocked: idx < 2, // First 2 unlocked by default
        progress: Math.min(100, (idx + 1) * 30),
      })
    })

    // Tools
    skills.tools.forEach((skill, idx) => {
      nodes.push({
        id: `tools-${idx}`,
        name: skill,
        category: 'tools',
        level: Math.min(5, Math.floor(idx / 2) + 1),
        dependencies: idx > 0 ? [`tools-${idx - 1}`] : undefined,
        icon: Zap,
        color: 'text-orange-500',
        description: `Development tool: ${skill}`,
        unlocked: idx < 3, // First 3 unlocked by default
        progress: Math.min(100, (idx + 1) * 20),
      })
    })

    // Languages
    skills.languages?.forEach((skill, idx) => {
      nodes.push({
        id: `lang-${idx}`,
        name: skill,
        category: 'languages',
        level: Math.min(5, Math.floor(idx / 1) + 1),
        dependencies: idx > 0 ? [`lang-${idx - 1}`] : undefined,
        icon: Code2,
        color: 'text-yellow-500',
        description: `Programming language: ${skill}`,
        unlocked: idx < 3, // First 3 unlocked by default
        progress: Math.min(100, (idx + 1) * 25),
      })
    })

    return nodes
  }, [])

  // Filter nodes by category
  const filteredNodes = useMemo(() => {
    if (selectedCategory === 'all') return skillNodes
    return skillNodes.filter(node => node.category === selectedCategory)
  }, [skillNodes, selectedCategory])

  // Group nodes by level and category
  const groupedNodes = useMemo(() => {
    const groups: Record<string, SkillNode[]> = {}
    filteredNodes.forEach(node => {
      const key = `${node.category}-${node.level}`
      if (!groups[key]) groups[key] = []
      groups[key].push(node)
    })
    return groups
  }, [filteredNodes])

  const handleNodeClick = (node: SkillNode) => {
    // Check if dependencies are met
    if (node.dependencies) {
      const allDepsMet = node.dependencies.every(depId => {
        const depNode = skillNodes.find(n => n.id === depId)
        return depNode?.unlocked || unlockedSkills.has(depId)
      })
      
      if (!allDepsMet) {
        return // Can't unlock yet
      }
    }

    // Unlock skill
    if (!node.unlocked && !unlockedSkills.has(node.id)) {
      setUnlockedSkills(prev => new Set([...prev, node.id]))
    }
    
    setSelectedNode(node)
  }

  const isNodeUnlocked = (node: SkillNode) => {
    return node.unlocked || unlockedSkills.has(node.id)
  }

  const canUnlock = (node: SkillNode) => {
    if (isNodeUnlocked(node)) return true
    if (!node.dependencies) return true
    return node.dependencies.every(depId => {
      const depNode = skillNodes.find(n => n.id === depId)
      return depNode && (depNode.unlocked || unlockedSkills.has(depId))
    })
  }

  const categories = ['all', ...Object.keys(SKILL_CATEGORIES)]

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <Target className="h-10 w-10 text-primary" />
              Interactive Skill Tree
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore technical skills, their dependencies, and unlock new nodes as you progress.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 flex flex-wrap gap-2 justify-center"
          >
            {categories.map((cat) => {
              if (cat === 'all') {
                return (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    All Skills
                  </Button>
                )
              }
              const categoryData = SKILL_CATEGORIES[cat as keyof typeof SKILL_CATEGORIES]
              const Icon = categoryData.icon
              return (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat)}
                  className="capitalize"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {cat}
                </Button>
              )
            })}
          </motion.div>

          {/* Skill Tree Visualization */}
          <div className="space-y-12">
            {Object.entries(groupedNodes)
              .sort(([keyA], [keyB]) => {
                const [catA, levelA] = keyA.split('-')
                const [catB, levelB] = keyB.split('-')
                if (catA !== catB) return catA.localeCompare(catB)
                return parseInt(levelA) - parseInt(levelB)
              })
              .map(([key, nodes]) => {
                const [category, level] = key.split('-')
                const categoryData = SKILL_CATEGORIES[category as keyof typeof SKILL_CATEGORIES]
                const Icon = categoryData.icon

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-1 w-16 ${categoryData.border} border-t-2`}></div>
                      <div className="flex items-center gap-2">
                        <Icon className={`h-6 w-6 ${categoryData.color}`} />
                        <h2 className="text-2xl font-bold capitalize">{category}</h2>
                        <Badge variant="secondary">Level {level}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {nodes.map((node, idx) => {
                        const unlocked = isNodeUnlocked(node)
                        const canUnlockNode = canUnlock(node)
                        const NodeIcon = node.icon

                        return (
                          <motion.div
                            key={node.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <Card
                              className={`h-full cursor-pointer transition-all relative overflow-hidden ${
                                unlocked
                                  ? `${categoryData.bg} ${categoryData.border} border-2 hover:shadow-lg`
                                  : canUnlockNode
                                  ? 'border-2 border-dashed hover:border-primary/50 opacity-75'
                                  : 'border-2 border-dashed opacity-50 cursor-not-allowed'
                              }`}
                              onClick={() => handleNodeClick(node)}
                            >
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                  <div className={`p-2 rounded-lg ${categoryData.bg}`}>
                                    <NodeIcon className={`h-5 w-5 ${categoryData.color}`} />
                                  </div>
                                  {unlocked ? (
                                    <Unlock className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                                <CardTitle className="text-base mt-2">{node.name}</CardTitle>
                              </CardHeader>
                              <CardContent className="pt-0">
                                {unlocked && (
                                  <div className="space-y-2">
                                    <div className="space-y-1">
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Progress</span>
                                        <span className="font-semibold">{node.progress}%</span>
                                      </div>
                                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: `${node.progress}%` }}
                                          transition={{ duration: 0.5, delay: 0.2 }}
                                          className={`h-full ${categoryData.bg.replace('/10', '')}`}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {!unlocked && canUnlockNode && (
                                  <p className="text-xs text-muted-foreground">
                                    Click to unlock
                                  </p>
                                )}
                                {!unlocked && !canUnlockNode && (
                                  <p className="text-xs text-muted-foreground">
                                    Requires prerequisites
                                  </p>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>
                )
              })}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Skill Tree Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {skillNodes.filter(n => isNodeUnlocked(n)).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Unlocked Skills</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {skillNodes.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Skills</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500">
                      {Math.round((skillNodes.filter(n => isNodeUnlocked(n)).length / skillNodes.length) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Completion</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {Object.keys(SKILL_CATEGORIES).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Categories</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Node Detail Modal */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${SKILL_CATEGORIES[selectedNode.category].bg}`}>
                        <selectedNode.icon className={`h-6 w-6 ${SKILL_CATEGORIES[selectedNode.category].color}`} />
                      </div>
                      <div>
                        <CardTitle>{selectedNode.name}</CardTitle>
                        <CardDescription className="capitalize">{selectedNode.category}</CardDescription>
                      </div>
                    </div>
                    {isNodeUnlocked(selectedNode) ? (
                      <Badge className="bg-green-500">
                        <Unlock className="h-3 w-3 mr-1" />
                        Unlocked
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <Lock className="h-3 w-3 mr-1" />
                        Locked
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{selectedNode.description}</p>
                  
                  {selectedNode.dependencies && selectedNode.dependencies.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Prerequisites
                      </h4>
                      <div className="space-y-1">
                        {selectedNode.dependencies.map(depId => {
                          const depNode = skillNodes.find(n => n.id === depId)
                          if (!depNode) return null
                          return (
                            <div key={depId} className="flex items-center gap-2 text-sm">
                              {isNodeUnlocked(depNode) ? (
                                <Unlock className="h-3 w-3 text-green-500" />
                              ) : (
                                <Lock className="h-3 w-3 text-muted-foreground" />
                              )}
                              <span className={isNodeUnlocked(depNode) ? '' : 'text-muted-foreground'}>
                                {depNode.name}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {isNodeUnlocked(selectedNode) && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Progress</h4>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Mastery</span>
                          <span className="font-semibold">{selectedNode.progress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${selectedNode.progress}%` }}
                            className={`h-full ${SKILL_CATEGORIES[selectedNode.category].bg.replace('/10', '')}`}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setSelectedNode(null)}
                    >
                      Close
                    </Button>
                    <Button
                      asChild
                      className="flex-1"
                    >
                      <Link href="/projects">
                        View Projects
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FooterLight />
    </>
  )
}

