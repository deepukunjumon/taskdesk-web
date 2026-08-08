export const ROLES = ['superadmin', 'admin', 'employee'] as const

export type Role = (typeof ROLES)[number]
