/**
 * Resume data structure for dynamic resume generation
 * This data is used to generate resumes in multiple formats
 */

export interface ResumeData {
  personal: {
    name: string
    title: string
    email: string
    phone?: string
    location: string
    website?: string
    github: string
    linkedin: string
    summary: string
  }
  experience: Array<{
    role: string
    company: string
    location?: string
    startDate: string
    endDate: string | 'Present'
    description: string[]
    achievements?: string[]
    technologies?: string[]
  }>
  education: Array<{
    degree: string
    school: string
    location: string
    startDate: string
    endDate: string | 'Present'
    gpa?: string
    achievements?: string[]
    relevantCourses?: string[]
  }>
  skills: {
    frontend: string[]
    backend: string[]
    ai: string[]
    tools: string[]
    languages?: string[]
  }
  projects: Array<{
    name: string
    description: string
    technologies: string[]
    url?: string
    github?: string
    highlights?: string[]
  }>
  certifications?: Array<{
    name: string
    issuer: string
    date: string
    url?: string
  }>
  languages?: Array<{
    name: string
    proficiency: string
  }>
}

export const resumeData: ResumeData = {
  personal: {
    name: 'Mohamed Datt',
    title: 'Full Stack Developer',
    email: 'd.mohamed1504@gmail.com',
    phone: '+1 518-704-9000',
    location: 'Norfolk, Virginia, USA',
    website: 'https://mohameddatt.com',
    github: 'https://github.com/MeeksonJr',
    linkedin: 'https://www.linkedin.com/in/mohamed-datt-b60907296',
    summary: 'Full Stack Developer specializing in AI-powered web applications. Built and shipped multiple SaaS products from prototypes to live platforms. Winner of 1st place in competitive internship program. Passionate about creating innovative solutions using modern technologies.',
  },
  experience: [
    {
      role: 'Software Developer Intern',
      company: 'Product Manager Accelerator',
      location: 'Norfolk, VA',
      startDate: 'Sep 2024',
      endDate: 'Dec 2024',
      description: [
        'Developed full-stack SaaS application using TypeScript, React, and AI integrations',
        'Collaborated with team of 13 developers to deliver production-ready application',
        'Implemented AI-powered features using Gemini and Hugging Face APIs',
        'Designed and developed responsive user interfaces with TailwindCSS',
      ],
      achievements: [
        'Won 1st place out of 13 teams for best final app',
        'Delivered project ahead of schedule with high code quality',
      ],
      technologies: ['TypeScript', 'React', 'Next.js', 'Supabase', 'Gemini', 'Hugging Face', 'TailwindCSS'],
    },
  ],
  education: [
    {
      degree: 'B.S. in Computer Science',
      school: 'Old Dominion University',
      location: 'Norfolk, VA',
      startDate: 'Jan 2025',
      endDate: 'Present',
      relevantCourses: [
        'Data Structures & Algorithms',
        'Computer Architecture',
        'Database Systems',
        'Software Engineering',
        'Linear Algebra',
        'Discrete Mathematics',
        'C++ Programming',
        'Operating Systems',
      ],
    },
    {
      degree: 'A.S. in Computer Science',
      school: 'Tidewater Community College',
      location: 'Norfolk, VA',
      startDate: 'Sep 2022',
      endDate: 'Dec 2024',
      gpa: '3.8',
      achievements: [
        "Dean's List",
        '1st Place Internship Competition (Fall 2024)',
      ],
      relevantCourses: [
        'Object Oriented Programming (OOP)',
        'Data Structures and Algorithms',
        'Engineering Design',
      ],
    },
  ],
  skills: {
    frontend: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Framer Motion', 'Vite'],
    backend: ['Node.js', 'Supabase', 'PostgreSQL', 'MongoDB', 'Firebase', 'REST APIs', 'GraphQL'],
    ai: ['Gemini 2.0', 'Groq', 'Hugging Face', 'OpenAI API', 'AI Integration'],
    tools: ['Git/GitHub', 'Vercel', 'VS Code', 'Docker', 'CI/CD', 'AWS'],
    languages: ['JavaScript', 'TypeScript', 'Python', 'C++', 'SQL'],
  },
  projects: [
    {
      name: 'EduSphere AI',
      description: 'AI-powered student dashboard with assignment assistance, blog generation, and calendar integration',
      technologies: ['Next.js', 'Supabase', 'Gemini', 'Hugging Face', 'TailwindCSS', 'PayPal'],
      github: 'https://github.com/MeeksonJr/edusphere-ai',
      highlights: [
        'AI assistant for homework and assignments',
        'Multi-platform content generation',
        'Subscription-based monetization',
      ],
    },
    {
      name: 'InterviewPrep AI',
      description: 'AI-driven interview preparation platform with voice and text mock interviews',
      technologies: ['Next.js', 'PostgreSQL', 'Gemini', 'Firebase', 'PayPal', 'Vapi Voice'],
      github: 'https://github.com/MeeksonJr/interview-prep',
      highlights: [
        'Voice-based mock interviews',
        'Resume analysis and feedback',
        'Job matching algorithm',
        'Sold to private client',
      ],
    },
    {
      name: 'AI Content Generator',
      description: 'Advanced SaaS platform for content generation with sentiment analysis and analytics',
      technologies: ['Next.js 14', 'Supabase', 'Gemini', 'Hugging Face', 'Recharts'],
      github: 'https://github.com/MeeksonJr/content-generator',
      highlights: [
        'Blog, social media, and product content generation',
        'Sentiment analysis',
        'Comprehensive analytics dashboard',
      ],
    },
    {
      name: 'SnapFind',
      description: 'Image analysis and search tool using advanced AI models',
      technologies: ['Next.js', 'Gemini Vision', 'Hugging Face'],
      github: 'https://github.com/MeeksonJr/snapfind',
      highlights: [
        'Advanced image analysis',
        'Object detection',
        'Multi-model AI processing',
      ],
    },
  ],
  certifications: [],
  languages: [
    { name: 'English', proficiency: 'Native' },
    { name: 'French', proficiency: 'Conversational' },
  ],
}

