/**
 * Client logos and showcase data
 * Add client logos with permission
 */

export interface Client {
  name: string
  logo: string
  website?: string
  description?: string
  project?: string
  year?: string
}

export const clients: Client[] = [
  {
    name: 'Humanora Consulting',
    logo: '/images/clients/humanora-logo.png', // You'll need to add this logo
    website: 'https://www.humanoraconsulting.com',
    description: 'AI-powered interview prep platform - Full Stack Developer & Lead Developer',
    project: 'InterviewPrep AI (Sold & Ongoing Development)',
    year: '2024-2025',
  },
]

