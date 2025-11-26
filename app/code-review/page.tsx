import { redirect } from 'next/navigation'

export default function CodeReviewRedirect() {
  redirect('/code?tab=review')
}
