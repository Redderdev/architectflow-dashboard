import { Plus } from 'lucide-react'
import { getAllFeatures } from '@/lib/db'
import FeatureCard from '@/components/FeatureCard'

export const dynamic = 'force-dynamic'

export default function FeaturesPage() {
  const features = getAllFeatures()
  
  const planned = features.filter(f => f.status === 'planned')
  const inProgress = features.filter(f => f.status === 'in-progress')
  const completed = features.filter(f => f.status === 'completed')
  const blocked = features.filter(f => f.status === 'blocked')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Page Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Feature Board</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Kanban view of all features</p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span>New Feature</span>
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Planned Column */}
          <Column 
            title="Planned" 
            count={planned.length}
            color="slate"
            features={planned}
          />
          
          {/* In Progress Column */}
          <Column 
            title="In Progress" 
            count={inProgress.length}
            color="yellow"
            features={inProgress}
          />
          
          {/* Completed Column */}
          <Column 
            title="Completed" 
            count={completed.length}
            color="green"
            features={completed}
          />
          
          {/* Blocked Column */}
          <Column 
            title="Blocked" 
            count={blocked.length}
            color="red"
            features={blocked}
          />
        </div>
      </main>
    </div>
  )
}

interface ColumnProps {
  title: string
  count: number
  color: 'slate' | 'yellow' | 'green' | 'red'
  features: any[]
}

const colorClasses = {
  slate: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
  yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
}

function Column({ title, count, color, features }: ColumnProps) {
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
            <FeatureCard key={feature.id} feature={feature} />
          ))
        )}
      </div>
    </div>
  )
}
