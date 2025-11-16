/**
 * API route for projects
 */
import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const db = getDatabase()
    
    // Get all projects with feature counts
    const projects = db.prepare(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.created_at,
        COUNT(f.id) as feature_count
      FROM projects p
      LEFT JOIN features f ON f.project_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `).all()
    
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return NextResponse.json([], { status: 500 })
  }
}
