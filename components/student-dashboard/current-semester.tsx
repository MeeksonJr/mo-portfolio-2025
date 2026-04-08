import { BookOpen, CalendarClock, GraduationCap, Clock, AlertCircle } from 'lucide-react'

export default function CurrentSemester() {
  const courses = [
    { code: 'CS 350', name: 'Intro to Software Engineering', status: 'In Progress', term: 'Spring 2026' },
    { code: 'CS 417', name: 'Computational Methods & Software', status: 'In Progress', term: 'Spring 2026' },
    { code: 'CS 418', name: 'Web Programming', status: 'In Progress', term: 'Spring 2026' },
    { code: 'STAT 330', name: 'Intro to Probability & Statistics', status: 'In Progress', term: 'Spring 2026' },
    { code: 'CS 361', name: 'Data Structures & Algorithms', status: 'Planned', term: 'Summer 2026' },
  ]

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/20 pb-6">
        <div className="flex items-center gap-3">
          <CalendarClock className="w-6 h-6 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight">Active Academic Term</h2>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20 text-sm font-medium">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
          </span>
          Spring 2026 In Session
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, idx) => (
          <div 
            key={idx} 
            className={`flex flex-col justify-between p-6 rounded-2xl border ${
              course.status === 'In Progress' 
                ? 'bg-card border-primary/30 shadow-sm' 
                : 'bg-muted/50 border-border border-dashed'
            } transition-all hover:border-primary/50`}
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <span className="px-2.5 py-1 text-xs font-bold font-mono rounded bg-secondary text-secondary-foreground">
                  {course.code}
                </span>
                {course.status === 'In Progress' ? (
                  <Clock className="w-4 h-4 text-primary animate-pulse" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <h3 className="text-lg font-bold leading-tight mb-2">{course.name}</h3>
            </div>
            
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border mt-auto">
              <span className="text-sm font-medium text-muted-foreground">
                {course.term}
              </span>
              <span className={`text-xs font-bold uppercase tracking-wider ${
                course.status === 'In Progress' ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {course.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Advisor Note Section based on Transcript Parsing */}
      <div className="mt-8 p-5 bg-card/50 border border-primary/10 rounded-xl flex items-start gap-4">
        <GraduationCap className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-foreground mb-1">Academic Advisor Note</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            "I requested that CSC 208 is updated to reflect the correct equivalency of CS 381, and it has been updated. You can now register for CS 390 or 402. I will wait for you to send the syllabus for CSC 223 for reevaluation for CS 361." — Tania Black.
          </p>
        </div>
      </div>
    </div>
  )
}
