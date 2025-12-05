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

// ============ Feature Functions ============

export interface Feature {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  status: string;
  priority: string;
  category: string | null;
  dependencies: string[] | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

/**
 * Get all features (optionally filtered by project)
 */
export async function getAllFeatures(projectId?: string): Promise<Feature[]> {
  let sql = 'SELECT * FROM features';
  const params: any[] = [];
  
  if (projectId) {
    sql += ' WHERE project_id = $1';
    params.push(projectId);
  }
  
  sql += ' ORDER BY updated_at DESC';
  
  const result = await query(sql, params);
  return result.rows.map(parseFeature);
}

/**
 * Get features by status
 */
export async function getFeaturesByStatus(status: string, projectId?: string): Promise<Feature[]> {
  let sql = 'SELECT * FROM features WHERE status = $1';
  const params: any[] = [status];
  
  if (projectId) {
    sql += ' AND project_id = $2';
    params.push(projectId);
  }
  
  sql += ' ORDER BY updated_at DESC';
  
  const result = await query(sql, params);
  return result.rows.map(parseFeature);
}

/**
 * Get feature with all details (implementations, blockers, dependencies)
 */
export async function getFeatureWithDetails(featureId: string): Promise<any> {
  // Get feature
  const feature = await queryOne<any>(
    'SELECT * FROM features WHERE id = $1',
    [featureId]
  );
  
  if (!feature) return null;
  
  // Get implementations
  const implementations = await queryAll<any>(
    'SELECT * FROM implementations WHERE feature_id = $1 ORDER BY created_at DESC',
    [featureId]
  );
  
  // Get blockers
  const blockers = await queryAll<any>(
    `SELECT * FROM blockers WHERE feature_id = $1 AND resolved_at IS NULL ORDER BY created_at DESC`,
    [featureId]
  );
  
  return {
    ...parseFeature(feature),
    implementations: implementations.map((impl: any) => ({
      id: impl.id,
      feature_id: impl.feature_id,
      created_at: impl.created_at,
      notes: impl.description || impl.notes || null,
      files_affected: typeof impl.file_path === 'string' && impl.file_path.length > 0
        ? [impl.file_path]
        : (typeof impl.files_affected === 'string' 
          ? JSON.parse(impl.files_affected) 
          : impl.files_affected || []),
      patterns_used: typeof impl.patterns_used === 'string'
        ? JSON.parse(impl.patterns_used)
        : impl.patterns_used || [],
    })),
    blockers: blockers.map((blocker: any) => ({
      id: blocker.id,
      feature_id: blocker.feature_id,
      description: blocker.description,
      severity: blocker.severity,
      status: blocker.resolved_at ? 'resolved' : 'active',
      created_at: blocker.created_at,
    })),
  };
}

function parseFeature(row: any): Feature {
  return {
    id: row.id,
    project_id: row.project_id,
    name: row.name,
    description: row.description,
    status: row.status,
    priority: row.priority,
    category: row.category,
    dependencies: typeof row.dependencies === 'string' ? JSON.parse(row.dependencies) : row.dependencies,
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// ============ Stats Functions ============

export interface ProjectStats {
  total_features: number;
  by_status: Record<string, number>;
  by_priority: Record<string, number>;
  active_blockers: number;
  recent_implementations: number;
}

/**
 * Get project statistics
 */
export async function getProjectStats(projectId?: string): Promise<ProjectStats> {
  let whereClause = '';
  const params: any[] = [];
  
  if (projectId) {
    whereClause = 'WHERE project_id = $1';
    params.push(projectId);
  }
  
  // Get feature counts by status
  const statusResult = await query(`
    SELECT status, COUNT(*) as count 
    FROM features ${whereClause}
    GROUP BY status
  `, params);
  
  const by_status: Record<string, number> = {
    'planned': 0,
    'in-progress': 0,
    'completed': 0,
    'blocked': 0
  };
  let total_features = 0;
  for (const row of statusResult.rows) {
    by_status[row.status] = parseInt(row.count);
    total_features += parseInt(row.count);
  }
  
  // Get feature counts by priority
  const priorityResult = await query(`
    SELECT priority, COUNT(*) as count 
    FROM features ${whereClause}
    GROUP BY priority
  `, params);
  
  const by_priority: Record<string, number> = {
    'low': 0,
    'medium': 0,
    'high': 0,
    'critical': 0
  };
  for (const row of priorityResult.rows) {
    by_priority[row.priority] = parseInt(row.count);
  }
  
  // Get active blockers count
  const blockersResult = await query(`
    SELECT COUNT(*) as count 
    FROM blockers b
    JOIN features f ON b.feature_id = f.id
    ${projectId ? 'WHERE f.project_id = $1 AND' : 'WHERE'} b.resolved_at IS NULL
  `, params);
  
  const active_blockers = parseInt(blockersResult.rows[0]?.count || '0');
  
  // Get recent implementations (last 7 days)
  const implResult = await query(`
    SELECT COUNT(*) as count 
    FROM implementations i
    JOIN features f ON i.feature_id = f.id
    ${projectId ? 'WHERE f.project_id = $1 AND' : 'WHERE'} i.created_at > NOW() - INTERVAL '7 days'
  `, params);
  
  const recent_implementations = parseInt(implResult.rows[0]?.count || '0');
  
  return {
    total_features,
    by_status,
    by_priority,
    active_blockers,
    recent_implementations,
  };
}

// ============ Blocker Functions ============

export interface Blocker {
  id: string;
  feature_id: string;
  feature_name?: string;
  description: string;
  severity: string;
  resolved_at: string | null;
  resolution: string | null;
  created_at: string;
}

/**
 * Get blockers
 */
export async function getBlockers(projectId?: string, includeResolved = false): Promise<Blocker[]> {
  let sql = `
    SELECT b.*, f.name as feature_name
    FROM blockers b
    JOIN features f ON b.feature_id = f.id
  `;
  
  const conditions: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;
  
  if (projectId) {
    conditions.push(`f.project_id = $${paramIndex++}`);
    params.push(projectId);
  }
  
  if (!includeResolved) {
    conditions.push('b.resolved_at IS NULL');
  }
  
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  
  sql += ' ORDER BY b.created_at DESC';
  
  const result = await query(sql, params);
  return result.rows;
}

// ============ Implementation Functions ============

export interface Implementation {
  id: string;
  feature_id: string;
  feature_name?: string;
  file_path: string;
  change_type: string;
  description: string | null;
  created_at: string;
}

/**
 * Get implementation history
 */
export async function getImplementationHistory(projectId?: string): Promise<Implementation[]> {
  let sql = `
    SELECT i.*, f.name as feature_name
    FROM implementations i
    JOIN features f ON i.feature_id = f.id
  `;
  
  const params: any[] = [];
  
  if (projectId) {
    sql += ' WHERE f.project_id = $1';
    params.push(projectId);
  }
  
  sql += ' ORDER BY i.created_at DESC LIMIT 50';
  
  const result = await query(sql, params);
  return result.rows;
}
