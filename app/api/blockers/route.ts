/**
 * API route for blockers with project filtering
 */
import { NextRequest, NextResponse } from 'next/server'
import { getBlockers } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const projectId = searchParams.get('project_id')
    const includeResolved = searchParams.get('includeResolved') === 'true'
    
    const blockers = getBlockers(
      projectId || undefined,
      includeResolved
    )
    
    return NextResponse.json(blockers)
  } catch (error) {
    console.error('Failed to fetch blockers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blockers' },
      { status: 500 }
    )
  }
}
