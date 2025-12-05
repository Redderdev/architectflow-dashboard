/**
 * Authentication utilities for Dashboard
 * Extract userId from Auth0 JWT tokens
 */

import { NextRequest } from 'next/server';

/**
 * Extract userId from Auth0 JWT token in Authorization header
 * Auth0 tokens have format: Bearer <jwt>
 * JWT payload contains 'sub' claim with user ID (auth0|xxxxx)
 */
export function getUserIdFromRequest(request: NextRequest): string {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    console.warn('No Authorization header found, using demo-user fallback');
    return 'demo-user';
  }

  try {
    const token = authHeader.substring(7); // Remove "Bearer " prefix
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      console.error('Invalid JWT format: expected 3 parts, got', parts.length);
      return 'demo-user';
    }
    
    // Decode JWT payload (second part)
    let payload = parts[1];
    
    // Add padding if needed
    while (payload.length % 4 !== 0) {
      payload += '=';
    }
    
    // Convert base64url to base64
    payload = payload.replace(/-/g, '+').replace(/_/g, '/');
    
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
    
    // Auth0 uses 'sub' claim for user ID
    if (decoded.sub) {
      console.log(`[Auth] Extracted userId: ${decoded.sub}`);
      return decoded.sub;
    }
    
    console.warn('[Auth] No sub claim in JWT, using fallback');
    return 'demo-user';
  } catch (error) {
    console.error('[Auth] Failed to decode JWT:', error);
    return 'demo-user';
  }
}
