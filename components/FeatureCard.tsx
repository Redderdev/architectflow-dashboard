import { Feature } from '@/lib/db'
import { AlertCircle, Clock, CheckCircle2, Circle } from 'lucide-react'

interface FeatureCardProps {
  feature: Feature
}

const priorityColors = {
  low: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
  medium: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  high: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  critical: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
}

const statusIcons = {
  planned: Circle,
  'in-progress': Clock,
  completed: CheckCircle2,
  blocked: AlertCircle,
}

export default function FeatureCard({ feature }: FeatureCardProps) {
  const StatusIcon = statusIcons[feature.status]
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow cursor-pointer">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <StatusIcon className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {feature.id}
          </span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[feature.priority]}`}>
          {feature.priority}
        </span>
      </div>
      
      {/* Title */}
      <h3 className="font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">
        {feature.name}
      </h3>
      
      {/* Description */}
      {feature.description && (
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
          {feature.description}
        </p>
      )}
      
      {/* Footer */}
      <div className="flex items-center justify-between text-xs">
        {feature.category && (
          <span className="text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
            {feature.category}
          </span>
        )}
        
        {feature.dependencies && feature.dependencies.length > 0 && (
          <span className="text-slate-500 dark:text-slate-400">
            {feature.dependencies.length} dep{feature.dependencies.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      {/* Tags */}
      {feature.tags && feature.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {feature.tags.slice(0, 3).map(tag => (
            <span 
              key={tag}
              className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded"
            >
              {tag}
            </span>
          ))}
          {feature.tags.length > 3 && (
            <span className="text-xs text-slate-400">+{feature.tags.length - 3}</span>
          )}
        </div>
      )}
    </div>
  )
}
