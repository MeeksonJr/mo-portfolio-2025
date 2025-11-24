'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { MapPin, GraduationCap, Code, Rocket, Book, Heart, Award, Camera, ChevronRight, X } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

export interface TimelineMilestone {
  id: string
  year: string
  location: string
  title: string
  description: string
  longDescription?: string
  icon: typeof MapPin
  color: string
  photos?: Array<{ url: string; alt: string; caption?: string }>
  achievements?: string[]
  tags?: string[]
}

const milestones: TimelineMilestone[] = [
  {
    id: 'born-guinea',
    year: '2004',
    location: 'Conakry, Guinea',
    title: 'Born in Guinea',
    description: 'Started my journey in Conakry, Guinea, where I was born and spent my early childhood.',
    longDescription: 'Born in Conakry, the capital of Guinea, West Africa. This is where my story began - a place rich in culture, family, and early memories that would shape my perspective on life and learning.',
    icon: MapPin,
    color: 'bg-green-500',
    tags: ['Birth', 'Guinea', 'West Africa'],
  },
  {
    id: 'moved-nyc',
    year: '2011',
    location: 'New York City, USA',
    title: 'Moved to NYC',
    description: 'Moved to New York City with my family at age 6. Faced early challenges with language barriers and adapting to a new culture.',
    longDescription: 'At just 6 years old, I moved to New York City with my family. This was a major transition - new country, new language, new everything. The early days were challenging, but they taught me resilience and adaptability that would serve me throughout my life.',
    icon: Heart,
    color: 'bg-blue-500',
    tags: ['Immigration', 'NYC', 'Family'],
  },
  {
    id: 'learned-english',
    year: '2011-2012',
    location: 'New York City, USA',
    title: 'Learning Through Cartoons',
    description: 'Learned English in just 3 months by watching cartoons like Dora the Explorer. This experience taught me resilience and creative problem-solving.',
    longDescription: 'Facing language barriers in school, I discovered an unexpected teacher: cartoons. Shows like Dora the Explorer became my classroom. In just 3 months, I went from knowing no English to being fluent. This experience taught me that learning can happen anywhere, and creativity often comes from unexpected places. It also showed me the power of persistence and finding your own path to success.',
    icon: Book,
    color: 'bg-purple-500',
    tags: ['Learning', 'Resilience', 'Language'],
    achievements: ['Fluent English in 3 months'],
  },
  {
    id: 'discovered-coding',
    year: '2018',
    location: 'Queens, NYC',
    title: 'Discovered Coding',
    description: 'Moved to Queens and discovered my passion for coding. Started learning programming fundamentals and building my first projects.',
    longDescription: 'After moving to Queens, I discovered the world of programming. What started as curiosity quickly became a passion. I spent countless hours learning, experimenting, and building. This was when I realized that code could be a creative outlet and a way to solve real problems.',
    icon: Code,
    color: 'bg-orange-500',
    tags: ['Programming', 'Discovery', 'Passion'],
  },
  {
    id: 'started-college',
    year: '2022',
    location: 'Norfolk, Virginia',
    title: 'Started Computer Science',
    description: 'Started Computer Science at Tidewater Community College, focusing on full-stack development and modern web technologies.',
    longDescription: 'Enrolled at Tidewater Community College to formally study Computer Science. This was a pivotal moment - combining my self-taught skills with structured learning. I focused on full-stack development, learning both frontend and backend technologies, and began to see how all the pieces fit together.',
    icon: GraduationCap,
    color: 'bg-indigo-500',
    tags: ['Education', 'Computer Science', 'TCC'],
  },
  {
    id: 'competition-win',
    year: '2024',
    location: 'Norfolk, Virginia',
    title: 'Competition Winner',
    description: 'Graduated from TCC and won 1st place out of 13 teams in an internship competition, showcasing my technical skills and problem-solving abilities.',
    longDescription: 'After graduating from TCC, I participated in an internship competition with 13 teams. The challenge was intense, but I applied everything I had learned - technical skills, problem-solving, and the resilience I developed over the years. Winning 1st place was validation that my journey, though unconventional, was working.',
    icon: Award,
    color: 'bg-yellow-500',
    tags: ['Achievement', 'Competition', 'Graduation'],
    achievements: ['1st Place - Internship Competition', 'TCC Graduate'],
  },
  {
    id: 'building-saas',
    year: '2023-2024',
    location: 'Norfolk, Virginia',
    title: 'Building SaaS Products',
    description: 'Designed and shipped multiple AI-powered SaaS products from prototypes to live platforms with real users.',
    longDescription: 'During and after college, I began building real products. I created multiple AI-powered SaaS applications, taking them from concept to deployment. These weren\'t just projects - they were live platforms with real users. This experience taught me product development, user experience, and the importance of shipping.',
    icon: Code,
    color: 'bg-pink-500',
    tags: ['SaaS', 'AI', 'Products'],
    achievements: ['5+ AI-powered SaaS applications', 'Real users and deployments'],
  },
  {
    id: 'current',
    year: '2025',
    location: 'Norfolk, Virginia',
    title: 'Full Stack Developer',
    description: '20-year-old Full Stack Developer specializing in AI-powered web applications, available for freelance, partnerships, and full-time roles.',
    longDescription: 'Today, I\'m a 20-year-old Full Stack Developer with a unique journey. From Guinea to NYC to Norfolk, from cartoons to code, I\'ve learned that success comes from persistence, creativity, and never being afraid to find your own path. I specialize in AI-powered web applications and am always looking for new challenges and opportunities to grow.',
    icon: Rocket,
    color: 'bg-primary',
    tags: ['Current', 'Full Stack', 'AI', 'Developer'],
  },
]

export default function InteractiveTimeline() {
  const [selectedMilestone, setSelectedMilestone] = useState<TimelineMilestone | null>(null)
  const [activeMilestone, setActiveMilestone] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Calculate progress along timeline
  const timelineProgress = useTransform(scrollYProgress, [0, 1], [0, 100])

  return (
    <div ref={containerRef} className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Journey</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From Guinea to NYC to Norfolk - A timeline of growth, learning, and building
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-primary transform md:-translate-x-1/2" />

          {/* Progress Indicator */}
          <motion.div
            className="absolute left-8 md:left-1/2 top-0 w-1 bg-primary transform md:-translate-x-1/2 origin-top"
            style={{
              height: useTransform(scrollYProgress, [0, 1], ['0%', '100%']),
            }}
          />

          {/* Milestones */}
          <div className="space-y-24 md:space-y-32">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon
              const isEven = index % 2 === 0
              const ref = useRef<HTMLDivElement>(null)
              const isInView = useInView(ref, { once: true, margin: '-100px' })

              return (
                <motion.div
                  key={milestone.id}
                  ref={ref}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <motion.button
                      onClick={() => setSelectedMilestone(milestone)}
                      className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${milestone.color} border-4 border-background shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform group`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="text-white" size={28} />
                    </motion.button>
                    {/* Pulse animation for active milestone */}
                    {activeMilestone === milestone.id && (
                      <motion.div
                        className={`absolute inset-0 rounded-full ${milestone.color} opacity-50`}
                        animate={{ scale: [1, 1.5, 1.5], opacity: [0.5, 0, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>

                  {/* Content Card */}
                  <motion.div
                    className={`flex-1 ${isEven ? 'md:mr-auto md:max-w-md' : 'md:ml-auto md:max-w-md'}`}
                    onMouseEnter={() => setActiveMilestone(milestone.id)}
                    onMouseLeave={() => setActiveMilestone(null)}
                  >
                    <Card className="glass hover:shadow-xl transition-all cursor-pointer group">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Badge variant="outline" className="mb-2">
                              {milestone.year}
                            </Badge>
                            <CardTitle className="text-xl mb-1">{milestone.title}</CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" />
                              {milestone.location}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{milestone.description}</p>
                        {milestone.achievements && milestone.achievements.length > 0 && (
                          <div className="mb-4">
                            {milestone.achievements.map((achievement, idx) => (
                              <Badge key={idx} variant="secondary" className="mr-2 mb-2">
                                {achievement}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {milestone.tags && milestone.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {milestone.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedMilestone(milestone)}
                          className="w-full group-hover:text-primary"
                        >
                          Read More
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Milestone Detail Modal */}
      {selectedMilestone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedMilestone(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-card rounded-lg shadow-2xl border"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 z-10"
              onClick={() => setSelectedMilestone(null)}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-16 h-16 rounded-full ${selectedMilestone.color} flex items-center justify-center flex-shrink-0`}>
                  {(() => {
                    const Icon = selectedMilestone.icon
                    return <Icon className="text-white" size={32} />
                  })()}
                </div>
                <div className="flex-1">
                  <Badge variant="outline" className="mb-2">
                    {selectedMilestone.year}
                  </Badge>
                  <h2 className="text-3xl font-bold mb-2">{selectedMilestone.title}</h2>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {selectedMilestone.location}
                  </p>
                </div>
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none mb-6">
                <p className="text-lg leading-relaxed">
                  {selectedMilestone.longDescription || selectedMilestone.description}
                </p>
              </div>

              {selectedMilestone.achievements && selectedMilestone.achievements.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Achievements</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMilestone.achievements.map((achievement, idx) => (
                      <Badge key={idx} variant="secondary" className="text-sm">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedMilestone.photos && selectedMilestone.photos.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Photos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedMilestone.photos.map((photo, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={photo.url}
                          alt={photo.alt}
                          fill
                          className="object-cover"
                        />
                        {photo.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2">
                            {photo.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedMilestone.tags && selectedMilestone.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMilestone.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

