import { redirect } from 'next/navigation'

export default function SkillTreeRedirect() {
  redirect('/insights?tab=skills')
}
