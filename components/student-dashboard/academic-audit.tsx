import { FileText, CheckCircle2, TrendingUp, Award, School } from 'lucide-react'

export default function AcademicAudit() {
  const stats = [
    { label: 'Total Credits', value: '84', icon: TrendingUp },
    { label: 'Transfer Hours (TCC)', value: '62', icon: School },
    { label: 'Overall GPA', value: '2.66', icon: Award },
    { label: 'Degree Progress', value: '70%', icon: CheckCircle2 },
  ]

  const coreCompleted = [
    { code: 'CS 330', name: 'Object-Oriented Design/Program', grade: 'A' },
    { code: 'MATH 212', name: 'Calculus II', grade: 'B' },
    { code: 'CS 270', name: 'Intro Computer Architecture II', grade: 'C' },
    { code: 'CS 315', name: 'Comp Sci Undergrad Colloquium', grade: 'A' },
    { code: 'CHEM 123N', name: 'Foundations of Chem II', grade: 'C' },
    { code: 'CS 260', name: 'C++ For Programmers', grade: 'B' },
  ]

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center gap-3 border-b border-primary/20 pb-4">
        <FileText className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold tracking-tight">Academic Audit & Transfer History</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between h-28 hover:border-primary/40 transition-colors">
              <div className="flex items-center text-muted-foreground gap-2">
                <Icon className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">{stat.label}</span>
              </div>
              <div className="text-3xl font-black text-foreground">{stat.value}</div>
            </div>
          )
        })}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4">Core Competencies Verified</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {coreCompleted.map((course, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-muted/30 border border-border rounded-lg">
              <div>
                <div className="text-xs font-mono font-bold text-primary mb-1">{course.code}</div>
                <div className="text-sm font-medium leading-snug truncate max-w-[160px]" title={course.name}>
                  {course.name}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center w-10 h-10 rounded-full bg-background border border-border flex-shrink-0">
                <span className="text-sm font-bold">{course.grade}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary p-6 rounded-r-xl mt-8">
        <h4 className="font-bold text-lg mb-2">The ODU Transition</h4>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Successfully transferred 62 credit hours from Tidewater Community College (A.S. Computer Science) with Dean's List honors (3.8 GPA). Currently pursuing B.S. in Computer Science at Old Dominion University, demonstrating a strong foundation in calculus, chemistry, and low-level architecture, while rapidly advancing through upper-division software engineering coursework.
        </p>
      </div>

    </div>
  )
}
