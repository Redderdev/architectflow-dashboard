/**
 * API route: DELETE /api/keys/[id] - Revoke an API key
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth-utils';

let apiKeyTools: any = null;

async function getApiKeyTools() {
  if (!apiKeyTools) {
    const module = await import('@/lib/api-keys-server');
    apiKeyTools = module;
  }
  return apiKeyTools;
}

export const dynamic = 'force-dynamic';

/**
 * DELETE /api/keys/[id] - Revoke an API key
 */
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const userId = getUserIdFromRequest(request);
    const keyId = params.id;
    
    const tools = await getApiKeyTools();
    const success = await tools.revokeApiKey(userId, keyId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'API key not found or already revoked' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'API key revoked',
    });
  } catch (error) {
    console.error('Failed to revoke API key:', error);
    return NextResponse.json(
      { error: 'Failed to revoke API key' },
      { status: 500 }
    );
  }
}
