import { redirect } from 'next/navigation'

export default function PortfolioCodeRedirect() {
  redirect('/code?tab=portfolio')
}
