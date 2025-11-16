/**
 * Project selector component for multi-project support
 */
'use client'

import { useEffect, useState } from 'react'
import { FolderKanban, ChevronDown } from 'lucide-react'

export interface Project {
  id: string
  name: string
  description: string | null
  created_at: string
  feature_count?: number
}

interface ProjectSelectorProps {
  onProjectChange?: (projectId: string) => void
}

export default function ProjectSelector({ onProjectChange }: ProjectSelectorProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Load projects from localStorage or fetch from API
    const storedProjectId = localStorage.getItem('architectflow_project_id')
    
    // Fetch projects from database
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data)
        if (data.length > 0) {
          const projectId = storedProjectId && data.find((p: Project) => p.id === storedProjectId)
            ? storedProjectId
            : data[0].id
          setSelectedProject(projectId)
          if (onProjectChange) onProjectChange(projectId)
        }
      })
      .catch(err => console.error('Failed to load projects:', err))
  }, [])

  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId)
    localStorage.setItem('architectflow_project_id', projectId)
    setIsOpen(false)
    if (onProjectChange) onProjectChange(projectId)
    // Trigger custom event for same-window updates
    window.dispatchEvent(new Event('projectChanged'))
    // Reload page to refresh data
    window.location.reload()
  }

  const currentProject = projects.find(p => p.id === selectedProject)

  if (projects.length === 0) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
        <FolderKanban className="w-4 h-4 text-slate-400" />
        <span className="text-sm text-slate-600 dark:text-slate-400">No projects</span>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
      >
        <FolderKanban className="w-4 h-4 text-blue-500" />
        <span className="text-sm font-medium text-slate-900 dark:text-white">
          {currentProject?.name || 'Select Project'}
        </span>
        {currentProject?.feature_count !== undefined && (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            ({currentProject.feature_count} features)
          </span>
        )}
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-20">
            <div className="p-2 max-h-64 overflow-y-auto">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleProjectChange(project.id)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    project.id === selectedProject
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{project.name}</div>
                      {project.description && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          {project.description}
                        </div>
                      )}
                    </div>
                    {project.feature_count !== undefined && (
                      <span className="ml-2 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-xs rounded-full">
                        {project.feature_count}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
