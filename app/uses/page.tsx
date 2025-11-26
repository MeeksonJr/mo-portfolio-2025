import { redirect } from 'next/navigation'

export default function UsesRedirect() {
  redirect('/about?tab=uses')
}
