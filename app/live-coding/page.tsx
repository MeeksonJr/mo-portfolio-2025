import { redirect } from 'next/navigation'

export default function LiveCodingRedirect() {
  redirect('/code?tab=terminal')
}
