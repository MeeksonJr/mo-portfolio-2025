import { redirect } from 'next/navigation'

export default function ActivityStatusRedirect() {
  redirect('/about?tab=activity')
}
