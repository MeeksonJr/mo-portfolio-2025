import { redirect } from 'next/navigation'

export default function ContactHubRedirect() {
  redirect('/tools?tab=contact')
}
