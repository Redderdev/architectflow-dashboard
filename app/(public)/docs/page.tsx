import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            ArchitectFlow
          </Link>
          <div className="space-x-6">
            <Link href="/" className="hover:text-blue-600">
              Back to Home
            </Link>
            <Link href="/pricing" className="hover:text-blue-600">
              Pricing
            </Link>
            <Link href="/api/auth/login" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
              Login
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Documentation</h1>

        {/* Quickstart */}
        <section className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4">Quickstart</h2>
          
          <h3 className="text-xl font-bold mt-6 mb-3">1. Get Your API Key</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6">
            <li><Link href="/api/auth/login?screen_hint=signup" className="text-blue-600 hover:underline">Create an account</Link></li>
            <li>Go to Settings → API Keys</li>
            <li>Click "Generate New API Key"</li>
            <li>Save your key (you'll only see it once!)</li>
          </ol>

          <h3 className="text-xl font-bold mt-6 mb-3">2. Connect to ArchitectFlow</h3>
          
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto mb-4">
            <pre>{`curl -X GET \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.architectflow.dev/sse`}</pre>
          </div>

          <h3 className="text-xl font-bold mt-6 mb-3">3. Use with Claude</h3>
          <p className="text-gray-700 mb-3">
            Add this to your Claude projects (via <code className="bg-gray-100 px-2 py-1 rounded">claude_desktop_config.json</code>):
          </p>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
            <pre>{`{
  "mcpServers": {
    "architectflow": {
      "command": "mcp-client",
      "args": ["--api-key", "YOUR_API_KEY"],
      "disabled": false
    }
  }
}`}</pre>
          </div>
        </section>

        {/* API Reference */}
        <section className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4">API Reference</h2>

          <h3 className="text-xl font-bold mt-6 mb-3">Authentication</h3>
          <p className="text-gray-700 mb-3">
            Include your API key in the <code className="bg-gray-100 px-2 py-1 rounded">Authorization</code> header:
          </p>
          <div className="bg-gray-100 p-3 rounded text-sm font-mono mb-6">
            Authorization: Bearer &lt;your-api-key&gt;
          </div>

          <h3 className="text-xl font-bold mt-6 mb-3">Endpoints</h3>
          
          <div className="space-y-6">
            {/* Feature Endpoints */}
            <div className="border-l-4 border-blue-600 pl-4">
              <h4 className="font-bold text-lg mb-2">Features</h4>
              <ul className="space-y-2 text-gray-700">
                <li><code className="bg-gray-100 px-2 py-1 rounded">createFeature</code> - Create a new feature</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">getFeatureList</code> - List features with filters</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">updateFeatureStatus</code> - Update feature status</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">searchFeatures</code> - Fuzzy search features</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">getFeatureByName</code> - Find feature by exact name</li>
              </ul>
            </div>

            {/* Project Endpoints */}
            <div className="border-l-4 border-green-600 pl-4">
              <h4 className="font-bold text-lg mb-2">Projects</h4>
              <ul className="space-y-2 text-gray-700">
                <li><code className="bg-gray-100 px-2 py-1 rounded">createProject</code> - Create a new project</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">listProjects</code> - List all projects</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">getProjectStatus</code> - Get project overview</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">getProjectOverview</code> - Get complete project context</li>
              </ul>
            </div>

            {/* Blocker Endpoints */}
            <div className="border-l-4 border-red-600 pl-4">
              <h4 className="font-bold text-lg mb-2">Blockers</h4>
              <ul className="space-y-2 text-gray-700">
                <li><code className="bg-gray-100 px-2 py-1 rounded">reportBlocker</code> - Report a blocking issue</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">getBlockers</code> - List blockers for a feature</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">resolveBlocker</code> - Mark blocker as resolved</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Examples */}
        <section className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4">Code Examples</h2>

          <h3 className="text-xl font-bold mt-6 mb-3">Node.js / JavaScript</h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto mb-6">
            <pre>{`const apiKey = 'your_api_key_here';

const response = await fetch('https://api.architectflow.dev/sse', {
  method: 'GET',
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`}</pre>
          </div>

          <h3 className="text-xl font-bold mt-6 mb-3">Python</h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto mb-6">
            <pre>{`import requests

api_key = 'your_api_key_here'
headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://api.architectflow.dev/sse',
    headers=headers
)

print(response.json())`}</pre>
          </div>

          <h3 className="text-xl font-bold mt-6 mb-3">cURL</h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
            <pre>{`curl -X GET \\
  -H "Authorization: Bearer your_api_key_here" \\
  -H "Content-Type: application/json" \\
  https://api.architectflow.dev/sse`}</pre>
          </div>
        </section>

        {/* Rate Limiting */}
        <section className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4">Rate Limiting</h2>
          
          <p className="text-gray-700 mb-4">
            ArchitectFlow implements rate limiting to ensure fair usage. Your limits depend on your plan:
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 border rounded">
              <h4 className="font-bold mb-2">Free Plan</h4>
              <p className="text-gray-700">1,000 requests/month<br/>(~33 per day)</p>
            </div>
            <div className="p-4 border rounded">
              <h4 className="font-bold mb-2">Pro Plan</h4>
              <p className="text-gray-700">50,000 requests/month<br/>(~1,667 per day)</p>
            </div>
            <div className="p-4 border rounded">
              <h4 className="font-bold mb-2">Business Plan</h4>
              <p className="text-gray-700">500,000+ requests/month<br/>(custom limits)</p>
            </div>
          </div>

          <h3 className="text-lg font-bold mb-3">Rate Limit Headers</h3>
          <p className="text-gray-700 mb-3">
            Each response includes rate limit information in the headers:
          </p>
          <div className="bg-gray-100 p-3 rounded text-sm font-mono">
            <div>X-RateLimit-Limit: 100</div>
            <div>X-RateLimit-Remaining: 47</div>
            <div>X-RateLimit-Reset: 2025-01-19T18:45:00Z</div>
          </div>

          <p className="text-gray-700 mt-4">
            When you exceed your limit, you'll receive a <code className="bg-gray-100 px-2 py-1 rounded">429 Too Many Requests</code> response
            with a <code className="bg-gray-100 px-2 py-1 rounded">Retry-After</code> header indicating when you can retry.
          </p>
        </section>

        {/* Support */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="text-gray-700 mb-4">
            Check our <Link href="/" className="text-blue-600 hover:underline">community forum</Link> or
            <a href="mailto:support@architectflow.dev" className="text-blue-600 hover:underline"> contact support</a>.
          </p>
          <p className="text-gray-700">
            Response times depend on your plan - Free: 48h, Pro: 24h, Business: 4h.
          </p>
        </section>
      </div>
    </div>
  );
}
