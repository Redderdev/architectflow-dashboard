/**
 * PostgreSQL database client for ArchitectFlow Dashboard (Cloud/SaaS)
 * Connects to Railway PostgreSQL via DATABASE_URL
 */

import pg from 'pg';

const { Pool } = pg;

let pool: pg.Pool | null = null;

/**
 * Get or create database connection pool
 */
export function getCloudDatabase(): pg.Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' 
        ? { rejectUnauthorized: false } 
        : undefined,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }
  
  return pool;
}

/**
 * Execute a query and return results
 */
export async function query<T extends pg.QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<pg.QueryResult<T>> {
  const db = getCloudDatabase();
  return db.query<T>(text, params);
}

/**
 * Get single row
 */
export async function queryOne<T extends pg.QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<T | null> {
  const result = await query<T>(text, params);
  return result.rows[0] || null;
}

/**
 * Get all rows
 */
export async function queryAll<T extends pg.QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const result = await query<T>(text, params);
  return result.rows;
}

// ============ Project Functions ============

export interface Project {
  id: string;
  name: string;
  description: string | null;
  tech_stack: string[] | null;
  architecture_type: string | null;
  created_at: string;
  updated_at: string;
  feature_count?: number;
}

/**
 * Create a new project
 */
export async function createProject(params: {
  userId: string;
  name: string;
  description?: string;
  tech_stack?: string[];
  architecture_type?: string;
}): Promise<Project> {
  // Validation
  if (!params.name || params.name.length < 3 || params.name.length > 50) {
    throw new Error('Project name must be 3-50 characters');
  }
  
  // Generate ID from name (slug-style)
  const id = params.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  const result = await query<any>(`
    INSERT INTO projects (
      id, user_id, name, description, tech_stack, architecture_type, 
      created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING *
  `, [
    id,
    params.userId,
    params.name,
    params.description || null,
    JSON.stringify(params.tech_stack || []),
    params.architecture_type || null
  ]);
  
  return parseProject(result.rows[0]);
}

/**
 * List all projects for user
 */
export async function listProjects(userId: string): Promise<Project[]> {
  const result = await query<any>(`
    SELECT 
      p.*,
      COUNT(f.id) as feature_count
    FROM projects p
    LEFT JOIN features f ON f.project_id = p.id AND f.user_id = p.user_id
    WHERE p.user_id = $1
    GROUP BY p.id
    ORDER BY p.updated_at DESC
  `, [userId]);
  
  return result.rows.map(parseProject);
}

/**
 * Get project by ID
 */
export async function getProjectById(userId: string, projectId: string): Promise<Project | null> {
  const result = await queryOne<any>(`
    SELECT 
      p.*,
      COUNT(f.id) as feature_count
    FROM projects p
    LEFT JOIN features f ON f.project_id = p.id AND f.user_id = p.user_id
    WHERE p.id = $1 AND p.user_id = $2
    GROUP BY p.id
  `, [projectId, userId]);
  
  if (!result) return null;
  
  return parseProject(result);
}

/**
 * Delete a project and all its data
 */
export async function deleteProject(userId: string, projectId: string): Promise<boolean> {
  // Delete in correct order (foreign keys)
  await query(
    'DELETE FROM implementations WHERE feature_id IN (SELECT id FROM features WHERE project_id = $1 AND user_id = $2)',
    [projectId, userId]
  );
  
  await query(
    'DELETE FROM blockers WHERE feature_id IN (SELECT id FROM features WHERE project_id = $1 AND user_id = $2)',
    [projectId, userId]
  );
  
  await query(
    'DELETE FROM features WHERE project_id = $1 AND user_id = $2',
    [projectId, userId]
  );
  
  const result = await query(
    'DELETE FROM projects WHERE id = $1 AND user_id = $2',
    [projectId, userId]
  );
  
  return (result.rowCount ?? 0) > 0;
}

/**
 * Helper: Parse PostgreSQL row to Project object
 */
function parseProject(row: any): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    tech_stack: typeof row.tech_stack === 'string' 
      ? JSON.parse(row.tech_stack) 
      : row.tech_stack || null,
    architecture_type: row.architecture_type,
    created_at: row.created_at,
    updated_at: row.updated_at,
    feature_count: parseInt(row.feature_count) || 0,
  };
}
