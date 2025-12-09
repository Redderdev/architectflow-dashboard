/**
 * API route for features with project filtering
 */
import { NextRequest, NextResponse } from 'next/server'
import { getAllFeatures as getAllFeaturesCloud, getFeaturesByStatus as getFeaturesByStatusCloud } from '@/lib/db-cloud'
import { getAllFeatures as getAllFeaturesLocal, getFeaturesByStatus as getFeaturesByStatusLocal } from '@/lib/db'

export const dynamic = 'force-dynamic'

const hasCloudDb = !!process.env.DATABASE_URL

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const projectId = searchParams.get('project_id')
    const status = searchParams.get('status')
    
    let features
    if (status) {
      features = hasCloudDb
        ? await getFeaturesByStatusCloud(status, projectId || undefined)
        : getFeaturesByStatusLocal(status, projectId || undefined)
    } else {
      features = hasCloudDb
        ? await getAllFeaturesCloud(projectId || undefined)
        : getAllFeaturesLocal(projectId || undefined)
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
