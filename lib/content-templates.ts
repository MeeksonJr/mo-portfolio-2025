/**
 * Content Planning Templates
 * Pre-defined templates for different content types to streamline creation
 */

export interface ContentTemplate {
  id: string
  name: string
  description: string
  contentType: 'blog_post' | 'case_study' | 'project' | 'newsletter'
  structure: {
    sections: Array<{
      title: string
      description: string
      required: boolean
      placeholder?: string
    }>
  }
  tags: string[]
  suggestedSchedule?: {
    frequency: 'weekly' | 'bi-weekly' | 'monthly'
    bestDays: string[]
  }
}

export const CONTENT_TEMPLATES: ContentTemplate[] = [
  {
    id: 'tutorial-blog',
    name: 'Tutorial Blog Post',
    description: 'Step-by-step technical tutorial',
    contentType: 'blog_post',
    structure: {
      sections: [
        {
          title: 'Introduction',
          description: 'Brief overview and what readers will learn',
          required: true,
          placeholder: 'In this tutorial, we\'ll learn how to...',
        },
        {
          title: 'Prerequisites',
          description: 'Required knowledge or tools',
          required: false,
          placeholder: 'Before starting, make sure you have...',
        },
        {
          title: 'Step-by-Step Guide',
          description: 'Detailed instructions with code examples',
          required: true,
          placeholder: 'Step 1: ...',
        },
        {
          title: 'Common Issues & Solutions',
          description: 'Troubleshooting section',
          required: false,
          placeholder: 'If you encounter...',
        },
        {
          title: 'Conclusion',
          description: 'Summary and next steps',
          required: true,
          placeholder: 'In this tutorial, we covered...',
        },
      ],
    },
    tags: ['tutorial', 'how-to', 'technical'],
    suggestedSchedule: {
      frequency: 'bi-weekly',
      bestDays: ['Tuesday', 'Wednesday'],
    },
  },
  {
    id: 'case-study',
    name: 'Project Case Study',
    description: 'Detailed project showcase with challenges and solutions',
    contentType: 'case_study',
    structure: {
      sections: [
        {
          title: 'Project Overview',
          description: 'Brief description of the project',
          required: true,
          placeholder: 'This project was built to...',
        },
        {
          title: 'Challenge',
          description: 'Problem statement and requirements',
          required: true,
          placeholder: 'The main challenge was...',
        },
        {
          title: 'Solution',
          description: 'Approach and implementation',
          required: true,
          placeholder: 'We solved this by...',
        },
        {
          title: 'Technologies Used',
          description: 'Tech stack and tools',
          required: true,
          placeholder: 'React, Next.js, TypeScript...',
        },
        {
          title: 'Results',
          description: 'Outcomes and metrics',
          required: true,
          placeholder: 'The project achieved...',
        },
        {
          title: 'Lessons Learned',
          description: 'Key takeaways',
          required: false,
          placeholder: 'This project taught me...',
        },
      ],
    },
    tags: ['case-study', 'project', 'portfolio'],
    suggestedSchedule: {
      frequency: 'monthly',
      bestDays: ['Monday', 'Thursday'],
    },
  },
  {
    id: 'tech-deep-dive',
    name: 'Technical Deep Dive',
    description: 'In-depth exploration of a technology or concept',
    contentType: 'blog_post',
    structure: {
      sections: [
        {
          title: 'Introduction',
          description: 'What is this technology/concept?',
          required: true,
          placeholder: 'In this deep dive, we\'ll explore...',
        },
        {
          title: 'Core Concepts',
          description: 'Fundamental principles',
          required: true,
          placeholder: 'At its core, this technology...',
        },
        {
          title: 'How It Works',
          description: 'Technical explanation',
          required: true,
          placeholder: 'The architecture consists of...',
        },
        {
          title: 'Use Cases',
          description: 'Real-world applications',
          required: true,
          placeholder: 'This is particularly useful for...',
        },
        {
          title: 'Best Practices',
          description: 'Recommendations and tips',
          required: false,
          placeholder: 'When using this technology...',
        },
        {
          title: 'Conclusion',
          description: 'Summary and final thoughts',
          required: true,
          placeholder: 'In summary...',
        },
      ],
    },
    tags: ['technical', 'deep-dive', 'architecture'],
    suggestedSchedule: {
      frequency: 'monthly',
      bestDays: ['Wednesday', 'Thursday'],
    },
  },
  {
    id: 'newsletter-update',
    name: 'Newsletter Update',
    description: 'Monthly newsletter template',
    contentType: 'newsletter',
    structure: {
      sections: [
        {
          title: 'Opening Message',
          description: 'Personal greeting and introduction',
          required: true,
          placeholder: 'Hello! This month has been...',
        },
        {
          title: 'Featured Content',
          description: 'Highlight recent blog posts or projects',
          required: true,
          placeholder: 'This month, I published...',
        },
        {
          title: 'Updates & News',
          description: 'Personal or professional updates',
          required: false,
          placeholder: 'I\'m excited to share that...',
        },
        {
          title: 'Tech Insights',
          description: 'Interesting tech discoveries or learnings',
          required: false,
          placeholder: 'I recently discovered...',
        },
        {
          title: 'Call to Action',
          description: 'Engage readers with a question or request',
          required: true,
          placeholder: 'I\'d love to hear your thoughts on...',
        },
      ],
    },
    tags: ['newsletter', 'update', 'community'],
    suggestedSchedule: {
      frequency: 'monthly',
      bestDays: ['Friday'],
    },
  },
  {
    id: 'how-i-built',
    name: 'How I Built This',
    description: 'Behind-the-scenes of building a project',
    contentType: 'blog_post',
    structure: {
      sections: [
        {
          title: 'Project Introduction',
          description: 'What you built and why',
          required: true,
          placeholder: 'I recently built...',
        },
        {
          title: 'Planning Phase',
          description: 'Initial planning and decisions',
          required: true,
          placeholder: 'Before starting, I decided to...',
        },
        {
          title: 'Development Process',
          description: 'How you built it step by step',
          required: true,
          placeholder: 'I started by...',
        },
        {
          title: 'Challenges Faced',
          description: 'Problems encountered and solutions',
          required: true,
          placeholder: 'One major challenge was...',
        },
        {
          title: 'Key Learnings',
          description: 'What you learned from the project',
          required: true,
          placeholder: 'This project taught me...',
        },
        {
          title: 'Future Improvements',
          description: 'What you would do differently',
          required: false,
          placeholder: 'If I were to rebuild this...',
        },
      ],
    },
    tags: ['how-i-built', 'project', 'development'],
    suggestedSchedule: {
      frequency: 'bi-weekly',
      bestDays: ['Tuesday', 'Wednesday'],
    },
  },
]

export function getTemplateById(id: string): ContentTemplate | undefined {
  return CONTENT_TEMPLATES.find(template => template.id === id)
}

export function getTemplatesByType(contentType: ContentTemplate['contentType']): ContentTemplate[] {
  return CONTENT_TEMPLATES.filter(template => template.contentType === contentType)
}

export function getSuggestedSchedule(templateId: string): ContentTemplate['suggestedSchedule'] {
  const template = getTemplateById(templateId)
  return template?.suggestedSchedule
}

