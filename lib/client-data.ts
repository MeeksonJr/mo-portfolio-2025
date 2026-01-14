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
  // Add your clients here with their logos
  // Example:
  // {
  //   name: 'Client Name',
  //   logo: '/images/clients/client-logo.png',
  //   website: 'https://client-website.com',
  //   description: 'Worked on X project',
  //   project: 'Project Name',
  //   year: '2024',
  // },
]

