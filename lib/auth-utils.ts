/**
 * Authentication utilities for Dashboard
 * Extract userId from Auth0 JWT tokens or use session/env fallback
 */

import { NextRequest } from 'next/server';

/**
 * Extract userId from Auth0 JWT token in Authorization header
 * OR use TEST_USER_ID environment variable for development
 * OR use localStorage userId from client
 */
export function getUserIdFromRequest(request: NextRequest): string {
  // Priority 1: Auth0 JWT token in Authorization header
  const authHeader = request.headers.get('authorization');
  
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.substring(7);
      const parts = token.split('.');
      
      if (parts.length === 3) {
        let payload = parts[1];
        while (payload.length % 4 !== 0) {
          payload += '=';
        }
        payload = payload.replace(/-/g, '+').replace(/_/g, '/');
        
        const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
        
        if (decoded.sub) {
          console.log(`[Auth] Extracted userId from JWT: ${decoded.sub}`);
          return decoded.sub;
        }
      }
    } catch (error) {
      console.warn('[Auth] Failed to decode JWT, trying fallback');
    }
  }

  // Priority 2: TEST_USER_ID for development/testing
  if (process.env.TEST_USER_ID) {
    console.log(`[Auth] Using TEST_USER_ID: ${process.env.TEST_USER_ID}`);
    return process.env.TEST_USER_ID;
  }

  // Priority 3: X-User-ID header (for testing)
  const userIdHeader = request.headers.get('x-user-id');
  if (userIdHeader) {
    console.log(`[Auth] Using X-User-ID header: ${userIdHeader}`);
    return userIdHeader;
  }

  console.warn('[Auth] No userId found, using default');
  return 'demo-user';
}
