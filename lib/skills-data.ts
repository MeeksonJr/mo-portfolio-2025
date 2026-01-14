/**
 * Enhanced skills data with proficiency levels and years of experience
 */

export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'

export interface SkillDetail {
  name: string
  proficiency: ProficiencyLevel
  yearsOfExperience: number
  category: 'frontend' | 'backend' | 'ai' | 'tools' | 'languages' | 'design'
}

export const skillProficiencyMap: Record<ProficiencyLevel, number> = {
  Beginner: 25,
  Intermediate: 50,
  Advanced: 75,
  Expert: 95,
}

export const skillsData: SkillDetail[] = [
  // Frontend
  { name: 'React', proficiency: 'Expert', yearsOfExperience: 3, category: 'frontend' },
  { name: 'Next.js', proficiency: 'Expert', yearsOfExperience: 3, category: 'frontend' },
  { name: 'TypeScript', proficiency: 'Advanced', yearsOfExperience: 3, category: 'frontend' },
  { name: 'TailwindCSS', proficiency: 'Expert', yearsOfExperience: 3, category: 'frontend' },
  { name: 'Framer Motion', proficiency: 'Advanced', yearsOfExperience: 2, category: 'frontend' },
  { name: 'Vite', proficiency: 'Advanced', yearsOfExperience: 2, category: 'frontend' },
  { name: 'HTML/CSS', proficiency: 'Expert', yearsOfExperience: 4, category: 'frontend' },
  { name: 'JavaScript', proficiency: 'Expert', yearsOfExperience: 4, category: 'frontend' },
  
  // Backend
  { name: 'Node.js', proficiency: 'Advanced', yearsOfExperience: 3, category: 'backend' },
  { name: 'Supabase', proficiency: 'Advanced', yearsOfExperience: 2, category: 'backend' },
  { name: 'PostgreSQL', proficiency: 'Intermediate', yearsOfExperience: 2, category: 'backend' },
  { name: 'MongoDB', proficiency: 'Intermediate', yearsOfExperience: 1, category: 'backend' },
  { name: 'Firebase', proficiency: 'Advanced', yearsOfExperience: 2, category: 'backend' },
  { name: 'REST APIs', proficiency: 'Advanced', yearsOfExperience: 3, category: 'backend' },
  { name: 'GraphQL', proficiency: 'Intermediate', yearsOfExperience: 1, category: 'backend' },
  
  // AI
  { name: 'Gemini 2.0', proficiency: 'Advanced', yearsOfExperience: 2, category: 'ai' },
  { name: 'Groq', proficiency: 'Intermediate', yearsOfExperience: 1, category: 'ai' },
  { name: 'Hugging Face', proficiency: 'Advanced', yearsOfExperience: 2, category: 'ai' },
  { name: 'OpenAI API', proficiency: 'Advanced', yearsOfExperience: 2, category: 'ai' },
  { name: 'AI Integration', proficiency: 'Advanced', yearsOfExperience: 2, category: 'ai' },
  
  // Tools
  { name: 'Git/GitHub', proficiency: 'Expert', yearsOfExperience: 4, category: 'tools' },
  { name: 'Vercel', proficiency: 'Expert', yearsOfExperience: 3, category: 'tools' },
  { name: 'VS Code', proficiency: 'Expert', yearsOfExperience: 4, category: 'tools' },
  { name: 'Docker', proficiency: 'Intermediate', yearsOfExperience: 1, category: 'tools' },
  { name: 'CI/CD', proficiency: 'Intermediate', yearsOfExperience: 2, category: 'tools' },
  { name: 'AWS', proficiency: 'Intermediate', yearsOfExperience: 1, category: 'tools' },
  
  // Languages
  { name: 'JavaScript', proficiency: 'Expert', yearsOfExperience: 4, category: 'languages' },
  { name: 'TypeScript', proficiency: 'Advanced', yearsOfExperience: 3, category: 'languages' },
  { name: 'Python', proficiency: 'Intermediate', yearsOfExperience: 2, category: 'languages' },
  { name: 'C++', proficiency: 'Intermediate', yearsOfExperience: 2, category: 'languages' },
  { name: 'SQL', proficiency: 'Advanced', yearsOfExperience: 2, category: 'languages' },
  
  // Design
  { name: 'UI/UX Design', proficiency: 'Advanced', yearsOfExperience: 3, category: 'design' },
  { name: 'Figma', proficiency: 'Intermediate', yearsOfExperience: 1, category: 'design' },
]

export const skillsByCategory = {
  frontend: skillsData.filter(s => s.category === 'frontend'),
  backend: skillsData.filter(s => s.category === 'backend'),
  ai: skillsData.filter(s => s.category === 'ai'),
  tools: skillsData.filter(s => s.category === 'tools'),
  languages: skillsData.filter(s => s.category === 'languages'),
  design: skillsData.filter(s => s.category === 'design'),
}

export function getProficiencyLevel(proficiency: ProficiencyLevel): number {
  return skillProficiencyMap[proficiency]
}

export function getProficiencyColor(proficiency: ProficiencyLevel): string {
  switch (proficiency) {
    case 'Beginner':
      return 'bg-blue-500'
    case 'Intermediate':
      return 'bg-green-500'
    case 'Advanced':
      return 'bg-yellow-500'
    case 'Expert':
      return 'bg-purple-500'
    default:
      return 'bg-gray-500'
  }
}

export function getProficiencyBadgeColor(proficiency: ProficiencyLevel): string {
  switch (proficiency) {
    case 'Beginner':
      return 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30'
    case 'Intermediate':
      return 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30'
    case 'Advanced':
      return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30'
    case 'Expert':
      return 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30'
    default:
      return 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30'
  }
}

