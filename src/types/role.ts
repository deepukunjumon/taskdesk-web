export const ROLES = ['superadmin', 'admin', 'user'] as const

export type Role = (typeof ROLES)[number]
