import { apiClient } from '@/api/client'
import type { ApiResponse, Branch, Category, Department, SlaSetting, User } from '@/types'

export function listDepartments() {
  return apiClient
    .get<ApiResponse<Department[]>>('/departments')
    .then((res) => res.data.data)
}

export function listBranches() {
  return apiClient.get<ApiResponse<Branch[]>>('/branches').then((res) => res.data.data)
}

export function listCategories(departmentId?: string) {
  return apiClient
    .get<ApiResponse<Category[]>>('/categories', { params: { department_id: departmentId } })
    .then((res) => res.data.data)
}

export function createDepartment(payload: { name: string; code: string }) {
  return apiClient
    .post<ApiResponse<Department>>('/departments', payload)
    .then((res) => res.data.data)
}

export function createCategory(payload: { name: string; department_id?: string | null }) {
  return apiClient.post<ApiResponse<Category>>('/categories', payload).then((res) => res.data.data)
}

export function listSlaSettings() {
  return apiClient.get<ApiResponse<SlaSetting[]>>('/sla-settings').then((res) => res.data.data)
}

export function listUsers() {
  return apiClient.get<ApiResponse<User[]>>('/users').then((res) => res.data.data)
}

/** The actor's own record plus everyone they're allowed to assign a task to. */
export function listAssignableUsers() {
  return apiClient.get<ApiResponse<User[]>>('/users/me/assignable').then((res) => res.data.data)
}

export function updateUserManager(userId: string, managerId: string | null) {
  return apiClient
    .patch<ApiResponse<User>>(`/users/${userId}/manager`, { manager_id: managerId })
    .then((res) => res.data.data)
}
