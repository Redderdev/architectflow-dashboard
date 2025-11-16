'use client'

import { Tag, X } from 'lucide-react'

interface TagFilterProps {
  allTags: string[]
  selectedTags: string[]
  onTagToggle: (tag: string) => void
  onClearAll: () => void
}

export default function TagFilter({ allTags, selectedTags, onTagToggle, onClearAll }: TagFilterProps) {
  if (allTags.length === 0) {
    return null
  }

  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const uniqueTags = Object.keys(tagCounts).sort()

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
            Filter by Tags
          </h3>
        </div>
        {selectedTags.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {uniqueTags.map((tag) => {
          const isSelected = selectedTags.includes(tag)
          return (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {tag}
              <span className={`ml-1 ${isSelected ? 'text-blue-200' : 'text-slate-500 dark:text-slate-400'}`}>
                {tagCounts[tag]}
              </span>
            </button>
          )
        })}
      </div>

      {selectedTags.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Showing features with: <span className="font-semibold">{selectedTags.join(', ')}</span>
          </p>
        </div>
      )}
    </div>
  )
}
