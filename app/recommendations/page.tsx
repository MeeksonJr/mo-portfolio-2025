import { redirect } from 'next/navigation'

export default function RecommendationsRedirect() {
  redirect('/insights?tab=recommendations')
}
