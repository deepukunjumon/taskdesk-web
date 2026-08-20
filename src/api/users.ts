import { apiClient } from '@/api/client'
import type { AdminUserFilters, ApiResponse, PaginatedResponse, Role, User } from '@/types'

function serializeAdminUserFilters(filters: AdminUserFilters): Record<string, string | number> {
  const params: Record<string, string | number> = {}

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === '') continue
    params[key] = typeof value === 'boolean' ? (value ? '1' : '0') : (value as string | number)
  }

  return params
}

export function listAdminUsers(filters: AdminUserFilters = {}) {
  return apiClient
    .get<PaginatedResponse<User>>('/users', { params: serializeAdminUserFilters(filters) })
    .then((res) => res.data)
}

export function createUser(payload: {
  name: string
  email: string
  password: string
  role: Role
  mobile?: string | null
  employee_code?: string | null
  department_id?: string | null
  manager_id?: string | null
}) {
  return apiClient.post<ApiResponse<User>>('/users', payload).then((res) => res.data.data)
}

export function updateUser(
  id: string,
  payload: {
    name?: string
    email?: string
    mobile?: string | null
    employee_code?: string | null
    department_id?: string | null
  },
) {
  return apiClient.patch<ApiResponse<User>>(`/users/${id}`, payload).then((res) => res.data.data)
}

export function updateUserStatus(id: string, isActive: boolean) {
  return apiClient
    .patch<ApiResponse<User>>(`/users/${id}/status`, { is_active: isActive })
    .then((res) => res.data.data)
}

export function relieveUser(id: string, relievedOn: string) {
  return apiClient
    .patch<ApiResponse<User>>(`/users/${id}/relieve`, { relieved_on: relievedOn })
    .then((res) => res.data.data)
}

export function updateUserManager(userId: string, managerId: string | null) {
  return apiClient
    .patch<ApiResponse<User>>(`/users/${userId}/manager`, { manager_id: managerId })
    .then((res) => res.data.data)
}
