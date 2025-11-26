import { redirect } from 'next/navigation'

export default function BusinessCardRedirect() {
  redirect('/tools?tab=card')
}
