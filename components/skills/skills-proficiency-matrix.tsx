'use client'

import { motion } from 'framer-motion'
import { Code, Database, Sparkles, Wrench, Languages, Palette, TrendingUp, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  skillsData,
  skillsByCategory,
  getProficiencyLevel,
  getProficiencyColor,
  getProficiencyBadgeColor,
  type ProficiencyLevel,
} from '@/lib/skills-data'

const categoryIcons = {
  frontend: Code,
  backend: Database,
  ai: Sparkles,
  tools: Wrench,
  languages: Languages,
  design: Palette,
}

const categoryLabels = {
  frontend: 'Frontend',
  backend: 'Backend',
  ai: 'AI & ML',
  tools: 'Tools',
  languages: 'Languages',
  design: 'Design',
}

export default function SkillsProficiencyMatrix() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="glass rounded-2xl p-8 md:p-12 mb-16"
    >
      <div className="flex items-center gap-3 mb-8">
        <TrendingUp className="text-primary" size={28} />
        <h2 className="text-3xl md:text-4xl font-bold">Skills & Proficiency</h2>
      </div>

      <Tabs defaultValue="frontend" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-8 bg-muted/50">
          {Object.entries(categoryLabels).map(([key, label]) => {
            const Icon = categoryIcons[key as keyof typeof categoryIcons]
            const skills = skillsByCategory[key as keyof typeof skillsByCategory]
            return (
              <TabsTrigger
                key={key}
                value={key}
                className="flex flex-col md:flex-row items-center gap-2 data-[state=active]:bg-background"
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs md:text-sm">{label}</span>
                <Badge variant="secondary" className="text-xs">
                  {skills.length}
                </Badge>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {Object.entries(categoryLabels).map(([categoryKey, categoryLabel]) => {
          const skills = skillsByCategory[categoryKey as keyof typeof skillsByCategory]
          const Icon = categoryIcons[categoryKey as keyof typeof categoryIcons]

          return (
            <TabsContent key={categoryKey} value={categoryKey} className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((skill, index) => {
                  const proficiencyLevel = getProficiencyLevel(skill.proficiency)
                  const proficiencyColor = getProficiencyColor(skill.proficiency)
                  const badgeColor = getProficiencyBadgeColor(skill.proficiency)

                  return (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow bg-background/95 backdrop-blur-sm">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between mb-2">
                            <CardTitle className="text-lg">{skill.name}</CardTitle>
                            <Badge className={badgeColor} variant="outline">
                              {skill.proficiency}
                            </Badge>
                          </div>
                          <CardDescription className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'}
                              </span>
                            </div>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Proficiency</span>
                              <span>{proficiencyLevel}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <motion.div
                                className={`${proficiencyColor} h-2 rounded-full`}
                                initial={{ width: 0 }}
                                whileInView={{ width: `${proficiencyLevel}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: index * 0.05 + 0.2 }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </TabsContent>
          )
        })}
      </Tabs>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t"
      >
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">{skillsData.length}</div>
          <div className="text-sm text-muted-foreground">Total Skills</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">
            {skillsData.filter(s => s.proficiency === 'Expert').length}
          </div>
          <div className="text-sm text-muted-foreground">Expert Level</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">
            {Math.round(
              skillsData.reduce((acc, s) => acc + s.yearsOfExperience, 0) / skillsData.length
            )}
          </div>
          <div className="text-sm text-muted-foreground">Avg. Years</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">
            {Math.round(
              (skillsData.reduce((acc, s) => acc + getProficiencyLevel(s.proficiency), 0) / skillsData.length) * 10
            ) / 10}%
          </div>
          <div className="text-sm text-muted-foreground">Avg. Proficiency</div>
        </div>
      </motion.div>
    </motion.section>
  )
}

