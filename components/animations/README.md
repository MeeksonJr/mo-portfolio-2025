# Scroll Animation Components

Reusable scroll-triggered animation components using Framer Motion and Intersection Observer.

## Components

### ScrollReveal
Main component for scroll-triggered animations with multiple variants.

```tsx
import { ScrollReveal } from '@/components/animations/scroll-reveal'

<ScrollReveal variant="fade" delay={0.2} duration={0.6}>
  <div>Your content here</div>
</ScrollReveal>
```

**Props:**
- `variant`: 'fade' | 'slideLeft' | 'slideRight' | 'slideUp' | 'slideDown' | 'scale' | 'blur'
- `delay`: number (seconds)
- `duration`: number (seconds)
- `distance`: number (pixels for slide animations)
- `className`: string
- `once`: boolean (animate only once or every time)
- `threshold`: number (0-1, visibility threshold)

### Convenience Components

```tsx
import { FadeIn, SlideInLeft, SlideInRight, SlideInUp, ScaleIn, BlurIn } from '@/components/animations/scroll-reveal'

<FadeIn delay={0.2}>
  <div>Fades in</div>
</FadeIn>

<SlideInLeft delay={0.1}>
  <div>Slides from left</div>
</SlideInLeft>

<SlideInUp delay={0.3}>
  <div>Slides from bottom</div>
</SlideInUp>
```

### StaggerContainer
For animating lists with staggered delays.

```tsx
import { StaggerContainer } from '@/components/animations/scroll-reveal'

<StaggerContainer staggerDelay={0.1}>
  {items.map(item => (
    <div key={item.id}>{item.content}</div>
  ))}
</StaggerContainer>
```

## Hook

### useScrollAnimation
Custom hook for advanced usage.

```tsx
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { motion } from 'framer-motion'

function MyComponent() {
  const { ref, isInView } = useScrollAnimation({ threshold: 0.2 })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
    >
      Content
    </motion.div>
  )
}
```

## Examples

### Basic Fade In
```tsx
<FadeIn>
  <Card>This card fades in when scrolled into view</Card>
</FadeIn>
```

### Staggered List
```tsx
<StaggerContainer>
  {projects.map(project => (
    <ProjectCard key={project.id} project={project} />
  ))}
</StaggerContainer>
```

### Custom Animation
```tsx
<ScrollReveal 
  variant="slideUp" 
  delay={0.2} 
  duration={0.8}
  distance={100}
>
  <Section>Custom animated section</Section>
</ScrollReveal>
```

