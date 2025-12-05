/**
 * API route for project stats
 */
import { NextRequest, NextResponse } from 'next/server'
import { getProjectStats } from '@/lib/db-cloud'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const projectId = searchParams.get('project_id')
    
    const stats = await getProjectStats(projectId || undefined)
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Failed to fetch project stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
