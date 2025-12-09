'use client'

import { useEffect, useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import AppShell from '@/components/AppShell'
import { Feature } from '@/lib/db'
import FeatureCard from '@/components/FeatureCard'
import FeatureDetailsModal from '@/components/FeatureDetailsModal'
import TagFilter from '@/components/TagFilter'

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  useEffect(() => {
    loadFeatures()
    
    // Listen for project changes
    const handleProjectChange = () => loadFeatures()
    window.addEventListener('projectChanged', handleProjectChange)
    
    return () => window.removeEventListener('projectChanged', handleProjectChange)
  }, [])

  const loadFeatures = async () => {
    try {
      const projectId = localStorage.getItem('architectflow_project_id') || localStorage.getItem('selected_project') || ''
      const url = projectId 
        ? `/api/features?project_id=${projectId}`
        : '/api/features'
      
      const res = await fetch(url)
      const data = await res.json()
      setFeatures(data)
    } catch (error) {
      console.error('Failed to load features:', error)
    } finally {
      setLoading(false)
    }
  }

  // Extract all tags from features
  const allTags = useMemo(() => {
    const tags: string[] = []
    features.forEach(f => {
      const featureTags = typeof f.tags === 'string' ? JSON.parse(f.tags || '[]') : (f.tags || [])
      tags.push(...featureTags)
    })
    return tags
  }, [features])

  // Filter features by selected tags
  const filteredFeatures = useMemo(() => {
    if (selectedTags.length === 0) return features
    
    return features.filter(f => {
      const featureTags = typeof f.tags === 'string' ? JSON.parse(f.tags || '[]') : (f.tags || [])
      return selectedTags.some(tag => featureTags.includes(tag))
    })
  }, [features, selectedTags])

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleClearTags = () => {
    setSelectedTags([])
  }
  
  const planned = filteredFeatures.filter(f => f.status === 'planned')
  const inProgress = filteredFeatures.filter(f => f.status === 'in-progress')
  const completed = filteredFeatures.filter(f => f.status === 'completed')
  const blocked = filteredFeatures.filter(f => f.status === 'blocked')

  const content = loading ? (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse grid grid-cols-1 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-96 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
        ))}
      </div>
    </div>
  ) : (
    <>
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Feature Board</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Kanban view of all features • {filteredFeatures.length} of {features.length} total
                {selectedTags.length > 0 && ` • Filtered by ${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''}`}
              </p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span>New Feature</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <TagFilter 
            allTags={allTags}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            onClearAll={handleClearTags}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Column 
            title="Planned" 
            count={planned.length}
            color="slate"
            features={planned}
            onFeatureClick={setSelectedFeatureId}
          />
          <Column 
            title="In Progress" 
            count={inProgress.length}
            color="yellow"
            features={inProgress}
            onFeatureClick={setSelectedFeatureId}
          />
          <Column 
            title="Completed" 
            count={completed.length}
            color="green"
            features={completed}
            onFeatureClick={setSelectedFeatureId}
          />
          <Column 
            title="Blocked" 
            count={blocked.length}
            color="red"
            features={blocked}
            onFeatureClick={setSelectedFeatureId}
          />
        </div>
      </main>

      <FeatureDetailsModal 
        featureId={selectedFeatureId}
        onClose={() => setSelectedFeatureId(null)}
      />
    </>
  )

  return <AppShell active="features">{content}</AppShell>
}

interface ColumnProps {
  title: string
  count: number
  color: 'slate' | 'yellow' | 'green' | 'red'
  features: Feature[]
  onFeatureClick: (id: string) => void
}

const colorClasses = {
  slate: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
  yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
}

function Column({ title, count, color, features, onFeatureClick }: ColumnProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className={`${colorClasses[color]} rounded-lg px-4 py-3 mb-4`}>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm uppercase tracking-wide">{title}</h2>
          <span className="text-sm font-bold">{count}</span>
        </div>
      </div>
      
      {/* Cards Container */}
      <div className="flex-1 space-y-3 min-h-[200px]">
        {features.length === 0 ? (
          <div className="text-center py-8 text-slate-400 dark:text-slate-600 text-sm">
            No features
          </div>
        ) : (
          features.map(feature => (
            <FeatureCard 
              key={feature.id} 
              feature={feature}
              onClick={() => onFeatureClick(feature.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
