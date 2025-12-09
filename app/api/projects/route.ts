/**
 * API route for projects
 * GET: List all projects
 * POST: Create a new project
 */
import { NextRequest, NextResponse } from 'next/server'
import { 
  listProjects, 
  createProject,
  Project 
} from '@/lib/db-cloud'
import { getUserIdFromRequest } from '@/lib/auth-utils'

export const dynamic = 'force-dynamic'

const hasCloudDb = !!process.env.DATABASE_URL

/**
 * GET /api/projects - List all projects for user
 */
export async function GET(request: NextRequest) {
  try {
    if (!hasCloudDb) {
      return NextResponse.json([])
    }

    const userId = getUserIdFromRequest(request);
    const projects = await listProjects(userId);
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' }, 
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects - Create a new project
 */
export async function POST(request: NextRequest) {
  try {
    if (!hasCloudDb) {
      return NextResponse.json(
        { error: 'Cloud database not configured (DATABASE_URL missing)' },
        { status: 503 }
      )
    }

    const userId = getUserIdFromRequest(request);
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }
    
    if (body.name.length < 3 || body.name.length > 50) {
      return NextResponse.json(
        { error: 'Project name must be 3-50 characters' },
        { status: 400 }
      );
    }
    
    // Create project
    const project = await createProject({
      userId,
      name: body.name,
      description: body.description,
      tech_stack: body.tech_stack,
      architecture_type: body.architecture_type,
    });
    
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Failed to create project:', error);
    
    // Check for duplicate key error
    if (error instanceof Error && error.message.includes('duplicate')) {
      return NextResponse.json(
        { error: 'A project with this name already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}