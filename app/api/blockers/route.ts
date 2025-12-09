/**
 * API route for blockers with project filtering
 */
import { NextRequest, NextResponse } from 'next/server'
import { getBlockers as getBlockersCloud } from '@/lib/db-cloud'
import { getBlockers as getBlockersLocal } from '@/lib/db'

export const dynamic = 'force-dynamic'

const hasCloudDb = !!process.env.DATABASE_URL

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const projectId = searchParams.get('project_id')
    const includeResolved = searchParams.get('includeResolved') === 'true'
    
    const blockers = hasCloudDb
      ? await getBlockersCloud(projectId || undefined, includeResolved)
      : getBlockersLocal(projectId || undefined, includeResolved)
    
    return NextResponse.json(blockers)
  } catch (error) {
    console.error('Failed to fetch blockers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blockers' },
      { status: 500 }
    )
  }
}
