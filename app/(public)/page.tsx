import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      {/* Navigation */}
      <nav className="border-b border-blue-400 border-opacity-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">ArchitectFlow</div>
          <div className="space-x-6">
            <Link href="/docs" className="hover:text-blue-100">
              Docs
            </Link>
            <Link href="/pricing" className="hover:text-blue-100">
              Pricing
            </Link>
            <Link href="/api/auth/login" className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-semibold">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold mb-6">
            Intelligent Project Architecture & State Management
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            ArchitectFlow helps AI agents and teams understand complex codebases, plan features,
            and track implementation progress in real-time.
          </p>
          <div className="flex gap-4">
            <Link href="/api/auth/login?screen_hint=signup" className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-semibold text-lg">
              Get Started Free
            </Link>
            <Link href="/docs" className="px-8 py-3 border-2 border-white rounded-lg hover:bg-white hover:text-blue-600 font-semibold text-lg">
              Read Docs
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="bg-white text-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <h2 className="text-4xl font-bold mb-16 text-center">Why Use ArchitectFlow?</h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            {/* Prop 1 */}
            <div>
              <div className="text-4xl mb-4">🏗️</div>
              <h3 className="text-2xl font-bold mb-3">Understand Architecture</h3>
              <p className="text-gray-600">
                AI agents instantly understand your project structure, tech stack, and dependencies.
                No more context switching or document hunting.
              </p>
            </div>

            {/* Prop 2 */}
            <div>
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-3">Track Everything</h3>
              <p className="text-gray-600">
                Features, blockers, implementations, and dependencies all in one place.
                Real-time visibility into project state.
              </p>
            </div>

            {/* Prop 3 */}
            <div>
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-3">Work Smarter</h3>
              <p className="text-gray-600">
                Let AI handle the boilerplate. Define architecture once, let agents execute with confidence.
                Focus on decisions, not details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold mb-16 text-center">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-12">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
              1
            </div>
            <h3 className="text-2xl font-bold mb-3">Define Your Architecture</h3>
            <p className="text-blue-100">
              Tell ArchitectFlow about your project structure, tech stack, and patterns.
              Create features, set dependencies, and plan the roadmap.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
              2
            </div>
            <h3 className="text-2xl font-bold mb-3">Connect Your AI</h3>
            <p className="text-blue-100">
              Use our API to connect Claude, ChatGPT, or other AI agents.
              They instantly get full context about your project.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
              3
            </div>
            <h3 className="text-2xl font-bold mb-3">Build Confidently</h3>
            <p className="text-blue-100">
              AI agents know your architecture and can implement features without breaking existing code.
              Track progress in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="bg-white text-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <h2 className="text-4xl font-bold mb-16 text-center">Simple Pricing</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <div className="border rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-gray-600 mb-6">Perfect for getting started</p>
              <div className="text-3xl font-bold mb-6">1,000<span className="text-lg text-gray-600">/mo</span></div>
              <ul className="space-y-3 mb-8">
                <li>✓ 1 project</li>
                <li>✓ Unlimited features & blockers</li>
                <li>✓ 1,000 API calls/month</li>
                <li>✓ Community support</li>
              </ul>
              <button className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold">
                Get Started
              </button>
            </div>

            {/* Pro Tier */}
            <div className="border-2 border-blue-600 rounded-lg p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded text-sm font-semibold">
                Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-gray-600 mb-6">For growing teams</p>
              <div className="text-3xl font-bold mb-6">$29<span className="text-lg text-gray-600">/mo</span></div>
              <ul className="space-y-3 mb-8">
                <li>✓ Unlimited projects</li>
                <li>✓ Unlimited features & blockers</li>
                <li>✓ 50,000 API calls/month</li>
                <li>✓ Email support</li>
                <li>✓ Advanced analytics</li>
              </ul>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                Start Pro Trial
              </button>
            </div>

            {/* Business Tier */}
            <div className="border rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-2">Business</h3>
              <p className="text-gray-600 mb-6">For enterprises</p>
              <div className="text-3xl font-bold mb-6">Custom</div>
              <ul className="space-y-3 mb-8">
                <li>✓ Everything in Pro</li>
                <li>✓ 500,000+ API calls/month</li>
                <li>✓ Priority support</li>
                <li>✓ SLA guarantee</li>
                <li>✓ Custom integrations</li>
              </ul>
              <button className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-bold mb-8">Ready to Transform Your Development?</h2>
        <p className="text-xl text-blue-100 mb-8">
          Start free today. Scale as you grow.
        </p>
        <Link href="/api/auth/login?screen_hint=signup" className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-bold text-lg">
          Create Free Account →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-400 border-opacity-30">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center text-blue-100">
          <p>&copy; 2025 ArchitectFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
