# Design System Guide

**Last Updated:** January 14, 2025  
**Status:** ✅ Complete - All Design Tokens, Components, and Patterns Documented

---

## 📚 Table of Contents

1. [Overview](#overview)
2. [Design Tokens](#design-tokens)
3. [Core Components](#core-components)
4. [Layout Components](#layout-components)
5. [Utility Components](#utility-components)
6. [Best Practices](#best-practices)
7. [Migration Guide](#migration-guide)
8. [Examples](#examples)

---

## Overview

This design system provides a consistent, accessible, and performant foundation for the portfolio application. It includes:

- **Design Tokens**: Centralized constants for spacing, typography, colors, and more
- **Layout Components**: Standardized containers and page structures
- **Utility Components**: Reusable UI components with built-in accessibility
- **Performance Optimizations**: Memoized components for optimal rendering
- **Accessibility**: ARIA attributes, keyboard navigation, and screen reader support

---

## Design Tokens

### Location
All design tokens are defined in `lib/design-tokens.ts`.

### Container Widths

```typescript
import { CONTAINER_WIDTHS } from '@/lib/design-tokens'

// Available widths:
CONTAINER_WIDTHS.full      // max-w-full - Full width
CONTAINER_WIDTHS.wide      // max-w-7xl (1280px) - Dashboards, galleries
CONTAINER_WIDTHS.standard  // max-w-6xl (1152px) - Most content pages
CONTAINER_WIDTHS.narrow    // max-w-4xl (896px) - Blog posts, articles
CONTAINER_WIDTHS.tight     // max-w-3xl (768px) - Forms, centered content
CONTAINER_WIDTHS.compact   // max-w-2xl (672px) - Small forms, dialogs
```

**Usage:**
```tsx
import PageContainer from '@/components/layout/page-container'

<PageContainer width="wide" padding="default">
  {/* Content */}
</PageContainer>
```

### Spacing

```typescript
import { SPACING } from '@/lib/design-tokens'

// Container padding (responsive)
SPACING.container       // px-4 sm:px-6 lg:px-8
SPACING.containerTight  // px-4 sm:px-6
SPACING.containerWide   // px-4 sm:px-6 lg:px-12

// Section spacing (vertical)
SPACING.sectionTight    // py-8 sm:py-12
SPACING.section         // py-12 sm:py-16 lg:py-20
SPACING.sectionLarge    // py-16 sm:py-20 lg:py-24

// Card padding
SPACING.card            // p-4 sm:p-6
SPACING.cardTight       // p-3 sm:p-4
SPACING.cardLoose       // p-6 sm:p-8
```

### Typography

```typescript
import { TYPOGRAPHY } from '@/lib/design-tokens'

// Heading styles
TYPOGRAPHY.h1  // text-4xl md:text-5xl lg:text-6xl font-bold
TYPOGRAPHY.h2  // text-3xl md:text-4xl lg:text-5xl font-bold
TYPOGRAPHY.h3  // text-2xl md:text-3xl font-bold
TYPOGRAPHY.h4  // text-xl md:text-2xl font-semibold
TYPOGRAPHY.h5  // text-lg md:text-xl font-semibold
TYPOGRAPHY.h6  // text-base md:text-lg font-semibold

// Body text
TYPOGRAPHY.body       // text-base md:text-lg
TYPOGRAPHY.bodySmall  // text-sm md:text-base
TYPOGRAPHY.caption    // text-xs md:text-sm
TYPOGRAPHY.lead       // text-lg md:text-xl lg:text-2xl
```

**Usage:**
```tsx
import { TYPOGRAPHY } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

<h1 className={cn(TYPOGRAPHY.h1)}>Page Title</h1>
<p className={cn(TYPOGRAPHY.lead, "text-muted-foreground")}>Description</p>
```

### Section Spacing

```typescript
import { SECTION_SPACING } from '@/lib/design-tokens'

// Margin bottom (for spacing between sections)
SECTION_SPACING.tight   // mb-6 sm:mb-8
SECTION_SPACING.normal  // mb-12 sm:mb-16
SECTION_SPACING.large   // mb-16 sm:mb-20 lg:mb-24

// Padding vertical
SECTION_SPACING.paddingTight   // py-6 sm:py-8
SECTION_SPACING.paddingNormal  // py-12 sm:py-16
SECTION_SPACING.paddingLarge   // py-16 sm:py-20 lg:py-24
```

---

## Core Components

### PageContainer

Standardized container for page content with consistent widths and padding.

**Location:** `components/layout/page-container.tsx`

**Props:**
```typescript
interface PageContainerProps {
  children: ReactNode
  width?: 'full' | 'wide' | 'standard' | 'narrow' | 'tight' | 'compact'
  padding?: 'default' | 'tight' | 'wide'
  className?: string
}
```

**Usage:**
```tsx
import PageContainer from '@/components/layout/page-container'

<PageContainer width="standard" padding="default">
  <h1>Page Title</h1>
  {/* Content */}
</PageContainer>
```

**When to use:**
- All page-level content
- Consistent layout across pages
- Responsive container widths

### PageHeader

Standardized page header with title, description, and optional icon.

**Location:** `components/layout/page-header.tsx`

**Props:**
```typescript
interface PageHeaderProps {
  title: string
  description?: string
  align?: 'left' | 'center' | 'right'
  variant?: 'default' | 'large' | 'small'
  children?: ReactNode
  className?: string
}
```

**Usage:**
```tsx
import PageHeader from '@/components/layout/page-header'

<PageHeader
  title="Page Title"
  description="Page description"
  align="center"
  variant="large"
/>
```

---

## Layout Components

### SectionHeader

Standardized section header with title, description, icon, and animations.

**Location:** `components/ui/section-header.tsx`

**Props:**
```typescript
interface SectionHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  align?: 'left' | 'center' | 'right'
  variant?: 'default' | 'large' | 'small'
  spacing?: keyof typeof SECTION_SPACING
  delay?: number
}
```

**Usage:**
```tsx
import { SectionHeader } from '@/components/ui/section-header'
import { BarChart3 } from 'lucide-react'

<SectionHeader
  title="Analytics Dashboard"
  description="View portfolio statistics and metrics"
  icon={BarChart3}
  align="center"
  variant="large"
  spacing="large"
/>
```

**Features:**
- Semantic HTML (proper heading tags based on variant)
- ARIA labels and descriptions
- Built-in animations
- Icon support

### AnimatedSection

Wrapper component for sections with standardized fade-in animations.

**Location:** `components/ui/animated-section.tsx`

**Props:**
```typescript
interface AnimatedSectionProps {
  children: ReactNode
  variant?: 'fade-up' | 'fade-down' | 'fade-in' | 'scale'
  delay?: number
  duration?: number
  viewport?: { once?: boolean; margin?: string }
}
```

**Usage:**
```tsx
import { AnimatedSection } from '@/components/ui/animated-section'

<AnimatedSection variant="fade-up" delay={0.2}>
  <div>Content</div>
</AnimatedSection>
```

**Variants:**
- `fade-up`: Content fades in from below
- `fade-down`: Content fades in from above
- `fade-in`: Simple opacity fade
- `scale`: Content scales in from 0.9 to 1.0

---

## Utility Components

### StatCard

Displays a statistic with icon, value, and label in a standardized card format.

**Location:** `components/ui/stat-card.tsx`

**Props:**
```typescript
interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  index?: number
  delay?: number
  className?: string
}
```

**Usage:**
```tsx
import { StatCard } from '@/components/ui/stat-card'
import { Users } from 'lucide-react'

<StatCard
  label="Total Users"
  value={1234}
  icon={Users}
  index={0}
  delay={0.3}
/>
```

**Features:**
- Memoized for performance
- ARIA labels for accessibility
- Built-in animations
- Focus indicators

### StatCardsGrid

Displays multiple stat cards in a responsive grid layout.

**Location:** `components/ui/stat-card.tsx`

**Props:**
```typescript
interface StatCardsGridProps {
  stats: Array<{
    label: string
    value: string | number
    icon: LucideIcon
  }>
  columns?: 2 | 3 | 4
  delay?: number
  className?: string
}
```

**Usage:**
```tsx
import { StatCardsGrid } from '@/components/ui/stat-card'
import { Users, Zap, CheckCircle2, BarChart3 } from 'lucide-react'

const stats = [
  { label: 'Users', value: 1234, icon: Users },
  { label: 'Speed', value: '100%', icon: Zap },
  { label: 'Uptime', value: '99.9%', icon: CheckCircle2 },
  { label: 'Analytics', value: '50+', icon: BarChart3 },
]

<StatCardsGrid stats={stats} columns={4} delay={0.3} />
```

**Grid Layouts:**
- `columns={2}`: 2 columns on all screens
- `columns={3}`: 1 column on mobile, 3 on desktop
- `columns={4}`: 2 columns on mobile, 4 on desktop

---

## Best Practices

### 1. Always Use Design Tokens

❌ **Don't:**
```tsx
<h1 className="text-4xl font-bold">Title</h1>
<div className="max-w-6xl mx-auto px-4">Content</div>
```

✅ **Do:**
```tsx
import { TYPOGRAPHY } from '@/lib/design-tokens'
import PageContainer from '@/components/layout/page-container'

<h1 className={cn(TYPOGRAPHY.h1)}>Title</h1>
<PageContainer width="standard" padding="default">Content</PageContainer>
```

### 2. Use Semantic HTML

Always use proper heading hierarchy:
- `h1` for main page title (only one per page)
- `h2` for major section headers
- `h3` for subsections
- Use `SectionHeader` component for consistent styling

### 3. Accessibility First

- Always include `aria-label` on icon-only buttons
- Use `aria-hidden="true"` on decorative icons
- Provide keyboard navigation support
- Include focus indicators
- Use semantic HTML elements

### 4. Performance

- Components are already memoized where appropriate
- Use `useMemo` for expensive computations
- Use `useCallback` for event handlers passed as props
- Lazy load heavy components with `React.lazy()`

### 5. Consistent Spacing

Use `SECTION_SPACING` tokens for vertical rhythm:
```tsx
import { SECTION_SPACING } from '@/lib/design-tokens'

<div className={SECTION_SPACING.normal}>
  {/* Section content */}
</div>
```

---

## Migration Guide

### Migrating Existing Pages

1. **Replace container divs:**
   ```tsx
   // Before
   <div className="container mx-auto px-4 py-8">
   
   // After
   <PageContainer width="standard" padding="default">
   ```

2. **Update typography:**
   ```tsx
   // Before
   <h1 className="text-4xl font-bold">
   
   // After
   <h1 className={cn(TYPOGRAPHY.h1)}>
   ```

3. **Use SectionHeader:**
   ```tsx
   // Before
   <div className="text-center mb-8">
     <h2 className="text-2xl font-bold">Section Title</h2>
     <p className="text-muted-foreground">Description</p>
   </div>
   
   // After
   <SectionHeader
     title="Section Title"
     description="Description"
     align="center"
   />
   ```

4. **Add animations:**
   ```tsx
   // Before
   <section>
   
   // After
   <AnimatedSection variant="fade-up" delay={0.2}>
   ```

---

## Examples

### Complete Page Example

```tsx
'use client'

import PageContainer from '@/components/layout/page-container'
import { SectionHeader } from '@/components/ui/section-header'
import { AnimatedSection } from '@/components/ui/animated-section'
import { StatCardsGrid } from '@/components/ui/stat-card'
import { BarChart3, Users, Zap } from 'lucide-react'
import { TYPOGRAPHY, SECTION_SPACING } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

export default function ExamplePage() {
  const stats = [
    { label: 'Users', value: 1234, icon: Users },
    { label: 'Speed', value: '100%', icon: Zap },
    { label: 'Analytics', value: '50+', icon: BarChart3 },
  ]

  return (
    <PageContainer width="wide" padding="default">
      <SectionHeader
        title="Example Page"
        description="This is an example page using the design system"
        icon={BarChart3}
        align="center"
        variant="large"
        spacing="large"
      />

      <AnimatedSection variant="fade-up" delay={0.3}>
        <StatCardsGrid stats={stats} columns={3} delay={0.4} />
      </AnimatedSection>

      <AnimatedSection variant="fade-up" delay={0.5} className={SECTION_SPACING.normal}>
        <div>
          <h2 className={cn(TYPOGRAPHY.h2, "mb-4")}>Content Section</h2>
          <p className={cn(TYPOGRAPHY.body, "text-muted-foreground")}>
            This is example content using design tokens.
          </p>
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}
```

---

## Component Reference

### Quick Reference

| Component | Location | Purpose |
|-----------|----------|---------|
| `PageContainer` | `components/layout/page-container.tsx` | Standardized page containers |
| `PageHeader` | `components/layout/page-header.tsx` | Page headers with animations |
| `SectionHeader` | `components/ui/section-header.tsx` | Section headers with icons |
| `AnimatedSection` | `components/ui/animated-section.tsx` | Animated section wrappers |
| `AnimatedDiv` | `components/ui/animated-section.tsx` | Animated div wrappers |
| `StatCard` | `components/ui/stat-card.tsx` | Statistics display cards |
| `StatCardsGrid` | `components/ui/stat-card.tsx` | Grid of stat cards |

---

## Resources

- **Design Tokens:** `lib/design-tokens.ts`
- **Implementation Status:** `DESIGN_SYSTEM_IMPLEMENTATION.md`
- **Component Library:** `components/ui/`

---

**Last Updated:** January 14, 2025  
**Maintained By:** Mohamed Datt

