import { redirect } from 'next/navigation'

export default function SkillsMatchRedirect() {
  redirect('/tools?tab=skills')
}
