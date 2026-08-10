import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import type { Role, User } from '@/types'

interface RequireRoleProps {
  roles: Role[]
  /** Extra gate ANDed with the role check — e.g. "must also be a reporting manager". */
  predicate?: (user: User) => boolean
  children: ReactNode
}

export function RequireRole({ roles, predicate, children }: RequireRoleProps) {
  const user = useAuthStore((state) => state.user)

  const hasRequiredRole = user?.roles.some((role) => roles.includes(role)) ?? false
  const passesPredicate = user && predicate ? predicate(user) : true

  if (!hasRequiredRole || !passesPredicate) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
