/**
 * Client-side dashboard component with project filtering
 */
'use client'

import { useEffect, useState } from 'react'
import { ListTodo, Clock, BarChart3, AlertTriangle, TrendingUp, Layers } from 'lucide-react'
import StatusCard from '@/components/StatusCard'
import BlockersList from '@/components/BlockersList'

interface ProjectStats {
  total_features: number
  by_status: {
    planned: number
    'in-progress': number
    completed: number
    blocked: number
  }
  by_priority: {
    low: number
    medium: number
    high: number
    critical: number
  }
}

export default function DashboardContent() {
  const [stats, setStats] = useState<ProjectStats>({
    total_features: 0,
    by_status: { planned: 0, 'in-progress': 0, completed: 0, blocked: 0 },
    by_priority: { low: 0, medium: 0, high: 0, critical: 0 },
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true)
      try {
        const projectId = localStorage.getItem('architectflow_project_id')
        const url = projectId 
          ? `/api/stats?project_id=${encodeURIComponent(projectId)}`
          : '/api/stats'
        
        const response = await fetch(url)
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Failed to load stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()

    // Reload stats when storage changes (project switch)
    const handleStorageChange = () => {
      loadStats()
    }
    
    window.addEventListener('storage', handleStorageChange)
    // Custom event for same-window updates
    window.addEventListener('projectChanged', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('projectChanged', handleStorageChange)
    }
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page intro */}
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Dashboard</p>
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Guten Tag, Architect!</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Behalte Features, Blocker und Prioritäten im Blick.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200">
              <TrendingUp className="w-4 h-4" />
              Velocity Snapshot
            </span>
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Layers className="w-4 h-4" />
              {stats.total_features} Features
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Features"
          value={stats.total_features}
          accent="from-blue-500 to-blue-600"
          icon={<ListTodo className="w-5 h-5" />}
        />
        <MetricCard
          title="In Progress"
          value={stats.by_status['in-progress']}
          accent="from-amber-400 to-orange-500"
          icon={<Clock className="w-5 h-5" />}
        />
        <MetricCard
          title="Completed"
          value={stats.by_status.completed}
          accent="from-emerald-400 to-emerald-600"
          icon={<BarChart3 className="w-5 h-5" />}
        />
        <MetricCard
          title="Blocked"
          value={stats.by_status.blocked}
          accent="from-red-400 to-red-600"
          icon={<AlertTriangle className="w-5 h-5" />}
        />
      </div>

      {/* Main panels */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Status Overview</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Verteilung aller Features nach Status</p>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Live per Projekt</span>
            </div>
            <div className="space-y-3">
              <StatusBar label="Planned" value={stats.by_status.planned} total={stats.total_features} color="bg-slate-500" />
              <StatusBar label="In Progress" value={stats.by_status['in-progress']} total={stats.total_features} color="bg-amber-500" />
              <StatusBar label="Completed" value={stats.by_status.completed} total={stats.total_features} color="bg-emerald-500" />
              <StatusBar label="Blocked" value={stats.by_status.blocked} total={stats.total_features} color="bg-red-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Priority Mix</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Wie viel Risiko steckt im Backlog?</p>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Jetzt</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <PriorityPill label="Critical" value={stats.by_priority.critical} total={stats.total_features} tone="red" />
              <PriorityPill label="High" value={stats.by_priority.high} total={stats.total_features} tone="orange" />
              <PriorityPill label="Medium" value={stats.by_priority.medium} total={stats.total_features} tone="blue" />
              <PriorityPill label="Low" value={stats.by_priority.low} total={stats.total_features} tone="slate" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Active Blockers</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">Live</span>
            </div>
            <div className="max-h-[420px] overflow-y-auto pr-1 space-y-4">
              <BlockersList embedded />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function StatusBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const percentage = total > 0 ? (value / total) * 100 : 0
  
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">{value} • {percentage.toFixed(0)}%</span>
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

function MetricCard({ title, value, accent, icon }: { title: string; value: number; accent: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex items-center gap-4 shadow-sm">
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${accent} text-white flex items-center justify-center`}>{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  )
}

function PriorityPill({ label, value, total, tone }: { label: string; value: number; total: number; tone: 'red' | 'orange' | 'blue' | 'slate' }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0
  const toneMap: Record<typeof tone, string> = {
    red: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-200',
    orange: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-200',
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200',
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  } as const

  return (
    <div className={`rounded-lg px-3 py-3 border border-transparent ${toneMap[tone]}`}>
      <div className="flex items-center justify-between text-sm font-medium">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="mt-2 w-full bg-white/40 dark:bg-black/20 h-1.5 rounded-full">
        <div
          className="h-1.5 rounded-full bg-current"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-1 text-xs opacity-80">{percentage}% des Backlogs</p>
    </div>
  )
}
