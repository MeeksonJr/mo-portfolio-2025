import { redirect } from 'next/navigation'

export default function ProgressIndicatorsRedirect() {
  redirect('/about?tab=progress')
}
