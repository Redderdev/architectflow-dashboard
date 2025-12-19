/**
 * API route: GET /api/keys - List user's API keys
 * POST /api/keys - Generate a new API key
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth-utils';

// Use dynamic imports to ensure client-side code doesn't run in API routes
let apiKeyTools: any = null;

async function getApiKeyTools() {
  if (!apiKeyTools) {
    // Import server-side API key tools
    const module = await import('@/lib/api-keys-server');
    apiKeyTools = module;
  }
  return apiKeyTools;
}

export const dynamic = 'force-dynamic';

/**
 * GET /api/keys - List all API keys for user
 */
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    const tools = await getApiKeyTools();
    
    const keys = await tools.listApiKeysByUserId(userId);
    
    return NextResponse.json({
      keys,
      count: keys.length,
    });
  } catch (error) {
    console.error('Failed to list API keys:', error);
    return NextResponse.json(
      { error: 'Failed to list API keys' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/keys - Generate a new API key
 */
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    const body = await request.json();
    const { label, planTier } = body;
    
    if (!label || typeof label !== 'string' || label.length < 1 || label.length > 100) {
      return NextResponse.json(
        { error: 'Label is required and must be 1-100 characters' },
        { status: 400 }
      );
    }
    
    const tools = await getApiKeyTools();
    const result = await tools.createApiKey({
      userId,
      label,
      planTier: planTier || 'free',
    });
    
    return NextResponse.json({
      id: result.id,
      key: result.key, // Show only once - user must save it
      label: result.label,
      createdAt: result.createdAt,
      message: 'Save your API key now - you won\'t see it again!',
    });
  } catch (error) {
    console.error('Failed to generate API key:', error);
    return NextResponse.json(
      { error: 'Failed to generate API key' },
      { status: 500 }
    );
  }
}
