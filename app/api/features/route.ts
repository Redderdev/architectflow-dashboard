/**
 * API route for features with project filtering
 */
import { NextRequest, NextResponse } from 'next/server'
import { getAllFeatures, getFeaturesByStatus } from '@/lib/db-cloud'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const projectId = searchParams.get('project_id')
    const status = searchParams.get('status')
    
    let features
    if (status) {
      features = await getFeaturesByStatus(status, projectId || undefined)
    } else {
      features = await getAllFeatures(projectId || undefined)
    }
    
    return NextResponse.json(features)
  } catch (error) {
    console.error('Failed to fetch features:', error)
    return NextResponse.json(
      { error: 'Failed to fetch features' },
      { status: 500 }
    )
  }
}
