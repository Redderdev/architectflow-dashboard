'use client'

import { useEffect, useState } from 'react'
import { X, AlertCircle, Link2, FileCode, Clock, Tag, GitBranch } from 'lucide-react'

interface FeatureDetails {
  id: string
  project_id: string
  name: string
  description: string | null
  status: 'planned' | 'in-progress' | 'completed' | 'blocked'
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: string | null
  dependencies: string[]
  tags: string[]
  created_at: string
  updated_at: string
  implementations: Array<{
    id: string
    files_affected: string[]
    notes: string | null
    created_at: string
  }>
  blockers: Array<{
    id: string
    description: string
    severity: string
    status: string
    created_at: string
  }>
}

interface FeatureDetailsModalProps {
  featureId: string | null
  onClose: () => void
}

const priorityColors = {
  low: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
  medium: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  high: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  critical: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
}

const statusColors = {
  planned: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
  'in-progress': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  blocked: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
}

export default function FeatureDetailsModal({ featureId, onClose }: FeatureDetailsModalProps) {
  const [feature, setFeature] = useState<FeatureDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!featureId) return

    const loadFeature = async () => {
      try {
        const res = await fetch(`/api/features/${featureId}`)
        const data = await res.json()
        setFeature(data)
      } catch (error) {
        console.error('Failed to load feature details:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFeature()

    // ESC to close
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [featureId, onClose])

  if (!featureId) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      {/* Modal */}
      <div 
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {featureId}
              </span>
              {loading ? (
                <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              ) : (
                <>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[feature?.status || 'planned']}`}>
                    {feature?.status}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[feature?.priority || 'medium']}`}>
                    {feature?.priority}
                  </span>
                </>
              )}
            </div>
            {loading ? (
              <div className="h-7 w-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            ) : (
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {feature?.name}
              </h2>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <LoadingSkeleton />
          ) : feature ? (
            <>
              {/* Description */}
              {feature.description && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Description</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )}

              {/* Category */}
              {feature.category && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Category</h3>
                  <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm">
                    {feature.category}
                  </span>
                </div>
              )}

              {/* Blockers */}
              {feature.blockers && feature.blockers.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Active Blockers ({feature.blockers.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {feature.blockers.map(blocker => (
                      <div 
                        key={blocker.id}
                        className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-xs font-bold uppercase text-red-700 dark:text-red-300">
                            {blocker.severity}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(blocker.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          {blocker.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dependencies */}
              {feature.dependencies && feature.dependencies.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <GitBranch className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Dependencies ({feature.dependencies.length})
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {feature.dependencies.map(depId => (
                      <span 
                        key={depId}
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-mono"
                      >
                        <Link2 className="w-3 h-3" />
                        <span>{depId}</span>
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    💡 This feature depends on the above features to be completed first
                  </p>
                </div>
              )}

              {/* Implementation History */}
              {feature.implementations && feature.implementations.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Implementation History ({feature.implementations.length})
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {feature.implementations.map((impl, idx) => (
                      <div 
                        key={impl.id}
                        className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                            Implementation #{feature.implementations.length - idx}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(impl.created_at).toLocaleDateString()} {new Date(impl.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                        
                        {impl.notes && (
                          <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                            {impl.notes}
                          </p>
                        )}
                        
                        {impl.files_affected && impl.files_affected.length > 0 && (
                          <div>
                            <div className="flex items-center space-x-1 mb-1">
                              <FileCode className="w-3 h-3 text-slate-500" />
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                Files ({impl.files_affected.length}):
                              </span>
                            </div>
                            <div className="space-y-1">
                              {impl.files_affected.map((file, fileIdx) => (
                                <div 
                                  key={fileIdx}
                                  className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded"
                                >
                                  {file}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {feature.tags && feature.tags.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Tag className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Tags ({feature.tags.length})
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {feature.tags.map(tag => (
                      <span 
                        key={tag}
                        className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-2 gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <div>
                    <span className="font-medium">Created:</span> {new Date(feature.created_at).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Updated:</span> {new Date(feature.updated_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500 dark:text-slate-400">Feature not found</p>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop */}
      <div 
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
      <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
      <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
    </div>
  )
}
