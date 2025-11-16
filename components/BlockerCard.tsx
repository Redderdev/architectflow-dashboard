import { Blocker } from '@/lib/db'
import { AlertCircle, AlertTriangle, Info, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface BlockerCardProps {
  blocker: Blocker
}

const severityConfig = {
  critical: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-300 dark:border-red-700',
    icon: AlertCircle,
    iconColor: 'text-red-600 dark:text-red-400',
  },
  high: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-300 dark:border-orange-700',
    icon: AlertTriangle,
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
  medium: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-700 dark:text-yellow-300',
    border: 'border-yellow-300 dark:border-yellow-700',
    icon: AlertTriangle,
    iconColor: 'text-yellow-600 dark:text-yellow-400',
  },
  low: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-300 dark:border-blue-700',
    icon: Info,
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
}

const statusConfig = {
  open: {
    label: 'Open',
    bg: 'bg-slate-100 dark:bg-slate-700',
    text: 'text-slate-700 dark:text-slate-300',
  },
  'in-progress': {
    label: 'In Progress',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
  },
  resolved: {
    label: 'Resolved',
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300',
  },
}

export default function BlockerCard({ blocker }: BlockerCardProps) {
  const config = severityConfig[blocker.severity]
  const statusInfo = statusConfig[blocker.status]
  const Icon = config.icon
  
  const timeAgo = formatDistanceToNow(new Date(blocker.created_at), { addSuffix: true })

  return (
    <div className={`rounded-lg border-2 ${config.border} ${config.bg} p-4 hover:shadow-md transition-shadow`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
          <span className={`text-xs font-bold uppercase tracking-wide ${config.text}`}>
            {blocker.severity}
          </span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusInfo.bg} ${statusInfo.text}`}>
          {statusInfo.label}
        </span>
      </div>

      {/* Description */}
      <p className={`text-sm font-medium ${config.text} mb-2`}>
        {blocker.description}
      </p>

      {/* Feature Link */}
      {blocker.feature_name && (
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {blocker.feature_id}
          </span>
          <span className="text-xs text-slate-600 dark:text-slate-400">
            {blocker.feature_name}
          </span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-600">
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>Reported {timeAgo}</span>
        </div>
        
        {blocker.resolved_at && (
          <span className="text-green-600 dark:text-green-400">
            Resolved {formatDistanceToNow(new Date(blocker.resolved_at), { addSuffix: true })}
          </span>
        )}
      </div>

      {/* Resolution Notes */}
      {blocker.resolution_notes && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Resolution:</span>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {blocker.resolution_notes}
          </p>
        </div>
      )}
    </div>
  )
}
