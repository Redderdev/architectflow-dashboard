/**
 * API route for implementation history with project filtering
 */
import { NextRequest, NextResponse } from 'next/server'
import { getImplementationHistory as getImplementationHistoryCloud } from '@/lib/db-cloud'
import { getImplementationHistory as getImplementationHistoryLocal } from '@/lib/db'

export const dynamic = 'force-dynamic'

const hasCloudDb = !!process.env.DATABASE_URL

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const projectId = searchParams.get('project_id')
    
    const history = hasCloudDb
      ? await getImplementationHistoryCloud(projectId || undefined)
      : getImplementationHistoryLocal(projectId || undefined)
    
    return NextResponse.json(history)
  } catch (error) {
    console.error('Failed to fetch implementation history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch implementation history' },
      { status: 500 }
    )
  }
}
