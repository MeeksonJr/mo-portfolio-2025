import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, isAdminUser } from '@/lib/supabase/api-helpers'
import { createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * GET /api/admin/ai/generations/stats
 * Get AI generation statistics
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = await isAdminUser(user.id)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const adminClient = createAdminClient()

    // Build base query
    let baseQuery = adminClient.from('ai_generations').select('*')

    if (startDate) {
      baseQuery = baseQuery.gte('created_at', startDate)
    }

    if (endDate) {
      baseQuery = baseQuery.lte('created_at', endDate)
    }

    const { data: allGenerations, error } = await baseQuery

    if (error) {
      console.error('Error fetching AI generations for stats:', error)
      return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 })
    }

    const generations = allGenerations || []

    // Calculate statistics
    const totalGenerations = generations.length
    const totalTokens = generations.reduce((sum, g) => sum + (g.tokens_used || 0), 0)
    const totalCost = generations.reduce((sum, g) => sum + (parseFloat(g.cost?.toString() || '0') || 0), 0)

    // Group by type
    const byType = generations.reduce((acc, g) => {
      acc[g.type] = (acc[g.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Group by model
    const byModel = generations.reduce((acc, g) => {
      acc[g.model] = (acc[g.model] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Group by date (for time series)
    const byDate = generations.reduce((acc, g) => {
      const date = new Date(g.created_at).toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Average tokens per generation
    const generationsWithTokens = generations.filter(g => g.tokens_used && g.tokens_used > 0)
    const avgTokens = generationsWithTokens.length > 0
      ? totalTokens / generationsWithTokens.length
      : 0

    // Average cost per generation
    const generationsWithCost = generations.filter(g => g.cost && parseFloat(g.cost.toString()) > 0)
    const avgCost = generationsWithCost.length > 0
      ? totalCost / generationsWithCost.length
      : 0

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentGenerations = generations.filter(
      g => new Date(g.created_at) >= sevenDaysAgo
    )

    return NextResponse.json({
      totalGenerations,
      totalTokens,
      totalCost: parseFloat(totalCost.toFixed(6)),
      avgTokens: parseFloat(avgTokens.toFixed(2)),
      avgCost: parseFloat(avgCost.toFixed(6)),
      byType,
      byModel,
      byDate,
      recentCount: recentGenerations.length,
      recentCost: parseFloat(
        recentGenerations
          .reduce((sum, g) => sum + (parseFloat(g.cost?.toString() || '0') || 0), 0)
          .toFixed(6)
      ),
    })
  } catch (error: any) {
    console.error('Error in GET /api/admin/ai/generations/stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

