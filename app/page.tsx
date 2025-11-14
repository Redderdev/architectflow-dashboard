import Link from 'next/link'
import { LayoutDashboard, ListTodo, Clock, BarChart3 } from 'lucide-react'
import { getProjectStats, getRecentImplementations } from '@/lib/db'
import StatusCard from '@/components/StatusCard'
import RecentActivity from '@/components/RecentActivity'

export const dynamic = 'force-dynamic'

export default function Home() {
  const stats = getProjectStats()
  const recentImpls = getRecentImplementations(5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">ArchitectFlow</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">AI Project Architecture Dashboard</p>
              </div>
            </div>
            <nav className="flex space-x-4">
              <Link 
                href="/" 
                className="px-4 py-2 text-blue-600 dark:text-blue-400 font-medium"
              >
                Dashboard
              </Link>
              <Link 
                href="/features" 
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Features
              </Link>
              <Link 
                href="/timeline" 
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Timeline
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatusCard
            title="Total Features"
            value={stats.total_features}
            icon={<ListTodo className="w-6 h-6" />}
            color="blue"
          />
          <StatusCard
            title="In Progress"
            value={stats.by_status['in-progress']}
            icon={<Clock className="w-6 h-6" />}
            color="yellow"
          />
          <StatusCard
            title="Completed"
            value={stats.by_status.completed}
            icon={<BarChart3 className="w-6 h-6" />}
            color="green"
          />
          <StatusCard
            title="Blocked"
            value={stats.by_status.blocked}
            icon={<ListTodo className="w-6 h-6" />}
            color="red"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Status Breakdown</h2>
            <div className="space-y-4">
              <StatusBar label="Planned" value={stats.by_status.planned} total={stats.total_features} color="bg-slate-500" />
              <StatusBar label="In Progress" value={stats.by_status['in-progress']} total={stats.total_features} color="bg-yellow-500" />
              <StatusBar label="Completed" value={stats.by_status.completed} total={stats.total_features} color="bg-green-500" />
              <StatusBar label="Blocked" value={stats.by_status.blocked} total={stats.total_features} color="bg-red-500" />
            </div>
          </div>

          {/* Priority Breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Priority Breakdown</h2>
            <div className="space-y-4">
              <StatusBar label="Critical" value={stats.by_priority.critical} total={stats.total_features} color="bg-red-600" />
              <StatusBar label="High" value={stats.by_priority.high} total={stats.total_features} color="bg-orange-500" />
              <StatusBar label="Medium" value={stats.by_priority.medium} total={stats.total_features} color="bg-blue-500" />
              <StatusBar label="Low" value={stats.by_priority.low} total={stats.total_features} color="bg-slate-400" />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6">
          <RecentActivity implementations={recentImpls} />
        </div>
      </main>
    </div>
  )
}

function StatusBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const percentage = total > 0 ? (value / total) * 100 : 0
  
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
        <span className="text-sm text-slate-600 dark:text-slate-400">{value} ({percentage.toFixed(0)}%)</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
        <div 
          className={`${color} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
