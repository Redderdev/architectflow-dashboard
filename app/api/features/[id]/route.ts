/**
 * API route for single feature details
 */
import { NextRequest, NextResponse } from 'next/server'
import { getFeatureWithDetails as getFeatureWithDetailsCloud } from '@/lib/db-cloud'
import { getFeatureWithDetails as getFeatureWithDetailsLocal } from '@/lib/db'

export const dynamic = 'force-dynamic'

const hasCloudDb = !!process.env.DATABASE_URL

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const feature = hasCloudDb
      ? await getFeatureWithDetailsCloud(id)
      : getFeatureWithDetailsLocal(id)
    
    if (!feature) {
      return NextResponse.json(
        { error: 'Feature not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(feature)
  } catch (error) {
    console.error('Failed to fetch feature:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feature' },
      { status: 500 }
    )
  }
}
