import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { useUiStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

export function AppShell() {
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen)
  const closeSidebar = useUiStore((state) => state.closeSidebar)

  return (
    <div className="flex min-h-svh">
      <Sidebar />

      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
        />
      )}

      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col transition-[filter] duration-300 ease-in-out max-md:ml-16',
          isSidebarOpen && 'max-md:pointer-events-none max-md:blur-sm',
        )}
      >
        <Header />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
