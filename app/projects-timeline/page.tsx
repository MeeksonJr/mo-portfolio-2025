import { redirect } from 'next/navigation'

export default function ProjectTimelineRedirect() {
  redirect('/insights?tab=timeline')
}
