/**
 * API route for implementation history with project filtering
 */
import { NextRequest, NextResponse } from 'next/server'
import { getImplementationHistory } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const projectId = searchParams.get('project_id')
    
    const history = getImplementationHistory(projectId || undefined)
    
    return NextResponse.json(history)
  } catch (error) {
    console.error('Failed to fetch implementation history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch implementation history' },
      { status: 500 }
    )
  }
}
