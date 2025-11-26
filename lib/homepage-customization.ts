/**
 * Homepage Customization System
 * Allows users to reorder and hide/show sections on the homepage
 */

export interface HomepageSection {
  id: string
  name: string
  component: string
  visible: boolean
  order: number
}

const STORAGE_KEY = 'homepage-customization'
const DEFAULT_SECTIONS: HomepageSection[] = [
  { id: 'hero', name: 'Hero', component: 'HeroLight', visible: true, order: 0 },
  { id: 'quick-stats', name: 'Quick Stats', component: 'QuickStats', visible: true, order: 1 },
  { id: 'tech-snapshot', name: 'Tech Snapshot', component: 'TechSnapshot', visible: true, order: 2 },
  { id: 'about', name: 'About', component: 'AboutLight', visible: true, order: 3 },
  { id: 'projects', name: 'Projects', component: 'ProjectsLight', visible: true, order: 4 },
  { id: 'experience', name: 'Experience', component: 'Experience', visible: true, order: 5 },
  { id: 'services', name: 'Services & Pricing', component: 'ServicesPricing', visible: true, order: 6 },
  { id: 'courses', name: 'Courses', component: 'CoursesSection', visible: true, order: 7 },
  { id: 'contact', name: 'Contact', component: 'Contact', visible: true, order: 8 },
]

/**
 * Get customized homepage sections
 */
export function getHomepageSections(): HomepageSection[] {
  if (typeof window === 'undefined') {
    return DEFAULT_SECTIONS
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Merge with defaults to handle new sections
      const merged = [...DEFAULT_SECTIONS]
      parsed.forEach((custom: HomepageSection) => {
        const index = merged.findIndex((s) => s.id === custom.id)
        if (index !== -1) {
          merged[index] = { ...merged[index], ...custom }
        } else {
          merged.push(custom)
        }
      })
      return merged.sort((a, b) => a.order - b.order)
    }
  } catch (error) {
    console.error('Error loading homepage customization:', error)
  }

  return DEFAULT_SECTIONS
}

/**
 * Save homepage sections customization
 */
export function saveHomepageSections(sections: HomepageSection[]): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sections))
    window.dispatchEvent(new CustomEvent('homepage-customization-updated', { detail: sections }))
  } catch (error) {
    console.error('Error saving homepage customization:', error)
  }
}

/**
 * Update section visibility
 */
export function toggleSectionVisibility(sectionId: string): boolean {
  const sections = getHomepageSections()
  const section = sections.find((s) => s.id === sectionId)
  if (!section) {
    return false
  }

  section.visible = !section.visible
  saveHomepageSections(sections)
  return true
}

/**
 * Reorder sections
 */
export function reorderSections(sectionIds: string[]): boolean {
  const sections = getHomepageSections()
  const reordered: HomepageSection[] = []

  sectionIds.forEach((id, index) => {
    const section = sections.find((s) => s.id === id)
    if (section) {
      section.order = index
      reordered.push(section)
    }
  })

  // Add any sections not in the reordered list
  sections.forEach((section) => {
    if (!sectionIds.includes(section.id)) {
      reordered.push(section)
    }
  })

  saveHomepageSections(reordered.sort((a, b) => a.order - b.order))
  return true
}

/**
 * Reset to default layout
 */
export function resetHomepageLayout(): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent('homepage-customization-updated', { detail: DEFAULT_SECTIONS }))
  } catch (error) {
    console.error('Error resetting homepage layout:', error)
  }
}

