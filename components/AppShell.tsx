import Link from 'next/link'
import { LayoutDashboard, ListTodo, GitBranch, Clock, BarChart3, Search } from 'lucide-react'
import ProjectSelector from '@/components/ProjectSelector'
import React from 'react'

interface AppShellProps {
  children: React.ReactNode
  active: 'dashboard' | 'features' | 'dependencies' | 'timeline' | 'analytics'
}

export default function AppShell({ children, active }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-6 space-y-6">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">ArchitectFlow</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Project Control</p>
          </div>
        </div>

        <nav className="space-y-2 text-sm font-medium text-slate-600 dark:text-slate-400">
          <SidebarLink href="/" label="Dashboard" icon={<LayoutDashboard className="w-4 h-4" />} active={active === 'dashboard'} />
          <SidebarLink href="/features" label="Features" icon={<ListTodo className="w-4 h-4" />} active={active === 'features'} />
          <SidebarLink href="/dependencies" label="Dependencies" icon={<GitBranch className="w-4 h-4" />} active={active === 'dependencies'} />
          <SidebarLink href="/timeline" label="Timeline" icon={<Clock className="w-4 h-4" />} active={active === 'timeline'} />
          <SidebarLink href="/analytics" label="Analytics" icon={<BarChart3 className="w-4 h-4" />} disabled active={active === 'analytics'} />
        </nav>

        <div className="mt-auto space-y-3 text-xs text-slate-500 dark:text-slate-500">
          <p className="px-2">Focus on what matters: unblock features, finish dependencies, ship.</p>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
            <div className="flex-1 flex items-center gap-3">
              <div className="relative w-full max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search features, blockers, timelines..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ProjectSelector />
            </div>
          </div>
        </header>

        {/* Page content */}
        {children}
      </div>
    </div>
  )
}

function SidebarLink({ href, label, icon, active = false, disabled = false }: { href: string; label: string; icon: React.ReactNode; active?: boolean; disabled?: boolean }) {
  return (
    <Link
      href={disabled ? '#' : href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
        active
          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200'
          : 'hover:bg-slate-100 dark:hover:bg-slate-800'
      } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      aria-disabled={disabled}
    >
      <span className="text-slate-500 dark:text-slate-400">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  )
}
