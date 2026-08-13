import type { Role } from './role'

/** Only present when this User represents the authenticated user themself. */
export interface UserAbilities {
  can_create_work_items: boolean
  is_reporting_manager: boolean
}

export interface UserRef {
  id: string
  name: string
}

export interface User {
  id: string
  name: string
  email: string
  employee_code: string | null
  mobile: string | null
  department_id: string | null
  manager_id: string | null
  department: UserRef | null
  manager: UserRef | null
  roles: Role[]
  is_active: boolean
  relieved_on: string | null
  /** Direct reports only. Only populated on the admin users list and after status/relieve mutations. */
  reports_count: number | null
  created_at: string
  abilities?: UserAbilities
}

/** Minimal shape for the "Assigned To" dropdown/combobox — see /users/me/assignable. */
export interface UserOption {
  id: string
  name: string
  department_id: string | null
}

export interface AdminUserFilters {
  role?: Role
  department_id?: string
  is_active?: boolean
  q?: string
  page?: number
  per_page?: number
}
