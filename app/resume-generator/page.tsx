import { redirect } from 'next/navigation'

export default function ResumeGeneratorRedirect() {
  redirect('/resume?tab=generate')
}
