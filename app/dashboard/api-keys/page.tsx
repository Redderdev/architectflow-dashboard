'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';

interface ApiKey {
  id: string;
  label: string;
  createdAt: string;
  lastUsed: string | null;
  revoked: boolean;
  planTier: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewKey, setShowNewKey] = useState(false);
  const [newKeyLabel, setNewKeyLabel] = useState('');
  const [newKey, setNewKey] = useState<{ key: string; id: string; label: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Fetch keys on mount
  useEffect(() => {
    fetchKeys();
  }, []);

  async function fetchKeys() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/keys');
      if (!response.ok) throw new Error('Failed to fetch keys');
      const data = await response.json();
      setKeys(data.keys);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateKey() {
    if (!newKeyLabel.trim()) {
      setError('Please enter a label');
      return;
    }

    try {
      setError(null);
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: newKeyLabel }),
      });

      if (!response.ok) throw new Error('Failed to generate key');
      const data = await response.json();

      setNewKey({ key: data.key, id: data.id, label: data.label });
      setNewKeyLabel('');
      
      // Refresh list
      await fetchKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }

  async function handleRevoke(id: string) {
    if (!confirm('Revoke this API key? It will no longer work.')) {
      return;
    }

    try {
      const response = await fetch(`/api/keys/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to revoke key');
      
      setKeys(keys.filter(k => k.id !== id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }

  function copyToClipboard() {
    if (newKey?.key) {
      navigator.clipboard.writeText(newKey.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <AppShell active="api-keys">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="border-b p-6">
            <h1 className="text-3xl font-bold mb-2">API Keys</h1>
            <p className="text-gray-600">
              Create and manage API keys to authenticate programmatic requests to ArchitectFlow
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
              {error}
            </div>
          )}

          {/* New Key Alert */}
          {newKey && (
            <div className="mx-6 mt-6 p-4 bg-green-50 border border-green-200 rounded">
              <h3 className="font-semibold text-green-900 mb-2">✓ API Key Created</h3>
              <p className="text-sm text-green-800 mb-3">
                Save your API key now. You won't be able to see it again.
              </p>
              <div className="flex items-center gap-2 mb-3">
                <code className="flex-1 p-2 bg-white border rounded font-mono text-sm overflow-x-auto">
                  {newKey.key}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <button
                onClick={() => setNewKey(null)}
                className="text-sm text-green-700 hover:text-green-900 font-semibold"
              >
                Done
              </button>
            </div>
          )}

          {/* Generate Form */}
          {showNewKey && !newKey && (
            <div className="mx-6 mt-6 p-4 border rounded bg-gray-50">
              <h3 className="font-semibold mb-3">Create New API Key</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., 'Production API', 'Testing', 'CI/CD Pipeline'"
                  value={newKeyLabel}
                  onChange={(e) => setNewKeyLabel(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  onClick={handleGenerateKey}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
                >
                  Generate
                </button>
                <button
                  onClick={() => {
                    setShowNewKey(false);
                    setNewKeyLabel('');
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* CTA Button */}
          {!showNewKey && !newKey && (
            <div className="p-6 border-b">
              <button
                onClick={() => setShowNewKey(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                + Generate New API Key
              </button>
            </div>
          )}

          {/* Keys List */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading keys...</div>
            ) : keys.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No API keys yet. Create one to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {keys.map((key) => (
                  <div key={key.id} className="p-4 border rounded hover:bg-gray-50 flex justify-between items-center">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{key.label}</h4>
                      <div className="text-sm text-gray-600 mt-1">
                        Created: {new Date(key.createdAt).toLocaleDateString()}
                        {key.lastUsed && ` • Last used: ${new Date(key.lastUsed).toLocaleDateString()}`}
                      </div>
                      {key.revoked && (
                        <div className="text-sm text-red-600 mt-1">Revoked</div>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mb-3">
                        {key.planTier}
                      </span>
                      {!key.revoked && (
                        <button
                          onClick={() => handleRevoke(key.id)}
                          className="ml-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded font-semibold text-sm"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Usage Info */}
          <div className="bg-blue-50 p-6 border-t">
            <h3 className="font-semibold text-blue-900 mb-2">How to Use Your API Key</h3>
            <p className="text-sm text-blue-800 mb-4">
              Include your API key in the Authorization header:
            </p>
            <code className="block p-3 bg-white border border-blue-200 rounded text-sm font-mono overflow-x-auto">
              curl -H "Authorization: Bearer YOUR_API_KEY" https://api.architectflow.dev/sse
            </code>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
