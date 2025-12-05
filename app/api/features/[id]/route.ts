/**
 * API route for single feature details
 */
import { NextRequest, NextResponse } from 'next/server'
import { getFeatureWithDetails } from '@/lib/db-cloud'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const feature = await getFeatureWithDetails(id)
    
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
