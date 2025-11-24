'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign, TrendingUp, Zap, Clock, Users, Target, 
  Calculator, Download, Share2, BarChart3, Sparkles, Award
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Navigation from '@/components/navigation'
import FooterLight from '@/components/footer-light'
import { toast } from 'sonner'

interface ROICalculation {
  annualSavings: number
  efficiencyGain: number
  revenueImpact: number
  timeToValue: number
  totalROI: number
  paybackPeriod: number
  recommendations: string[]
}

export default function ROICalculator() {
  const [inputs, setInputs] = useState({
    currentDevCost: 100000, // Annual cost of current developer/team
    projectTimeline: 12, // Months
    teamSize: 5, // Current team size
    monthlyRevenue: 50000, // Monthly revenue
    developmentEfficiency: 70, // Current efficiency percentage
  })

  const [results, setResults] = useState<ROICalculation | null>(null)

  const calculateROI = () => {
    const {
      currentDevCost,
      projectTimeline,
      teamSize,
      monthlyRevenue,
      developmentEfficiency,
    } = inputs

    // Based on Mohamed's track record:
    // - Built multiple SaaS products from scratch
    // - 1st place in competition
    // - Fast delivery (projects completed ahead of schedule)
    // - AI integration expertise (can automate tasks)
    
    const efficiencyImprovement = 30 // 30% improvement based on track record
    const newEfficiency = Math.min(100, developmentEfficiency + efficiencyImprovement)
    const timeReduction = (efficiencyImprovement / 100) * projectTimeline
    const newTimeline = Math.max(1, projectTimeline - timeReduction)

    // Cost savings
    const monthlyCost = currentDevCost / 12
    const timeSavedMonths = timeReduction
    const costSavings = monthlyCost * timeSavedMonths
    const annualSavings = costSavings * (12 / projectTimeline)

    // Revenue impact (faster delivery = earlier revenue)
    const revenuePerMonth = monthlyRevenue
    const earlierLaunchMonths = timeReduction
    const revenueImpact = revenuePerMonth * earlierLaunchMonths

    // Efficiency gain
    const efficiencyGain = ((newEfficiency - developmentEfficiency) / developmentEfficiency) * 100

    // Time to value (based on Mohamed's track record of quick delivery)
    const timeToValue = Math.max(1, newTimeline * 0.8) // 20% faster than estimated

    // Total ROI calculation
    const totalROI = annualSavings + revenueImpact

    // Payback period (assuming salary of $80k-120k)
    const estimatedSalary = 100000
    const paybackPeriod = estimatedSalary / (totalROI / 12) // months

    // Recommendations
    const recommendations: string[] = []
    if (totalROI > estimatedSalary * 2) {
      recommendations.push('Exceptional ROI - Strong candidate for immediate hire')
    }
    if (timeReduction > 2) {
      recommendations.push(`Can deliver ${timeReduction.toFixed(1)} months faster, enabling earlier market entry`)
    }
    if (efficiencyGain > 20) {
      recommendations.push(`Significant efficiency improvement (${efficiencyGain.toFixed(0)}%) through AI integration and modern practices`)
    }
    if (revenueImpact > estimatedSalary) {
      recommendations.push(`Revenue impact exceeds annual salary in first year`)
    }
    recommendations.push('Proven track record: 1st place winner, multiple shipped products')
    recommendations.push('Self-taught developer with rapid learning ability (learned English in 3 months)')

    setResults({
      annualSavings: Math.round(annualSavings),
      efficiencyGain: Math.round(efficiencyGain),
      revenueImpact: Math.round(revenueImpact),
      timeToValue: Math.round(timeToValue * 10) / 10,
      totalROI: Math.round(totalROI),
      paybackPeriod: Math.round(paybackPeriod * 10) / 10,
      recommendations,
    })

    toast.success('ROI calculation complete!')
  }

  const handleInputChange = (field: string, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }))
    setResults(null) // Clear results when inputs change
  }

  const handleExport = () => {
    if (!results) return

    const report = {
      inputs,
      results,
      calculatedAt: new Date().toISOString(),
      candidate: 'Mohamed Datt',
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `roi-calculator-report-${new Date().getTime()}.json`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    toast.success('ROI report exported!')
  }

  const handleShare = async () => {
    if (!results) return

    const shareText = `ROI Calculator: ${results.totalROI.toLocaleString()} total ROI - Mohamed Datt`
    const shareUrl = `${window.location.origin}/roi-calculator?roi=${results.totalROI}`

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'ROI Calculator Result',
          text: shareText,
          url: shareUrl,
        })
        toast.success('ROI result shared!')
      } else {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
        toast.success('ROI result copied to clipboard!')
      }
    } catch (error) {
      // User cancelled
    }
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <Calculator className="h-10 w-10 text-primary" />
              ROI & Impact Calculator
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Calculate the potential business impact and ROI of hiring Mohamed Datt. 
              See cost savings, efficiency improvements, and revenue impact.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Company Metrics
                  </CardTitle>
                  <CardDescription>
                    Enter your current development metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="devCost">Annual Developer Cost ($)</Label>
                    <Input
                      id="devCost"
                      type="number"
                      value={inputs.currentDevCost}
                      onChange={(e) => handleInputChange('currentDevCost', Number(e.target.value))}
                      placeholder="100000"
                    />
                    <p className="text-xs text-muted-foreground">
                      Current annual cost of developer/team
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeline">Project Timeline (months)</Label>
                    <Input
                      id="timeline"
                      type="number"
                      value={inputs.projectTimeline}
                      onChange={(e) => handleInputChange('projectTimeline', Number(e.target.value))}
                      placeholder="12"
                    />
                    <p className="text-xs text-muted-foreground">
                      Expected project completion time
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teamSize">Team Size</Label>
                    <Input
                      id="teamSize"
                      type="number"
                      value={inputs.teamSize}
                      onChange={(e) => handleInputChange('teamSize', Number(e.target.value))}
                      placeholder="5"
                    />
                    <p className="text-xs text-muted-foreground">
                      Current development team size
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="revenue">Monthly Revenue ($)</Label>
                    <Input
                      id="revenue"
                      type="number"
                      value={inputs.monthlyRevenue}
                      onChange={(e) => handleInputChange('monthlyRevenue', Number(e.target.value))}
                      placeholder="50000"
                    />
                    <p className="text-xs text-muted-foreground">
                      Expected monthly revenue from project
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="efficiency">Current Efficiency (%)</Label>
                    <Input
                      id="efficiency"
                      type="number"
                      min="0"
                      max="100"
                      value={inputs.developmentEfficiency}
                      onChange={(e) => handleInputChange('developmentEfficiency', Number(e.target.value))}
                      placeholder="70"
                    />
                    <p className="text-xs text-muted-foreground">
                      Current team efficiency percentage
                    </p>
                  </div>

                  <Button onClick={calculateROI} className="w-full" size="lg">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate ROI
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {results ? (
                <div className="space-y-4">
                  {/* Total ROI */}
                  <Card className="border-2 border-primary">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          Total ROI (First Year)
                        </span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={handleShare}>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleExport}>
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-5xl font-bold text-primary mb-2">
                        ${results.totalROI.toLocaleString()}
                      </div>
                      <p className="text-muted-foreground">
                        Potential first-year impact
                      </p>
                    </CardContent>
                  </Card>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-5 w-5 text-green-500" />
                          <span className="text-sm text-muted-foreground">Annual Savings</span>
                        </div>
                        <div className="text-2xl font-bold">
                          ${results.annualSavings.toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="h-5 w-5 text-yellow-500" />
                          <span className="text-sm text-muted-foreground">Efficiency Gain</span>
                        </div>
                        <div className="text-2xl font-bold">
                          +{results.efficiencyGain}%
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-5 w-5 text-blue-500" />
                          <span className="text-sm text-muted-foreground">Revenue Impact</span>
                        </div>
                        <div className="text-2xl font-bold">
                          ${results.revenueImpact.toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-5 w-5 text-purple-500" />
                          <span className="text-sm text-muted-foreground">Time to Value</span>
                        </div>
                        <div className="text-2xl font-bold">
                          {results.timeToValue}mo
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Payback Period */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Payback Period
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">
                        {results.paybackPeriod} months
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Estimated time to recover investment
                      </p>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Alert>
                    <Sparkles className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-semibold mb-2">Key Insights:</div>
                      <ul className="list-disc list-inside space-y-1">
                        {results.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-sm">{rec}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Track Record
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <Award className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <p className="font-semibold">1st Place Winner</p>
                          <p className="text-muted-foreground">Out of 13 teams in internship competition</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Zap className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <p className="font-semibold">Fast Delivery</p>
                          <p className="text-muted-foreground">Projects completed ahead of schedule</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <p className="font-semibold">AI Expertise</p>
                          <p className="text-muted-foreground">Can automate tasks and improve efficiency</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <p className="font-semibold">Proven Results</p>
                          <p className="text-muted-foreground">Multiple shipped SaaS products with real users</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      Enter your metrics on the left and click "Calculate ROI" to see potential impact
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <FooterLight />
    </>
  )
}

