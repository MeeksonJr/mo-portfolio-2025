# Design System Style Guide

**Version:** 1.0.0  
**Last Updated:** January 14, 2025  
**Status:** ✅ Active

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Design Tokens](#design-tokens)
3. [Layout System](#layout-system)
4. [Typography](#typography)
5. [Spacing System](#spacing-system)
6. [Colors](#colors)
7. [Components](#components)
8. [Patterns & Best Practices](#patterns--best-practices)
9. [Migration Guide](#migration-guide)

---

## Overview

This style guide documents the design system used across the portfolio website. It provides comprehensive reference for developers to ensure consistency and maintainability.

### Key Principles

- **Consistency**: Standardized components and patterns across all pages
- **Maintainability**: Centralized design tokens in `lib/design-tokens.ts`
- **Responsiveness**: Mobile-first approach with standardized breakpoints
- **Accessibility**: ARIA labels, keyboard navigation, and focus states
- **Performance**: Optimized for production with minimal CSS overhead

---

## Design Tokens

**File:** `lib/design-tokens.ts`

All design decisions are centralized in the design tokens file. Always import from this file rather than hardcoding values.

```typescript
import { 
  CONTAINER_WIDTHS, 
  SPACING, 
  TYPOGRAPHY, 
  SECTION_SPACING,
  CARD_VARIANTS,
  RADIUS,
  SHADOWS,
  ANIMATION,
  Z_INDEX
} from '@/lib/design-tokens'
```

### Container Widths

```typescript
export const CONTAINER_WIDTHS = {
  full: 'max-w-full',        // Full width
  wide: 'max-w-7xl',         // 1280px - Dashboards, galleries
  standard: 'max-w-6xl',     // 1152px - Most content pages
  narrow: 'max-w-4xl',       // 896px - Blog posts, articles
  tight: 'max-w-3xl',        // 768px - Forms, focused content
  compact: 'max-w-2xl',      // 672px - Small forms, dialogs
}
```

**Usage:**
- **Wide**: Dashboards, music hubs, admin pages, listings with many items
- **Standard**: Most content pages, about pages, testimonials
- **Narrow**: Blog posts, case studies, project details, resource content
- **Tight**: Forms, focused content areas
- **Compact**: Small forms, dialogs, modals

---

## Layout System

### PageContainer Component

**File:** `components/layout/page-container.tsx`

Standardized container component for consistent page widths and padding.

```tsx
import PageContainer from '@/components/layout/page-container'

<PageContainer width="standard" padding="default">
  {children}
</PageContainer>
```

**Props:**
- `width`: `'full' | 'wide' | 'standard' | 'narrow' | 'tight' | 'compact'` (default: `'standard'`)
- `padding`: `'default' | 'tight' | 'wide'` (default: `'default'`)
- `className`: Additional classes (optional)

**Helper Function:**
```tsx
import { getContainerClasses } from '@/components/layout/page-container'

<div className={getContainerClasses('narrow', 'default')}>
  {children}
</div>
```

### Enhanced PageLayout Component

**File:** `components/layout/enhanced-page-layout.tsx`

Full-featured page layout with header, breadcrumbs, and container support.

```tsx
import EnhancedPageLayout from '@/components/layout/enhanced-page-layout'

<EnhancedPageLayout
  title="Page Title"
  description="Page description"
  containerWidth="standard"
  containerPadding="default"
  showBreadcrumbs={true}
>
  {children}
</EnhancedPageLayout>
```

### Page Header Component

**File:** `components/layout/page-header.tsx`

Standardized page header with typography and spacing.

```tsx
import PageHeader from '@/components/layout/page-header'

<PageHeader
  title="Page Title"
  description="Page description text"
  align="center"
  variant="default"
  spacing="normal"
>
  {optional children}
</PageHeader>
```

---

## Typography

**File:** `lib/design-tokens.ts`

Always use typography tokens instead of hardcoded font sizes.

```typescript
export const TYPOGRAPHY = {
  h1: 'text-4xl md:text-5xl lg:text-6xl font-bold',
  h2: 'text-3xl md:text-4xl lg:text-5xl font-bold',
  h3: 'text-2xl md:text-3xl font-bold',
  h4: 'text-xl md:text-2xl font-semibold',
  h5: 'text-lg md:text-xl font-semibold',
  h6: 'text-base md:text-lg font-semibold',
  body: 'text-base md:text-lg',
  bodySmall: 'text-sm md:text-base',
  caption: 'text-xs md:text-sm',
  lead: 'text-lg md:text-xl lg:text-2xl',
}
```

**Usage:**
```tsx
import { TYPOGRAPHY } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

// Simple usage
<h1 className={TYPOGRAPHY.h1}>Title</h1>

// With additional classes
<h1 className={cn(TYPOGRAPHY.h1, "mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent")}>
  Title
</h1>
```

**Typography Scale:**
- **H1**: Page titles, hero sections (4xl → 5xl → 6xl)
- **H2**: Section titles, page subtitles (3xl → 4xl → 5xl)
- **H3**: Subsection titles (2xl → 3xl)
- **H4-H6**: Nested headings (xl → 2xl, lg → xl, base → lg)
- **Lead**: Introductory text, descriptions (lg → xl → 2xl)
- **Body**: Main content (base → lg)
- **BodySmall**: Secondary text (sm → base)
- **Caption**: Small labels, metadata (xs → sm)

---

## Spacing System

### Container Padding

```typescript
export const SPACING = {
  container: 'px-4 sm:px-6 lg:px-8',      // Standard page padding
  containerTight: 'px-4 sm:px-6',          // Compact padding
  containerWide: 'px-4 sm:px-6 lg:px-12',  // Wide padding
}
```

### Section Spacing

```typescript
export const SECTION_SPACING = {
  // Margin bottom
  tight: 'mb-6 sm:mb-8',
  normal: 'mb-12 sm:mb-16',
  large: 'mb-16 sm:mb-20 lg:mb-24',
  xlarge: 'mb-20 sm:mb-24 lg:mb-32',
  
  // Padding vertical
  paddingTight: 'py-8 sm:py-12',
  paddingNormal: 'py-12 sm:py-16 lg:py-20',
  paddingLarge: 'py-16 sm:py-20 lg:py-24',
  
  // Combined
  sectionTight: 'py-8 sm:py-12 mb-6 sm:mb-8',
  sectionNormal: 'py-12 sm:py-16 lg:py-20 mb-12 sm:mb-16',
  sectionLarge: 'py-16 sm:py-20 lg:py-24 mb-16 sm:mb-20 lg:mb-24',
  
  // Common values
  mb4: 'mb-4',
  mb6: 'mb-6',
  mb8: 'mb-8',
  mb12: 'mb-12',
  mb16: 'mb-16',
  py12: 'py-12',
  py16: 'py-16',
}
```

**Usage:**
```tsx
import { SECTION_SPACING } from '@/lib/design-tokens'

// Margin between sections
<div className={SECTION_SPACING.normal}>
  {content}
</div>

// Vertical padding for sections
<div className={SECTION_SPACING.paddingNormal}>
  {content}
</div>
```

---

## Colors

Colors are defined in CSS variables in `app/globals.css` using HSL format. Use Tailwind's color system to access them.

**Primary Colors:**
- `text-primary` - Primary text color
- `bg-primary` - Primary background
- `border-primary` - Primary border

**Semantic Colors:**
- `text-muted-foreground` - Muted/secondary text
- `bg-card` - Card background
- `bg-background` - Page background
- `border-border` - Default borders

**Usage:**
```tsx
// Always use semantic color classes
<p className="text-muted-foreground">Secondary text</p>
<div className="bg-card border border-border">Card content</div>
```

---

## Components

### Card Variants

**File:** `components/ui/card-variants.tsx`

Standardized card styles for consistent visual hierarchy.

```tsx
import { VariantCard, InteractiveCard, FeaturedCard } from '@/components/ui/card-variants'

// Using variant prop
<VariantCard variant="glass">
  {content}
</VariantCard>

// Convenience components
<InteractiveCard>
  {clickable content}
</InteractiveCard>

<FeaturedCard>
  {featured content}
</FeaturedCard>
```

**Available Variants:**
- `default` - Standard card with border
- `glass` - Glass morphism effect
- `enhanced` - Enhanced glass effect
- `elevated` - Elevated shadow
- `outlined` - Border-only style
- `interactive` - Hover effects for clickable cards
- `featured` - Highlighted border for featured content

---

## Patterns & Best Practices

### 1. Always Use Design Tokens

❌ **Don't:**
```tsx
<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
<h1 className="text-4xl md:text-5xl font-bold">
```

✅ **Do:**
```tsx
import PageContainer from '@/components/layout/page-container'
import { TYPOGRAPHY } from '@/lib/design-tokens'

<PageContainer width="standard" padding="default">
<h1 className={TYPOGRAPHY.h1}>
```

### 2. Consistent Page Structure

```tsx
export default function MyPage() {
  return (
    <PageContainer width="standard" padding="default">
      {/* Header */}
      <div className={SECTION_SPACING.normal}>
        <h1 className={cn(TYPOGRAPHY.h1, "mb-4")}>Page Title</h1>
        <p className={cn(TYPOGRAPHY.lead, "text-muted-foreground")}>
          Page description
        </p>
      </div>

      {/* Content */}
      <div className={SECTION_SPACING.normal}>
        {content}
      </div>
    </PageContainer>
  )
}
```

### 3. Typography Hierarchy

Always maintain proper heading hierarchy (h1 → h2 → h3, etc.) and use appropriate typography tokens.

### 4. Responsive Design

Design tokens already include responsive breakpoints. Don't add custom responsive classes unless necessary.

### 5. Spacing Consistency

Use `SECTION_SPACING` tokens for vertical rhythm between sections.

---

## Migration Guide

### Migrating Existing Components

1. **Replace container classes:**
   ```tsx
   // Before
   <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
   
   // After
   <PageContainer width="standard" padding="default">
   ```

2. **Replace typography classes:**
   ```tsx
   // Before
   <h1 className="text-4xl md:text-5xl font-bold">
   
   // After
   <h1 className={cn(TYPOGRAPHY.h1)}>
   ```

3. **Replace spacing classes:**
   ```tsx
   // Before
   <div className="mb-12">
   
   // After
   <div className={SECTION_SPACING.normal}>
   ```

### Creating New Components

Always start with design tokens:

```tsx
'use client'

import { TYPOGRAPHY, SECTION_SPACING } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

export default function MyComponent() {
  return (
    <div className={cn(SECTION_SPACING.normal)}>
      <h2 className={cn(TYPOGRAPHY.h2, "mb-4")}>Component Title</h2>
      <p className={cn(TYPOGRAPHY.body, "text-muted-foreground")}>
        Component description
      </p>
    </div>
  )
}
```

---

## File Structure

```
lib/
  design-tokens.ts          # All design tokens
components/
  layout/
    page-container.tsx      # PageContainer component
    page-header.tsx         # PageHeader component
    enhanced-page-layout.tsx # EnhancedPageLayout component
  ui/
    card-variants.tsx       # Card variant components
```

---

## Resources

- **Design Tokens:** `lib/design-tokens.ts`
- **Implementation Progress:** `DESIGN_SYSTEM_IMPLEMENTATION.md`
- **Design Review:** `DESIGN_SYSTEM_REVIEW.md`

---

**Last Updated:** January 14, 2025  
**Maintained By:** Design System Team

