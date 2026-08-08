import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  Menu,
  ShieldCheck,
  X,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { SIDEBAR_MOBILE_BREAKPOINT, useUiStore } from '@/stores/uiStore'
import type { Role } from '@/types'

interface NavItem {
  label: string
  to: string
  roles: Role[]
  icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    to: '/',
    roles: ['superadmin', 'admin', 'employee'],
    icon: LayoutDashboard,
  },
  {
    label: 'Work Register',
    to: '/work-register',
    roles: ['superadmin', 'admin', 'employee'],
    icon: ClipboardList,
  },
  { label: 'Reports', to: '/reports', roles: ['superadmin', 'admin'], icon: BarChart3 },
  { label: 'Admin', to: '/admin', roles: ['superadmin'], icon: ShieldCheck },
]

export function Sidebar() {
  const user = useAuthStore((state) => state.user)
  const isOpen = useUiStore((state) => state.isSidebarOpen)
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)
  const closeSidebar = useUiStore((state) => state.closeSidebar)

  const visibleItems = NAV_ITEMS.filter((item) =>
    user?.roles.some((role) => item.roles.includes(role)),
  )

  function handleNavClick() {
    if (window.innerWidth < SIDEBAR_MOBILE_BREAKPOINT) {
      closeSidebar()
    }
  }

  return (
    <aside
      className={cn(
        'inset-y-0 left-0 z-50 flex flex-col overflow-hidden border-r border-border bg-card transition-[width] duration-300 ease-in-out max-md:fixed',
        isOpen ? 'w-64' : 'w-16',
      )}
    >
      <div className="flex h-14 shrink-0 items-center justify-between gap-2 px-3">
        {isOpen && <span className="truncate text-lg font-semibold">TaskDesk</span>}
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
          className={cn(
            'inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
            !isOpen && 'mx-auto',
          )}
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      <nav className="flex flex-col gap-1 px-2">
        {visibleItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={handleNavClick}
              title={isOpen ? undefined : item.label}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  !isOpen && 'justify-center px-0',
                  isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                )
              }
            >
              <Icon className="size-5 shrink-0" />
              {isOpen && <span className="truncate">{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
