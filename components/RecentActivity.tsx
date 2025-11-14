import { Clock, FileCode } from 'lucide-react'
import { Implementation } from '@/lib/db'
import { formatDistanceToNow } from 'date-fns'

interface RecentActivityProps {
  implementations: Implementation[]
}

export default function RecentActivity({ implementations }: RecentActivityProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
      
      {implementations.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-400 text-center py-8">No implementations yet</p>
      ) : (
        <div className="space-y-4">
          {implementations.map((impl) => (
            <div 
              key={impl.id} 
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <FileCode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {impl.feature_id}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {impl.files_affected.length} file{impl.files_affected.length !== 1 ? 's' : ''} modified
                  {impl.implementer && ` by ${impl.implementer}`}
                </p>
                {impl.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 line-clamp-2">
                    {impl.notes}
                  </p>
                )}
                <div className="flex items-center space-x-2 mt-2">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDistanceToNow(new Date(impl.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
