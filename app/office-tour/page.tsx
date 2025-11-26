import { redirect } from 'next/navigation'

export default function OfficeTourRedirect() {
  redirect('/about?tab=office')
}
