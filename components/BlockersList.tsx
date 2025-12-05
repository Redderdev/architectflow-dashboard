'use client'

import { useEffect, useState } from 'react'
import { Blocker } from '@/lib/db'
import BlockerCard from './BlockerCard'
import { AlertTriangle } from 'lucide-react'

export default function BlockersList() {
  const [blockers, setBlockers] = useState<Blocker[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBlockers()
    
    // Listen for project changes
    const handleProjectChange = () => loadBlockers()
    window.addEventListener('projectChanged', handleProjectChange)
    
    return () => window.removeEventListener('projectChanged', handleProjectChange)
  }, [])

  const loadBlockers = async () => {
    try {
      const projectId = localStorage.getItem('architectflow_project_id') || localStorage.getItem('selected_project') || ''
      const url = projectId 
        ? `/api/blockers?project_id=${projectId}`
        : '/api/blockers'
      
      const res = await fetch(url)
      const data = await res.json()
      setBlockers(data)
    } catch (error) {
      console.error('Failed to load blockers:', error)
    } finally {
      setLoading(false)
    }
  }

  const critical = blockers.filter(b => b.severity === 'critical')
  const high = blockers.filter(b => b.severity === 'high')
  const medium = blockers.filter(b => b.severity === 'medium')
  const low = blockers.filter(b => b.severity === 'low')

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-4"></div>
        <div className="space-y-3">
          <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (blockers.length === 0) {
    return null // No blockers, don't show section
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Active Blockers
        </h2>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          ({blockers.length})
        </span>
      </div>

      {/* Blockers by Severity */}
      <div className="space-y-4">
        {critical.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-red-600 dark:text-red-400 mb-2">
              🔴 Critical ({critical.length})
            </h3>
            <div className="space-y-2">
              {critical.map(blocker => (
                <BlockerCard key={blocker.id} blocker={blocker} />
              ))}
            </div>
          </div>
        )}

        {high.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-orange-600 dark:text-orange-400 mb-2">
              🟠 High ({high.length})
            </h3>
            <div className="space-y-2">
              {high.map(blocker => (
                <BlockerCard key={blocker.id} blocker={blocker} />
              ))}
            </div>
          </div>
        )}

        {medium.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-yellow-600 dark:text-yellow-400 mb-2">
              🟡 Medium ({medium.length})
            </h3>
            <div className="space-y-2">
              {medium.map(blocker => (
                <BlockerCard key={blocker.id} blocker={blocker} />
              ))}
            </div>
          </div>
        )}

        {low.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-2">
              🔵 Low ({low.length})
            </h3>
            <div className="space-y-2">
              {low.map(blocker => (
                <BlockerCard key={blocker.id} blocker={blocker} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
