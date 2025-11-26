import { redirect } from 'next/navigation'

export default function AssessmentRedirect() {
  redirect('/tools?tab=assessment')
}
