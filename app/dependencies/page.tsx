'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Network } from 'lucide-react'
import FeatureDetailsModal from '@/components/FeatureDetailsModal'

// Dynamic import to avoid SSR issues with ReactFlow
const DependencyGraph = dynamic(
  () => import('@/components/DependencyGraph'),
  { ssr: false }
)

interface Feature {
  id: string
  name: string
  status: string
  priority: string
  blockedBy: string[]
  blocking: string[]
  category: string
}

export default function DependenciesPage() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null)

  useEffect(() => {
    loadFeatures()

    // Listen for project changes
    const handleProjectChange = () => loadFeatures()
    window.addEventListener('projectChanged', handleProjectChange)

    return () => window.removeEventListener('projectChanged', handleProjectChange)
  }, [])

  const loadFeatures = async () => {
    try {
      const projectId = localStorage.getItem('selected_project') || ''
      const url = projectId
        ? `/api/features?project_id=${projectId}`
        : '/api/features'

      const res = await fetch(url)
      const data = await res.json()
      
      // Parse JSON fields
      const parsedFeatures = data.map((f: any) => ({
        ...f,
        blockedBy: typeof f.blocked_by === 'string' ? JSON.parse(f.blocked_by || '[]') : (f.blocked_by || []),
        blocking: typeof f.blocking === 'string' ? JSON.parse(f.blocking || '[]') : (f.blocking || []),
      }))
      
      setFeatures(parsedFeatures)
    } catch (error) {
      console.error('Failed to load features:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFeatureClick = (featureId: string) => {
    setSelectedFeatureId(featureId)
  }

  const handleCloseModal = () => {
    setSelectedFeatureId(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading dependency graph...</div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Network className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Dependency Graph
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Visual representation of feature dependencies • {features.length} features
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-slate-400"></div>
            <span className="text-slate-600 dark:text-slate-400">Planning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500"></div>
            <span className="text-slate-600 dark:text-slate-400">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span className="text-slate-600 dark:text-slate-400">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500"></div>
            <span className="text-slate-600 dark:text-slate-400">Blocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500"></div>
            <span className="text-slate-600 dark:text-slate-400">Review</span>
          </div>
          <span className="text-slate-400 mx-2">|</span>
          <span className="text-slate-600 dark:text-slate-400">
            Border thickness = Priority (Critical → Low)
          </span>
          <span className="text-slate-400 mx-2">|</span>
          <span className="text-slate-600 dark:text-slate-400">
            Animated edges = Blocked dependencies
          </span>
        </div>
      </div>

      {/* Graph */}
      <div className="flex-1 relative">
        {features.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Network className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">No features found</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                Create features using the MCP tools to see the dependency graph
              </p>
            </div>
          </div>
        ) : (
          <DependencyGraph features={features} onFeatureClick={handleFeatureClick} />
        )}
      </div>

      {/* Feature Details Modal */}
      {selectedFeatureId && (
        <FeatureDetailsModal
          featureId={selectedFeatureId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}
