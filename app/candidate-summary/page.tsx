import { redirect } from 'next/navigation'

export default function CandidateSummaryRedirect() {
  redirect('/resume?tab=summary')
}
