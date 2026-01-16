/**
 * Design Tokens
 * Centralized design system tokens for consistent styling across the application
 */

// Container Widths
export const CONTAINER_WIDTHS = {
  full: 'max-w-full',
  wide: 'max-w-7xl',      // 1280px - For dashboards, galleries, wide content
  standard: 'max-w-6xl',  // 1152px - For most content pages
  narrow: 'max-w-4xl',    // 896px - For blog posts, articles, focused content
  tight: 'max-w-3xl',     // 768px - For forms, centered content
  compact: 'max-w-2xl',    // 672px - For small forms, dialogs
} as const

export type ContainerWidth = keyof typeof CONTAINER_WIDTHS

// Standardized Padding Patterns
export const SPACING = {
  // Container padding (responsive)
  container: 'px-4 sm:px-6 lg:px-8',
  containerTight: 'px-4 sm:px-6',
  containerWide: 'px-4 sm:px-6 lg:px-12',
  
  // Section spacing (vertical)
  sectionTight: 'py-8 sm:py-12',
  section: 'py-12 sm:py-16 lg:py-20',
  sectionLarge: 'py-16 sm:py-20 lg:py-24',
  
  // Card padding
  card: 'p-4 sm:p-6',
  cardTight: 'p-3 sm:p-4',
  cardLoose: 'p-6 sm:p-8',
  
  // Component spacing
  component: 'space-y-4',
  componentTight: 'space-y-2',
  componentLoose: 'space-y-6',
  
  // Gap spacing
  gap: 'gap-4 sm:gap-6',
  gapTight: 'gap-2 sm:gap-4',
  gapLoose: 'gap-6 sm:gap-8',
} as const

// Typography Scale
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
} as const

// Border Radius
export const RADIUS = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
} as const

// Shadows
export const SHADOWS = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
} as const

// Card Variants
export const CARD_VARIANTS = {
  default: 'bg-card border rounded-lg shadow-sm',
  glass: 'glass rounded-xl',
  enhanced: 'glass-enhanced rounded-xl',
  elevated: 'bg-card border rounded-xl shadow-lg',
  outlined: 'bg-card border-2 rounded-lg',
  interactive: 'glass rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-primary/20 cursor-pointer',
  featured: 'glass rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-primary',
} as const

export type CardVariant = keyof typeof CARD_VARIANTS

// Section Spacing (for vertical rhythm)
export const SECTION_SPACING = {
  tight: 'mb-6 sm:mb-8',
  normal: 'mb-12 sm:mb-16',
  large: 'mb-16 sm:mb-20 lg:mb-24',
  xlarge: 'mb-20 sm:mb-24 lg:mb-32',
} as const

// Breakpoints (for reference)
export const BREAKPOINTS = {
  sm: '640px',   // Small tablets
  md: '768px',   // Tablets
  lg: '1024px',  // Laptops
  xl: '1280px',  // Desktops
  '2xl': '1536px', // Large desktops
} as const

// Animation Durations
export const ANIMATION = {
  fast: 'duration-150',
  normal: 'duration-300',
  slow: 'duration-500',
  slower: 'duration-700',
} as const

// Z-Index Layers
export const Z_INDEX = {
  base: 'z-0',
  dropdown: 'z-10',
  sticky: 'z-20',
  overlay: 'z-30',
  modal: 'z-40',
  popover: 'z-50',
  tooltip: 'z-50',
  navigation: 'z-50',
  notification: 'z-60',
  tour: 'z-[9999]',
} as const

