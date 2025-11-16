/**
 * Client-side dashboard component with project filtering
 */
'use client'

import { useEffect, useState } from 'react'
import { ListTodo, Clock, BarChart3 } from 'lucide-react'
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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

      {/* Blockers Section - Dynamic Import */}
      <BlockersList />
    </main>
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
