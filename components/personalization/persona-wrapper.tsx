'use client'

import { ReactNode } from 'react'
import { usePersonalization } from '@/components/personalization/visitor-profile-provider'
import type { VisitorType } from '@/lib/visitor-profiling'

interface PersonaWrapperProps {
  /** Which personas should see this content. Omit to show to all. */
  showFor?: VisitorType[]
  /** Which personas should NOT see this content. */
  hideFor?: VisitorType[]
  /** Fallback content to show when the persona doesn't match. */
  fallback?: ReactNode
  children: ReactNode
}

/**
 * Conditionally renders children based on the active visitor persona.
 *
 * Usage:
 * ```tsx
 * // Only visible to developers and students
 * <PersonaWrapper showFor={["developer", "student"]}>
 *   <TechnicalSection />
 * </PersonaWrapper>
 *
 * // Hidden for recruiters
 * <PersonaWrapper hideFor={["recruiter"]}>
 *   <PrivateSection />
 * </PersonaWrapper>
 * ```
 */
export default function PersonaWrapper({
  showFor,
  hideFor,
  fallback = null,
  children,
}: PersonaWrapperProps) {
  const { profile } = usePersonalization()
  const currentType = profile.type as VisitorType

  // "general" persona can see everything
  if (currentType === 'general') {
    return <>{children}</>
  }

  // If the current persona is explicitly blocked, show fallback
  if (hideFor && hideFor.includes(currentType)) {
    return <>{fallback}</>
  }

  // If showFor list is given, only show for matching personas
  if (showFor && !showFor.includes(currentType)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
