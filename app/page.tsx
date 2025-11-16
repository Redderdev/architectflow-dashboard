import Link from 'next/link'
import { LayoutDashboard } from 'lucide-react'
import ProjectSelector from '@/components/ProjectSelector'
import DashboardContent from '@/components/DashboardContent'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">ArchitectFlow</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">AI Project Architecture Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ProjectSelector />
              <nav className="flex space-x-4">
                <Link 
                  href="/" 
                  className="px-4 py-2 text-blue-600 dark:text-blue-400 font-medium"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/features" 
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Features
                </Link>
                <Link 
                  href="/timeline" 
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Timeline
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Client Side Rendered with Project Filtering */}
      <DashboardContent />
    </div>
  )
}
