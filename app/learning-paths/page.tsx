import { redirect } from 'next/navigation'

export default function LearningPathsRedirect() {
  redirect('/about?tab=learning')
}
