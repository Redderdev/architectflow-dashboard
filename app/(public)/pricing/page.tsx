import Link from 'next/link';

export default function PricingPage() {
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
              Home
            </Link>
            <Link href="/docs" className="hover:text-blue-600">
              Docs
            </Link>
            <Link href="/api/auth/login" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
              Login
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2 text-center">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Pay only for what you use. Scale as you grow. No hidden fees.
        </p>

        {/* Pricing Table */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Free Tier */}
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition">
            <div className="p-8 border-b">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-gray-600 mb-6">Perfect for getting started</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-sm text-gray-600">1,000 API calls/month</p>
            </div>

            <div className="p-8">
              <h4 className="font-bold mb-4">What's included:</h4>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>1 project</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Unlimited features & blockers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>1,000 API calls/month</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Community support</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Public API documentation</span>
                </li>
              </ul>
              <button className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold">
                Get Started
              </button>
            </div>
          </div>

          {/* Pro Tier */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg border-2 border-blue-600 transform scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
              Most Popular
            </div>
            <div className="p-8 border-b border-blue-300">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-gray-700 mb-6">For growing teams</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-600">$29</span>
                <span className="text-gray-700">/month</span>
              </div>
              <p className="text-sm text-gray-700">50,000 API calls/month</p>
            </div>

            <div className="p-8">
              <h4 className="font-bold mb-4">Everything in Free, plus:</h4>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Unlimited projects</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>50,000 API calls/month</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Email support (48h response)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Advanced analytics dashboard</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>API usage alerts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Custom integrations</span>
                </li>
              </ul>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                Start Free Trial (14 days)
              </button>
            </div>
          </div>

          {/* Business Tier */}
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition">
            <div className="p-8 border-b">
              <h3 className="text-2xl font-bold mb-2">Business</h3>
              <p className="text-gray-600 mb-6">For enterprises</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">Custom</span>
              </div>
              <p className="text-sm text-gray-600">500,000+ API calls/month</p>
            </div>

            <div className="p-8">
              <h4 className="font-bold mb-4">Everything in Pro, plus:</h4>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>500,000+ API calls/month</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Priority support (4h response)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>SLA guarantee (99.9%)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Custom workflows & integrations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>On-premise deployment option</span>
                </li>
              </ul>
              <button className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold">
                Contact Sales
              </button>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <section className="bg-white rounded-lg shadow p-8">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-2">What counts as an API call?</h3>
              <p className="text-gray-700">
                Each request to ArchitectFlow counts as one API call. This includes feature creation,
                queries, updates, and all MCP tool invocations. Requests within the same minute may be
                batched at our discretion.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Do unused calls roll over?</h3>
              <p className="text-gray-700">
                No, usage resets at the beginning of each billing period. We recommend monitoring your
                usage via the dashboard to avoid surprises. Upgrades take effect immediately.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Can I upgrade or downgrade anytime?</h3>
              <p className="text-gray-700">
                Yes! Upgrade immediately. Downgrades take effect at the start of your next billing period.
                Pro-rata credits are available when downgrading mid-cycle.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Do you offer annual plans?</h3>
              <p className="text-gray-700">
                Contact our sales team for annual or custom billing options. Enterprise customers often
                receive 20-30% discounts for annual commitments.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">What happens if I exceed my limit?</h3>
              <p className="text-gray-700">
                You'll receive a 429 (Too Many Requests) error. Free plans can upgrade to Pro immediately.
                Pro/Business plans should contact support for a temporary increase.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Is there a free trial for Pro?</h3>
              <p className="text-gray-700">
                Yes! Get 14 days of Pro features free. No credit card required to start. We'll send a
                reminder before your trial ends.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
