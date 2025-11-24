'use client'

import { motion } from 'framer-motion'
import { Heart, MapPin, GraduationCap, Code, Rocket, Sparkles, Camera, Award, Coffee, Book, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePageImages } from '@/hooks/use-page-cms'

const timeline = [
  {
    year: '2004',
    location: 'Guinea, West Africa',
    title: 'Born in Guinea',
    description: 'Started my journey in Conakry, Guinea, where I was born and spent my early childhood.',
    icon: MapPin,
  },
  {
    year: '2010s',
    location: 'New York City, USA',
    title: 'Moved to NYC',
    description: 'Moved to New York City with my family. Faced early challenges with language barriers and bullying.',
    icon: Heart,
  },
  {
    year: '2010s',
    location: 'New York City, USA',
    title: 'Learning Through Cartoons',
    description: 'Learned English in just 3 months by watching cartoons like Dora the Explorer. This experience taught me resilience and creative problem-solving.',
    icon: Book,
  },
  {
    year: '2020s',
    location: 'Norfolk, Virginia',
    title: 'Pursuing Computer Science',
    description: 'Started studying Computer Science at Old Dominion University, focusing on full-stack development and AI.',
    icon: GraduationCap,
  },
  {
    year: '2023-2024',
    location: 'Norfolk, Virginia',
    title: 'Building SaaS Products',
    description: 'Designed and shipped multiple AI-powered SaaS products from prototypes to live platforms with real users.',
    icon: Code,
  },
  {
    year: '2025',
    location: 'Norfolk, Virginia',
    title: 'Full Stack Developer',
    description: '20-year-old Full Stack Developer specializing in AI-powered web applications, available for freelance, partnerships, and full-time roles.',
    icon: Rocket,
  },
]

const skills = [
  { name: 'Frontend Development', level: 95, icon: Code },
  { name: 'Backend Development', level: 90, icon: Code },
  { name: 'AI Integration', level: 85, icon: Rocket },
  { name: 'UI/UX Design', level: 80, icon: Award },
]

const interests = [
  { name: 'Building SaaS Products', icon: Rocket },
  { name: 'AI & Machine Learning', icon: Sparkles },
  { name: 'Open Source', icon: Code },
  { name: 'Photography', icon: Camera },
  { name: 'Reading Tech Blogs', icon: Book },
  { name: 'Coffee & Coding', icon: Coffee },
]

export default function AboutPageContent() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Fallback images - used when CMS has no active images
  const fallbackPhotos = [
    { src: '/images/about/guinea.jpg', alt: 'Guinea, West Africa', caption: 'Guinea, West Africa' },
    { src: '/images/about/nyc.jpg', alt: 'New York City', caption: 'New York City' },
    { src: '/images/about/norfolk.jpg', alt: 'Norfolk, Virginia', caption: 'Norfolk, Virginia' },
    { src: '/images/about/coding.jpg', alt: 'Coding', caption: 'Building Applications' },
  ]

  // Fetch gallery images from CMS with fallback
  const { images: photos, isLoading: imagesLoading } = usePageImages('about', 'gallery', fallbackPhotos)

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          About Me
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          From Guinea to Norfolk, from cartoons to code — the journey continues...
        </p>
      </motion.div>

      {/* Main Story */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="glass rounded-2xl p-8 md:p-12 mb-16"
      >
        <div className="flex items-center gap-2 mb-6">
          <Heart className="text-primary" size={24} />
          <h2 className="text-3xl md:text-4xl font-bold">My Story</h2>
        </div>

        <div className="space-y-6 text-lg text-foreground/80 leading-relaxed">
          <p>
            <strong className="text-primary">Born in Guinea</strong>, raised in NYC, now building in Norfolk,
            Virginia. My journey has been one of resilience, adaptation, and continuous learning.
          </p>

          <p>
            When I first moved to New York City, I faced significant challenges. Language barriers and early
            bullying could have been setbacks, but instead, they became catalysts for growth. I learned English
            in just <strong className="text-primary">3 months</strong> by watching cartoons like Dora the Explorer
            — a testament to my determination and creative problem-solving approach.
          </p>

          <p>
            Today, I'm a <strong className="text-primary">20-year-old Full Stack Developer</strong> at Old Dominion
            University, specializing in AI-powered web applications. I design and ship SaaS products from prototypes
            to live platforms with real users. My work combines technical expertise with creative problem-solving,
            always focused on building solutions that make a real impact.
          </p>

          <p>
            I'm passionate about using technology to solve real-world problems and create meaningful experiences.
            Whether it's building educational platforms, interview prep tools, or content generators, I love
            crafting applications that make a difference.
          </p>

          <p>
            Available for <strong className="text-primary">freelance, partnerships, and full-time roles</strong>.
            Let's build something amazing together!
          </p>
        </div>
      </motion.section>

      {/* Timeline */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mb-16"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">My Journey</h2>
          <Link
            href="/timeline"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View Full Timeline
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 transform md:-translate-x-1/2" />

          <div className="space-y-12">
            {timeline.map((milestone, index) => {
              const Icon = milestone.icon
              const isEven = index % 2 === 0
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex items-center gap-6 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="relative z-10 flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 border-4 border-primary flex items-center justify-center">
                    <Icon className="text-primary" size={24} />
                  </div>

                  {/* Content Card */}
                  <div className={`flex-1 glass rounded-xl p-6 ${isEven ? 'md:mr-auto md:max-w-md' : 'md:ml-auto md:max-w-md'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-primary font-bold text-lg">{milestone.year}</span>
                      <span className="text-muted-foreground text-sm">•</span>
                      <span className="text-muted-foreground text-sm">{milestone.location}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                    <p className="text-foreground/70">{milestone.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.section>

      {/* Skills */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="glass rounded-2xl p-8 md:p-12 mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Skills & Expertise</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {skills.map((skill, index) => {
            const Icon = skill.icon
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="text-primary" size={20} />
                    <span className="font-semibold">{skill.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    className="bg-primary h-2 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      {/* Photo Gallery */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Photo Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => setSelectedImage(photo.src)}
            >
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Camera className="text-muted-foreground" size={32} />
              </div>
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity">
                {photo.caption}
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Click on any photo to view full size (coming soon)
        </p>
      </motion.section>

      {/* Interests */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="glass rounded-2xl p-8 md:p-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Interests & Hobbies</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {interests.map((interest, index) => {
            const Icon = interest.icon
            return (
              <motion.div
                key={interest.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Icon className="text-primary" size={32} />
                <span className="text-sm font-medium text-center">{interest.name}</span>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Camera className="text-muted-foreground" size={64} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

