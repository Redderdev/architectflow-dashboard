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

export function getProjectStats(): ProjectStats {
  const db = getDatabase();
  
  // Get status counts
  const statusRows = db.prepare(`
    SELECT status, COUNT(*) as count 
    FROM features 
    GROUP BY status
  `).all() as { status: string; count: number }[];
  
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
    GROUP BY priority
  `).all() as { priority: string; count: number }[];
  
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

export function getAllFeatures(): Feature[] {
  const db = getDatabase();
  const rows = db.prepare(`
    SELECT * FROM features 
    ORDER BY 
      CASE priority 
        WHEN 'critical' THEN 1 
        WHEN 'high' THEN 2 
        WHEN 'medium' THEN 3 
        WHEN 'low' THEN 4 
        ELSE 5
      END,
      updated_at DESC
  `).all();
  
  return rows.map((row: any) => ({
    ...row,
    dependencies: row.dependencies ? JSON.parse(row.dependencies) : [],
    tags: row.tags ? JSON.parse(row.tags) : [],
  }));
}

export function getFeaturesByStatus(status: string): Feature[] {
  const db = getDatabase();
  const rows = db.prepare(`
    SELECT * FROM features 
    WHERE status = ?
    ORDER BY 
      CASE priority 
        WHEN 'critical' THEN 1 
        WHEN 'high' THEN 2 
        WHEN 'medium' THEN 3 
        WHEN 'low' THEN 4 
        ELSE 5
      END,
      updated_at DESC
  `).all(status);
  
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

export function getImplementationHistory() {
  const db = getDatabase();
  const rows = db.prepare(`
    SELECT 
      i.*,
      f.name as feature_name
    FROM implementations i
    LEFT JOIN features f ON i.feature_id = f.id
    ORDER BY i.created_at DESC
  `).all();
  
  return rows;
}
