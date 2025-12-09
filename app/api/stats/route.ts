/**
 * API route for project stats
 */
import { NextRequest, NextResponse } from 'next/server'
import { getProjectStats as getProjectStatsCloud } from '@/lib/db-cloud'
import { getProjectStats as getProjectStatsLocal } from '@/lib/db'

export const dynamic = 'force-dynamic'

const hasCloudDb = !!process.env.DATABASE_URL

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const projectId = searchParams.get('project_id')
    const stats = hasCloudDb
      ? await getProjectStatsCloud(projectId || undefined)
      : getProjectStatsLocal(projectId || undefined)

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Failed to fetch project stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
