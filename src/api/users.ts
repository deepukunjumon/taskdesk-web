import { apiClient } from '@/api/client'
import type { AdminUserFilters, ApiResponse, PaginatedResponse, User } from '@/types'

export function listAdminUsers(filters: AdminUserFilters = {}) {
  return apiClient
    .get<PaginatedResponse<User>>('/users', { params: filters })
    .then((res) => res.data)
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
