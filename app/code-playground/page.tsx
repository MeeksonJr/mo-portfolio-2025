import { redirect } from 'next/navigation'

export default function CodePlaygroundRedirect() {
  redirect('/code?tab=playground')
}
