import { resumeData } from '@/lib/resume-data'
import { Code, Server, Wrench, Trophy } from 'lucide-react'

export default function SkillsMatrix() {
  const { skills } = resumeData

  return (
    <div className="w-full space-y-12">
      <div className="text-center md:text-left mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Technical Competencies</h2>
        <p className="text-muted-foreground">Categorized mapping of languages, frameworks, and deployment technologies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <SkillCategory 
          title="Languages" 
          icon={Code} 
          skills={skills.languages || []} 
          colorClass="text-blue-500 bg-blue-500/10 border-blue-500/20" 
        />
        <SkillCategory 
          title="Frameworks & Web" 
          icon={Server} 
          skills={[...skills.frontend, ...skills.backend]} 
          colorClass="text-emerald-500 bg-emerald-500/10 border-emerald-500/20" 
        />
        <SkillCategory 
          title="Tools & AI" 
          icon={Wrench} 
          skills={[...skills.tools, ...skills.ai]} 
          colorClass="text-purple-500 bg-purple-500/10 border-purple-500/20" 
        />
      </div>

      <div className="mt-12 p-8 bg-card border border-border shadow-sm rounded-2xl">
        <div className="flex items-center gap-3 mb-6 border-b border-muted pb-4">
          <Trophy className="w-6 h-6 text-amber-500" />
          <h3 className="text-xl font-bold tracking-tight">Awards & Recognition</h3>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-foreground">1st Place - Internship Coding Competition</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Developed an AI-automated Python system integrating the Canvas API, increasing efficiency by 34% within 48 hours.
              </p>
            </div>
            <span className="text-sm font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full whitespace-nowrap">
              Old Dominion University
            </span>
          </div>
          <div className="flex justify-between items-start pt-4 border-t border-muted/50">
            <div>
              <h4 className="font-bold text-foreground">Dean's List</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Maintained a 3.8 GPA in the Associate's of Computer Science program.
              </p>
            </div>
            <span className="text-sm font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full whitespace-nowrap">
              Tidewater Community College
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SkillCategory({ title, icon: Icon, skills, colorClass }: any) {
  return (
    <div className="space-y-4">
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${colorClass}`}>
        <Icon className="w-5 h-5" />
        <h3 className="font-bold">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill: string) => (
          <span 
            key={skill}
            className="px-3 py-1.5 bg-muted/50 hover:bg-muted border border-border rounded-lg text-sm font-medium transition-colors"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}
