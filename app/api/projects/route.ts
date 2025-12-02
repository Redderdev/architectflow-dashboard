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

export const dynamic = 'force-dynamic'

// For SaaS, we need to get userId from Auth0 token or session
// For now, use a placeholder or environment variable
function getUserId(request: NextRequest): string {
  // TODO: Extract from Auth0 JWT token in Authorization header
  // For development/testing, use env var or default
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    // In production, decode JWT and extract sub claim
    // For now, use a simple approach
    try {
      const token = authHeader.split(' ')[1];
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      return payload.sub || 'demo-user';
    } catch {
      return process.env.DEFAULT_USER_ID || 'demo-user';
    }
  }
  return process.env.DEFAULT_USER_ID || 'demo-user';
}

/**
 * GET /api/projects - List all projects for user
 */
export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);
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
    const userId = getUserId(request);
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
