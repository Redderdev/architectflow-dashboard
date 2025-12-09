'use client'

import { useEffect, useState } from 'react'
import { Calendar, FileCode, User, Clock } from 'lucide-react'
import AppShell from '@/components/AppShell'
import { format } from 'date-fns'

export default function TimelinePage() {
  const [implementations, setImplementations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadImplementations()
    
    // Listen for project changes
    const handleProjectChange = () => loadImplementations()
    window.addEventListener('projectChanged', handleProjectChange)
    
    return () => window.removeEventListener('projectChanged', handleProjectChange)
  }, [])

  const loadImplementations = async () => {
    try {
      const projectId = localStorage.getItem('architectflow_project_id') || localStorage.getItem('selected_project') || ''
      const url = projectId 
        ? `/api/implementations?project_id=${projectId}`
        : '/api/implementations'
      
      const res = await fetch(url)
      const data = await res.json()
      setImplementations(data)
    } catch (error) {
      console.error('Failed to load implementations:', error)
    } finally {
      setLoading(false)
    }
  }

  const content = loading ? (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse space-y-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
        ))}
      </div>
    </div>
  ) : (
    <>
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Implementation Timeline</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Complete history of all implementations • {implementations.length} total
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {implementations.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No implementations yet</h2>
            <p className="text-slate-600 dark:text-slate-400">Start coding and implementations will appear here</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
            <div className="space-y-8">
              {implementations.map((impl: any, index: number) => (
                <TimelineItem 
                  key={impl.id} 
                  implementation={impl}
                  isFirst={index === 0}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  )

  return <AppShell active="timeline">{content}</AppShell>
}

interface TimelineItemProps {
  implementation: any
  isFirst: boolean
}

function TimelineItem({ implementation, isFirst }: TimelineItemProps) {
  const files = implementation.files_modified ? JSON.parse(implementation.files_modified) : []
  
  return (
    <div className="relative pl-16">
      {/* Timeline Dot */}
      <div className={`absolute left-6 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 ${
        isFirst 
          ? 'bg-blue-500 ring-4 ring-blue-100 dark:ring-blue-900/30' 
          : 'bg-slate-300 dark:bg-slate-600'
      }`}></div>
      
      {/* Card */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-1">
              {implementation.description}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(implementation.created_at), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{format(new Date(implementation.created_at), 'h:mm a')}</span>
              </div>
            </div>
          </div>
          
          {isFirst && (
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
              Latest
            </span>
          )}
        </div>
        
        {/* Feature Link */}
        {implementation.feature_name && (
          <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Feature</span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
                {implementation.feature_id}
              </span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {implementation.feature_name}
              </span>
            </div>
          </div>
        )}
        
        {/* Files Modified */}
        {files.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <FileCode className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Files Modified ({files.length})
              </span>
            </div>
            <div className="space-y-1">
              {files.map((file: string, idx: number) => (
                <div 
                  key={idx}
                  className="text-sm font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 px-3 py-2 rounded"
                >
                  {file}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Implementer */}
        {implementation.implemented_by && (
          <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
            <User className="w-4 h-4" />
            <span>{implementation.implemented_by}</span>
          </div>
        )}
      </div>
    </div>
  )
}
