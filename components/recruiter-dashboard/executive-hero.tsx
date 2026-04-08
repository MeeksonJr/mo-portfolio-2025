import { Download, Mail, ChevronRight, Briefcase, Award } from 'lucide-react'
import { resumeData } from '@/lib/resume-data'

export default function ExecutiveHero() {
  return (
    <div className="w-full bg-slate-900 dark:bg-slate-950 text-white rounded-3xl p-8 md:p-12 overflow-hidden relative shadow-2xl">
      {/* Abstract Background Design */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-slate-800/50 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-40 w-80 h-80 rounded-full bg-indigo-900/20 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold tracking-wide uppercase text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Extremely Responsive
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Hi, I'm Mohamed Datt.
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-lg">
            I'm a Full-Stack Software Engineer currently at Old Dominion University, bringing modern design, robust system architectures, and AI orchestration to real-world applications.
          </p>
          
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a href="/Datt_Mohamed_Resume.pdf" download className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-colors shadow-lg">
              <Download className="w-4 h-4" />
              Download Resume
            </a>
            <a href={`mailto:${resumeData.personal.email}`} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-white border border-slate-700 font-bold rounded-lg hover:bg-slate-700 transition-colors">
              <Mail className="w-4 h-4" />
              Contact Direct
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-6 rounded-2xl">
            <Briefcase className="w-8 h-8 text-indigo-400 mb-4" />
            <h3 className="font-bold text-lg mb-1">Clearances</h3>
            <p className="text-sm text-slate-400">Eligible for U.S. Security Clearances. U.S. Citizen.</p>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-6 rounded-2xl">
            <Award className="w-8 h-8 text-amber-400 mb-4" />
            <h3 className="font-bold text-lg mb-1">Timeline</h3>
            <p className="text-sm text-slate-400">Internship/Co-Op Ready: Summer 2026. Full-Time: Fall 2027.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
