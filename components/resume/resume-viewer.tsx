'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Award, GraduationCap, Briefcase, Code, Rocket } from 'lucide-react'
import { format } from 'date-fns'

type ResumeFormat = 'ats' | 'creative' | 'traditional'

interface ResumeViewerProps {
  data: any
  format: ResumeFormat
}

export default function ResumeViewer({ data, format }: ResumeViewerProps) {
  const { personal, experience, education, skills, projects, languages } = data

  if (format === 'ats') {
    return <ATSResume data={data} />
  } else if (format === 'creative') {
    return <CreativeResume data={data} />
  } else {
    return <TraditionalResume data={data} />
  }
}

function ATSResume({ data }: { data: any }) {
  const { personal, experience, education, skills, projects } = data

  return (
    <Card className="p-8 max-w-4xl mx-auto bg-white text-black print:shadow-none">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{personal.name}</h1>
        <p className="text-lg text-gray-700 mb-4">{personal.title}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Mail className="h-4 w-4" />
            {personal.email}
          </div>
          {personal.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {personal.phone}
            </div>
          )}
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {personal.location}
          </div>
          <div className="flex items-center gap-1">
            <Github className="h-4 w-4" />
            {personal.github.replace('https://', '')}
          </div>
          <div className="flex items-center gap-1">
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Summary */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2 uppercase">Professional Summary</h2>
        <p className="text-gray-700 leading-relaxed">{personal.summary}</p>
      </div>

      <Separator className="my-6" />

      {/* Experience */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4 uppercase">Professional Experience</h2>
        {experience.map((exp: any, idx: number) => (
          <div key={idx} className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-lg">{exp.role}</h3>
                <p className="text-gray-700">{exp.company} {exp.location && `• ${exp.location}`}</p>
              </div>
              <p className="text-gray-600 text-sm">
                {exp.startDate} - {exp.endDate}
              </p>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              {exp.description.map((desc: string, i: number) => (
                <li key={i}>{desc}</li>
              ))}
            </ul>
            {exp.achievements && exp.achievements.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold text-sm text-gray-700">Key Achievements:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  {exp.achievements.map((ach: string, i: number) => (
                    <li key={i}>{ach}</li>
                  ))}
                </ul>
              </div>
            )}
            {exp.technologies && (
              <div className="mt-2 flex flex-wrap gap-1">
                {exp.technologies.map((tech: string, i: number) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Separator className="my-6" />

      {/* Education */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4 uppercase">Education</h2>
        {education.map((edu: any, idx: number) => (
          <div key={idx} className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-lg">{edu.degree}</h3>
                <p className="text-gray-700">{edu.school} • {edu.location}</p>
                {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
              </div>
              <p className="text-gray-600 text-sm">
                {edu.startDate} - {edu.endDate}
              </p>
            </div>
            {edu.achievements && edu.achievements.length > 0 && (
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                {edu.achievements.map((ach: string, i: number) => (
                  <li key={i}>{ach}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <Separator className="my-6" />

      {/* Skills */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4 uppercase">Technical Skills</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold mb-2">Frontend:</p>
            <p className="text-gray-700">{skills.frontend.join(', ')}</p>
          </div>
          <div>
            <p className="font-semibold mb-2">Backend:</p>
            <p className="text-gray-700">{skills.backend.join(', ')}</p>
          </div>
          <div>
            <p className="font-semibold mb-2">AI Tools:</p>
            <p className="text-gray-700">{skills.ai.join(', ')}</p>
          </div>
          <div>
            <p className="font-semibold mb-2">Tools:</p>
            <p className="text-gray-700">{skills.tools.join(', ')}</p>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Projects */}
      <div>
        <h2 className="text-xl font-bold mb-4 uppercase">Key Projects</h2>
        {projects.slice(0, 3).map((project: any, idx: number) => (
          <div key={idx} className="mb-4">
            <h3 className="font-bold text-lg">{project.name}</h3>
            <p className="text-gray-700 mb-2">{project.description}</p>
            <div className="flex flex-wrap gap-1">
              {project.technologies.map((tech: string, i: number) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function CreativeResume({ data }: { data: any }) {
  const { personal, experience, education, skills, projects } = data

  return (
    <Card className="p-8 max-w-4xl mx-auto bg-gradient-to-br from-primary/5 via-background to-purple-500/5 border-2 border-primary/20">
      {/* Header with gradient */}
      <div className="mb-8 pb-6 border-b-2 border-primary/20">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          {personal.name}
        </h1>
        <p className="text-xl text-muted-foreground mb-4">{personal.title}</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            {personal.email}
          </div>
          {personal.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {personal.phone}
            </div>
          )}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            {personal.location}
          </div>
          <div className="flex items-center gap-2">
            <Github className="h-4 w-4 text-primary" />
            GitHub
          </div>
          <div className="flex items-center gap-2">
            <Linkedin className="h-4 w-4 text-primary" />
            LinkedIn
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
          <Rocket className="h-5 w-5 text-primary" />
          About
        </h2>
        <p className="text-muted-foreground leading-relaxed">{personal.summary}</p>
      </div>

      {/* Experience */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          Experience
        </h2>
        {experience.map((exp: any, idx: number) => (
          <div key={idx} className="mb-6 p-4 glass rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-xl">{exp.role}</h3>
                <p className="text-muted-foreground">{exp.company} {exp.location && `• ${exp.location}`}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {exp.startDate} - {exp.endDate}
              </Badge>
            </div>
            <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground">
              {exp.description.map((desc: string, i: number) => (
                <li key={i}>{desc}</li>
              ))}
            </ul>
            {exp.achievements && exp.achievements.length > 0 && (
              <div className="mt-3 p-3 bg-primary/10 rounded-lg">
                <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  Achievements:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  {exp.achievements.map((ach: string, i: number) => (
                    <li key={i}>{ach}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-1">
              {exp.technologies?.map((tech: string, i: number) => (
                <Badge key={i} className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          Education
        </h2>
        {education.map((edu: any, idx: number) => (
          <div key={idx} className="mb-4 p-4 glass rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-lg">{edu.degree}</h3>
                <p className="text-muted-foreground">{edu.school} • {edu.location}</p>
                {edu.gpa && <p className="text-sm text-primary font-semibold">GPA: {edu.gpa}</p>}
              </div>
              <Badge variant="outline" className="text-xs">
                {edu.startDate} - {edu.endDate}
              </Badge>
            </div>
            {edu.achievements && edu.achievements.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {edu.achievements.map((ach: string, i: number) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {ach}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Code className="h-5 w-5 text-primary" />
          Skills
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(skills).map(([category, items]: [string, any]) => (
            <div key={category} className="p-4 glass rounded-lg">
              <p className="font-semibold mb-2 capitalize">{category}:</p>
              <div className="flex flex-wrap gap-1">
                {items.map((item: string, i: number) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Rocket className="h-5 w-5 text-primary" />
          Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.slice(0, 4).map((project: any, idx: number) => (
            <div key={idx} className="p-4 glass rounded-lg">
              <h3 className="font-bold text-lg mb-2">{project.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-1">
                {project.technologies.map((tech: string, i: number) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function TraditionalResume({ data }: { data: any }) {
  const { personal, experience, education, skills, projects } = data

  return (
    <Card className="p-8 max-w-4xl mx-auto bg-white text-black border border-gray-300">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b border-gray-300">
        <h1 className="text-3xl font-bold mb-2">{personal.name}</h1>
        <p className="text-lg text-gray-600 mb-4">{personal.title}</p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <span>{personal.email}</span>
          {personal.phone && <span>•</span>}
          {personal.phone && <span>{personal.phone}</span>}
          <span>•</span>
          <span>{personal.location}</span>
          <span>•</span>
          <span>{personal.github.replace('https://', '')}</span>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2 uppercase tracking-wide">Professional Summary</h2>
        <p className="text-gray-700 leading-relaxed">{personal.summary}</p>
      </div>

      {/* Experience */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 uppercase tracking-wide">Professional Experience</h2>
        {experience.map((exp: any, idx: number) => (
          <div key={idx} className="mb-4">
            <div className="flex justify-between items-start mb-1">
              <div>
                <h3 className="font-bold">{exp.role}</h3>
                <p className="text-gray-600 text-sm">{exp.company} {exp.location && `| ${exp.location}`}</p>
              </div>
              <p className="text-gray-600 text-sm italic">
                {exp.startDate} - {exp.endDate}
              </p>
            </div>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-4">
              {exp.description.map((desc: string, i: number) => (
                <li key={i}>{desc}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 uppercase tracking-wide">Education</h2>
        {education.map((edu: any, idx: number) => (
          <div key={idx} className="mb-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">{edu.degree}</h3>
                <p className="text-gray-600 text-sm">{edu.school} | {edu.location}</p>
                {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
              </div>
              <p className="text-gray-600 text-sm italic">
                {edu.startDate} - {edu.endDate}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 uppercase tracking-wide">Technical Skills</h2>
        <div className="text-gray-700 text-sm">
          <p><strong>Frontend:</strong> {skills.frontend.join(', ')}</p>
          <p><strong>Backend:</strong> {skills.backend.join(', ')}</p>
          <p><strong>AI Tools:</strong> {skills.ai.join(', ')}</p>
          <p><strong>Tools:</strong> {skills.tools.join(', ')}</p>
        </div>
      </div>

      {/* Projects */}
      <div>
        <h2 className="text-lg font-bold mb-3 uppercase tracking-wide">Selected Projects</h2>
        {projects.slice(0, 3).map((project: any, idx: number) => (
          <div key={idx} className="mb-3">
            <h3 className="font-bold">{project.name}</h3>
            <p className="text-gray-700 text-sm mb-1">{project.description}</p>
            <p className="text-gray-600 text-xs italic">{project.technologies.join(', ')}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

