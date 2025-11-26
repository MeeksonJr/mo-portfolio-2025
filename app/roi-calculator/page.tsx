import { redirect } from 'next/navigation'

export default function ROICalculatorRedirect() {
  redirect('/tools?tab=roi')
}
