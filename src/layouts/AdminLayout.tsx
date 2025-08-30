import { useState } from "react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="min-h-dvh bg-background text-foreground flex w-full">
      <aside className="hidden md:block sticky top-0 h-[100dvh]">
        <div
          className={`flex h-full shrink-0 flex-col border-r bg-card ${
            collapsed ? "w-16" : "w-64"
          }`}
        >
          <div className="h-14 px-3 flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold tracking-tight">
              <img
                src="/vite.svg"
                alt="TrangVang Admin"
                className="h-6 w-6"
              />
              {!collapsed && <span>TrangVang Admin</span>}
            </div>
            <button
              className={`hover:bg-accent hover:text-accent-foreground rounded-md px-2 py-1 ${
                collapsed ? "mx-auto" : ""
              }`}
              onClick={() => setCollapsed((v) => !v)}
            >
              {collapsed ? "▶" : "◀"}
            </button>
          </div>
          <nav className="p-2 space-y-1 overflow-y-auto">
            <a
              className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
              href="#"
            >
              Dashboard
            </a>
          </nav>
        </div>
      </aside>

      <div className="min-w-0 flex-1 flex flex-col">
        <div className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center gap-2 px-4">
            <div className="ml-auto flex items-center gap-2">
              <div className="relative hidden sm:flex items-center">
                <input className="pl-8 w-64 border-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] h-9 rounded-md px-3" placeholder="Quick search..." />
              </div>
            </div>
          </div>
        </div>
        <main className="min-w-0 flex-1 px-4 py-6">{children}</main>
      </div>
    </div>
  );
}


