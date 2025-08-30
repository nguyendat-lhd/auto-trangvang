import { useState } from 'react'
import { HomeIcon } from '@heroicons/react/24/outline'

export function TailAdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="ta-layout flex">
      <aside className="hidden md:block ta-sidebar" style={{ width: collapsed ? 64 : 256 }}>
        <div className="ta-sidebar-header">
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <img src="/vite.svg" alt="TrangVang Admin" className="h-6 w-6" />
            {!collapsed && <span>TrangVang Admin</span>}
          </div>
          <button
            className={`hover:bg-accent hover:text-accent-foreground rounded-md px-2 py-1 ${collapsed ? 'mx-auto' : ''}`}
            onClick={() => setCollapsed(v => !v)}
          >
            {collapsed ? '▶' : '◀'}
          </button>
        </div>
        <nav className="ta-nav">
          <a className="ta-nav-item" href="#">
            <HomeIcon className="h-4 w-4" />
            {!collapsed && <span>Dashboard</span>}
          </a>
        </nav>
      </aside>
      <div className="min-w-0 flex-1 flex flex-col">
        <div className="ta-header">
          <div className="ta-header-inner">
            <div className="ml-auto flex items-center gap-2">
              <div className="relative hidden sm:flex items-center">
                <input className="ta-search-input" placeholder="Quick search..." />
              </div>
            </div>
          </div>
        </div>
        <main className="min-w-0 flex-1 px-4 py-6">{children}</main>
      </div>
    </div>
  )
}


