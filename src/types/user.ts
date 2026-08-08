import type { Role } from './role'

export interface User {
  id: string
  name: string
  email: string
  department_id: string | null
  roles: Role[]
  created_at: string
}
