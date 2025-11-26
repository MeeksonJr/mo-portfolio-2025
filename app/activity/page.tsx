import { redirect } from 'next/navigation'

export default function ActivityRedirect() {
  redirect('/insights?tab=activity')
}
