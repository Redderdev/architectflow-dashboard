/**
 * Server-side API Keys library
 * Direct PostgreSQL access for generating/managing keys
 * This file runs ONLY on the server
 */

import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { queryAll, queryOne, query } from './db-cloud';

/**
 * Generate a secure API key (40 character hex)
 */
function generateApiKeySecret(): { key: string; hash: string } {
  const key = randomBytes(20).toString('hex').substring(0, 40);
  const hash = bcrypt.hashSync(key, 10);
  return { key, hash };
}

/**
 * Create a new API key
 */
export async function createApiKey(params: {
  userId: string;
  label: string;
  planTier?: string;
}): Promise<{
  id: string;
  key: string;
  label: string;
  createdAt: string;
}> {
  const { key, hash } = generateApiKeySecret();
  
  const result = await query(
    `INSERT INTO api_keys (user_id, key_hash, label, plan_tier, created_at, revoked)
     VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, FALSE)
     RETURNING id, label, created_at`,
    [params.userId, hash, params.label, params.planTier || 'free']
  );
  
  if (result.rows.length === 0) {
    throw new Error('Failed to create API key');
  }
  
  const row = result.rows[0];
  
  return {
    id: row.id,
    key,
    label: row.label,
    createdAt: row.created_at,
  };
}

/**
 * List API keys for user
 */
export async function listApiKeysByUserId(userId: string): Promise<
  Array<{
    id: string;
    label: string;
    lastUsed: string | null;
    createdAt: string;
    revoked: boolean;
    planTier: string;
  }>
> {
  const result = await queryAll(
    `SELECT id, label, last_used_at, created_at, revoked, plan_tier
     FROM api_keys
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
  
  return result.map((row: any) => ({
    id: row.id,
    label: row.label,
    lastUsed: row.last_used_at,
    createdAt: row.created_at,
    revoked: row.revoked,
    planTier: row.plan_tier,
  }));
}

/**
 * Revoke an API key
 */
export async function revokeApiKey(userId: string, keyId: string): Promise<boolean> {
  const result = await query(
    `UPDATE api_keys SET revoked = TRUE
     WHERE id = $1 AND user_id = $2`,
    [keyId, userId]
  );
  
  return (result.rowCount ?? 0) > 0;
}

/**
 * Validate API key and get userId
 * (This function is used by the MCP server)
 */
export async function validateApiKeyAndGetUserId(
  keyHash: string
): Promise<string | null> {
  try {
    const result = await queryOne(
      `SELECT user_id FROM api_keys
       WHERE key_hash = $1 AND revoked = FALSE`,
      [keyHash]
    );
    
    if (!result) {
      return null;
    }
    
    // Update last_used_at
    await query(
      `UPDATE api_keys SET last_used_at = CURRENT_TIMESTAMP WHERE key_hash = $1`,
      [keyHash]
    );
    
    return result.user_id;
  } catch (error) {
    console.error('Error validating API key:', error);
    return null;
  }
}
