import type { Role } from './role'

/** Only present when this User represents the authenticated user themself. */
export interface UserAbilities {
  can_create_work_items: boolean
  is_reporting_manager: boolean
}

export interface User {
  id: string
  name: string
  email: string
  department_id: string | null
  manager_id: string | null
  roles: Role[]
  created_at: string
  abilities?: UserAbilities
}
