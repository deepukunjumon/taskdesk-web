import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  BarChart3,
  ChevronDown,
  ClipboardList,
  Database,
  LayoutDashboard,
  Menu,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { SIDEBAR_MOBILE_BREAKPOINT, useUiStore } from '@/stores/uiStore'
import type { Role, User } from '@/types'

interface NavLinkItem {
  type: 'link'
  label: string
  to: string
  roles: Role[]
  icon: LucideIcon
  /** Extra gate beyond role — e.g. hiding Task Register from non-managers. */
  isVisible?: (user: User) => boolean
}

interface NavGroupChild {
  label: string
  to: string
  isVisible?: (user: User) => boolean
}

interface NavGroupItem {
  type: 'group'
  label: string
  roles: Role[]
  icon: LucideIcon
  children: NavGroupChild[]
}

type NavEntry = NavLinkItem | NavGroupItem

const NAV_ITEMS: NavEntry[] = [
  {
    type: 'link',
    label: 'Dashboard',
    to: '/',
    roles: ['superadmin', 'admin', 'user'],
    icon: LayoutDashboard,
  },
  {
    type: 'group',
    label: 'Task Management',
    roles: ['superadmin', 'admin', 'user'],
    icon: ClipboardList,
    children: [
      {
        label: 'Task Register',
        to: '/work-register',
        isVisible: (user) =>
          user.roles.some((role) => role === 'superadmin' || role === 'admin') ||
          (user.abilities?.is_reporting_manager ?? false),
      },
      {
        label: 'My Tasks',
        to: '/my-tasks',
      },
    ],
  },
  {
    type: 'link',
    label: 'Reports',
    to: '/reports',
    roles: ['superadmin', 'admin'],
    icon: BarChart3,
  },
  {
    type: 'group',
    label: 'Masters',
    roles: ['superadmin', 'admin'],
    icon: Database,
    children: [
      { label: 'Branches', to: '/admin/branches' },
      { label: 'Departments', to: '/admin/departments' },
      { label: 'Categories', to: '/admin/categories' },
    ],
  },
  {
    type: 'link',
    label: 'Reporting Structure',
    to: '/admin/reporting-structure',
    roles: ['superadmin', 'admin'],
    icon: Users,
  },
]

function getVisibleChildren(group: NavGroupItem, user: User): NavGroupChild[] {
  return group.children.filter((child) => !child.isVisible || child.isVisible(user))
}

function isItemVisible(item: NavEntry, user: User): boolean {
  if (!item.roles.some((role) => user.roles.includes(role))) {
    return false
  }

  if (item.type === 'link') {
    return item.isVisible ? item.isVisible(user) : true
  }

  return getVisibleChildren(item, user).length > 0
}

export function Sidebar() {
  const user = useAuthStore((state) => state.user)
  const isOpen = useUiStore((state) => state.isSidebarOpen)
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)
  const closeSidebar = useUiStore((state) => state.closeSidebar)
  const location = useLocation()
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set())

  const visibleItems = user ? NAV_ITEMS.filter((item) => isItemVisible(item, user)) : []

  function handleNavClick() {
    if (window.innerWidth < SIDEBAR_MOBILE_BREAKPOINT) {
      closeSidebar()
    }
  }

  function isGroupActive(children: NavGroupChild[]) {
    return children.some(
      (child) => location.pathname === child.to || location.pathname.startsWith(`${child.to}/`),
    )
  }

  function toggleGroup(label: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(label)) {
        next.delete(label)
      } else {
        next.add(label)
      }
      return next
    })
  }

  const linkClassName = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
      !isOpen && 'justify-center px-0',
      isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
    )

  return (
    <aside
      className={cn(
        'inset-y-0 left-0 z-50 flex flex-col overflow-hidden border-border bg-card transition-[width] duration-300 ease-in-out max-md:fixed',
        isOpen ? 'max-md:w-64 max-md:border-r md:w-64 md:border-r' : 'max-md:w-0 md:w-16 md:border-r',
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

          if (item.type === 'group') {
            const children = user ? getVisibleChildren(item, user) : []
            const active = isGroupActive(children)

            if (!isOpen) {
              return (
                <NavLink
                  key={item.label}
                  to={children[0].to}
                  onClick={handleNavClick}
                  title={item.label}
                  className={cn(
                    'flex items-center justify-center gap-3 rounded-md px-0 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                </NavLink>
              )
            }

            const expanded = expandedGroups.has(item.label) || active

            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => toggleGroup(item.label)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    active ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                  <span className="flex-1 truncate text-left">{item.label}</span>
                  <ChevronDown
                    className={cn('size-4 shrink-0 transition-transform', expanded && 'rotate-180')}
                  />
                </button>
                {expanded && (
                  <div className="ml-4 flex flex-col gap-1 border-l pl-4">
                    {children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                          cn(
                            'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                            isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                          )
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={handleNavClick}
              title={isOpen ? undefined : item.label}
              className={linkClassName}
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