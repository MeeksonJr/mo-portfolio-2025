import { Metadata } from 'next'
import ROICalculator from '@/components/roi/roi-calculator'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'ROI & Impact Calculator | Mohamed Datt',
  description: 'Calculate the potential business impact and ROI of hiring Mohamed Datt. See cost savings, efficiency improvements, and revenue impact.',
  type: 'website',
  tags: ['ROI', 'calculator', 'business impact', 'hiring'],
})

export default function ROICalculatorPage() {
  return <ROICalculator />
}

