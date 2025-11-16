/**
 * Database client for ArchitectFlow
 * Reads from the MCP Server's SQLite database
 */

import Database from 'better-sqlite3';
import path from 'path';

// Path to the MCP server's database
const DB_PATH = path.join(process.cwd(), '../ArchitectFlow/architectflow.db');

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH, { readonly: true });
  }
  return db;
}

export interface Feature {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  status: 'planned' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string | null;
  dependencies: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Implementation {
  id: string;
  feature_id: string;
  files_affected: string[];
  patterns_used: string[];
  notes: string | null;
  implementer: string | null;
  created_at: string;
}

export interface ProjectStats {
  total_features: number;
  by_status: {
    planned: number;
    'in-progress': number;
    completed: number;
    blocked: number;
  };
  by_priority: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export function getProjectStats(projectId?: string): ProjectStats {
  const db = getDatabase();
  
  const whereClause = projectId ? 'WHERE project_id = ?' : '';
  const params = projectId ? [projectId] : [];
  
  // Get status counts
  const statusRows = db.prepare(`
    SELECT status, COUNT(*) as count 
    FROM features 
    ${whereClause}
    GROUP BY status
  `).all(...params) as { status: string; count: number }[];
  
  const by_status = {
    planned: 0,
    'in-progress': 0,
    completed: 0,
    blocked: 0,
  };
  
  let total = 0;
  statusRows.forEach(row => {
    by_status[row.status as keyof typeof by_status] = row.count;
    total += row.count;
  });
  
  // Get priority counts
  const priorityRows = db.prepare(`
    SELECT priority, COUNT(*) as count 
    FROM features 
    ${whereClause}
    GROUP BY priority
  `).all(...params) as { priority: string; count: number }[];
  
  const by_priority = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  };
  
  priorityRows.forEach(row => {
    by_priority[row.priority as keyof typeof by_priority] = row.count;
  });
  
  return {
    total_features: total,
    by_status,
    by_priority,
  };
}

export function getAllFeatures(projectId?: string): Feature[] {
  const db = getDatabase();
  const whereClause = projectId ? 'WHERE project_id = ?' : '';
  const params = projectId ? [projectId] : [];
  
  const rows = db.prepare(`
    SELECT * FROM features 
    ${whereClause}
    ORDER BY 
      CASE priority 
        WHEN 'critical' THEN 1 
        WHEN 'high' THEN 2 
        WHEN 'medium' THEN 3 
        WHEN 'low' THEN 4 
        ELSE 5
      END,
      updated_at DESC
  `).all(...params);
  
  return rows.map((row: any) => ({
    ...row,
    dependencies: row.dependencies ? JSON.parse(row.dependencies) : [],
    tags: row.tags ? JSON.parse(row.tags) : [],
  }));
}

export function getFeaturesByStatus(status: string, projectId?: string): Feature[] {
  const db = getDatabase();
  const whereClause = projectId ? 'WHERE status = ? AND project_id = ?' : 'WHERE status = ?';
  const params = projectId ? [status, projectId] : [status];
  
  const rows = db.prepare(`
    SELECT * FROM features 
    ${whereClause}
    ORDER BY 
      CASE priority 
        WHEN 'critical' THEN 1 
        WHEN 'high' THEN 2 
        WHEN 'medium' THEN 3 
        WHEN 'low' THEN 4 
        ELSE 5
      END,
      updated_at DESC
  `).all(...params);
  
  return rows.map((row: any) => ({
    ...row,
    dependencies: row.dependencies ? JSON.parse(row.dependencies) : [],
    tags: row.tags ? JSON.parse(row.tags) : [],
  }));
}

export function getRecentImplementations(limit: number = 10): Implementation[] {
  const db = getDatabase();
  const rows = db.prepare(`
    SELECT * FROM implementations 
    ORDER BY created_at DESC 
    LIMIT ?
  `).all(limit);
  
  return rows.map((row: any) => ({
    ...row,
    files_affected: JSON.parse(row.files_affected),
    patterns_used: row.patterns_used ? JSON.parse(row.patterns_used) : [],
  }));
}

export function getImplementationHistory(projectId?: string) {
  const db = getDatabase();
  
  let query = `
    SELECT 
      i.*,
      f.name as feature_name,
      f.project_id
    FROM implementations i
    LEFT JOIN features f ON i.feature_id = f.id
  `;
  
  const params: any[] = [];
  
  if (projectId) {
    query += ' WHERE f.project_id = ?';
    params.push(projectId);
  }
  
  query += ' ORDER BY i.created_at DESC';
  
  const rows = db.prepare(query).all(...params);
  
  return rows;
}

export interface Blocker {
  id: string;
  feature_id: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved';
  resolution_notes: string | null;
  created_at: string;
  resolved_at: string | null;
  feature_name?: string;
}

export function getBlockers(projectId?: string, includeResolved: boolean = false): Blocker[] {
  const db = getDatabase();
  
  let query = `
    SELECT 
      b.*,
      f.name as feature_name
    FROM blockers b
    LEFT JOIN features f ON b.feature_id = f.id
  `;
  
  const conditions: string[] = [];
  const params: any[] = [];
  
  if (projectId) {
    conditions.push('f.project_id = ?');
    params.push(projectId);
  }
  
  if (!includeResolved) {
    conditions.push("b.status != 'resolved'");
  }
  
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  
  query += ` ORDER BY 
    CASE b.severity 
      WHEN 'critical' THEN 1 
      WHEN 'high' THEN 2 
      WHEN 'medium' THEN 3 
      WHEN 'low' THEN 4 
    END,
    b.created_at DESC
  `;
  
  const rows = db.prepare(query).all(...params);
  return rows as Blocker[];
}

export function getFeatureWithDetails(featureId: string) {
  const db = getDatabase();
  
  // Get feature
  const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(featureId) as any;
  if (!feature) return null;
  
  // Parse JSON fields
  feature.dependencies = feature.dependencies ? JSON.parse(feature.dependencies) : [];
  feature.tags = feature.tags ? JSON.parse(feature.tags) : [];
  
  // Get implementations
  const implementations = db.prepare(`
    SELECT * FROM implementations 
    WHERE feature_id = ? 
    ORDER BY created_at DESC
  `).all(featureId);
  
  // Get blockers
  const blockers = db.prepare(`
    SELECT * FROM blockers 
    WHERE feature_id = ? AND status != 'resolved'
    ORDER BY created_at DESC
  `).all(featureId);
  
  return {
    ...feature,
    implementations: implementations.map((impl: any) => ({
      ...impl,
      files_affected: JSON.parse(impl.files_affected),
      patterns_used: impl.patterns_used ? JSON.parse(impl.patterns_used) : [],
    })),
    blockers,
  };
}
