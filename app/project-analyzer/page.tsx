import { redirect } from 'next/navigation'

export default function ProjectAnalyzerRedirect() {
  redirect('/tools?tab=analyzer')
}
