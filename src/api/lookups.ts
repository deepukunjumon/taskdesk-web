import { apiClient } from '@/api/client'
import type {
  ApiResponse,
  Branch,
  BranchType,
  Category,
  Department,
  SlaSetting,
  User,
} from '@/types'

export function listDepartments(includeInactive: boolean = false) {
  return apiClient
    .get<ApiResponse<Department[]>>('/departments', {
      params: includeInactive ? { include_inactive: 1 } : undefined,
    })
    .then((res) => res.data.data)
}

export function listBranches(includeInactive: boolean = false) {
  return apiClient
    .get<ApiResponse<Branch[]>>('/branches', {
      params: includeInactive ? { include_inactive: 1 } : undefined,
    })
    .then((res) => res.data.data)
}

export function listCategories(departmentId?: string, includeInactive: boolean = false) {
  return apiClient
    .get<ApiResponse<Category[]>>('/categories', {
      params: {
        department_id: departmentId,
        ...(includeInactive ? { include_inactive: 1 } : {}),
      },
    })
    .then((res) => res.data.data)
}

export function createDepartment(payload: { name: string; code: string }) {
  return apiClient
    .post<ApiResponse<Department>>('/departments', payload)
    .then((res) => res.data.data)
}

export function updateDepartment(id: string, payload: { name?: string; code?: string }) {
  return apiClient
    .patch<ApiResponse<Department>>(`/departments/${id}`, payload)
    .then((res) => res.data.data)
}

export function toggleDepartmentActive(id: string) {
  return apiClient
    .patch<ApiResponse<Department>>(`/departments/${id}/toggle-active`)
    .then((res) => res.data.data)
}

export function deleteDepartment(id: string) {
  return apiClient.delete<{ success: boolean }>(`/departments/${id}`).then((res) => res.data)
}

export function createBranch(payload: { name: string; code: string; type: BranchType }) {
  return apiClient.post<ApiResponse<Branch>>('/branches', payload).then((res) => res.data.data)
}

export function updateBranch(
  id: string,
  payload: { name?: string; code?: string; type?: BranchType },
) {
  return apiClient
    .patch<ApiResponse<Branch>>(`/branches/${id}`, payload)
    .then((res) => res.data.data)
}

export function toggleBranchActive(id: string) {
  return apiClient
    .patch<ApiResponse<Branch>>(`/branches/${id}/toggle-active`)
    .then((res) => res.data.data)
}

export function deleteBranch(id: string) {
  return apiClient.delete<{ success: boolean }>(`/branches/${id}`).then((res) => res.data)
}

export function createCategory(payload: { name: string; department_id?: string | null }) {
  return apiClient.post<ApiResponse<Category>>('/categories', payload).then((res) => res.data.data)
}

export function updateCategory(
  id: string,
  payload: { name?: string; department_id?: string | null },
) {
  return apiClient
    .patch<ApiResponse<Category>>(`/categories/${id}`, payload)
    .then((res) => res.data.data)
}

export function toggleCategoryActive(id: string) {
  return apiClient
    .patch<ApiResponse<Category>>(`/categories/${id}/toggle-active`)
    .then((res) => res.data.data)
}

export function deleteCategory(id: string) {
  return apiClient.delete<{ success: boolean }>(`/categories/${id}`).then((res) => res.data)
}

export function listSlaSettings() {
  return apiClient.get<ApiResponse<SlaSetting[]>>('/sla-settings').then((res) => res.data.data)
}

export function listUsers() {
  return apiClient.get<ApiResponse<User[]>>('/users').then((res) => res.data.data)
}

/**
 * The actor's own record plus everyone they're allowed to assign a task to.
 * Passing `departmentId` narrows the result to that department, matching
 * the backend's department-scoped assignment check.
 */
export function listAssignableUsers(departmentId?: string) {
  return apiClient
    .get<ApiResponse<User[]>>('/users/me/assignable', {
      params: departmentId ? { department_id: departmentId } : undefined,
    })
    .then((res) => res.data.data)
}

export function updateUserManager(userId: string, managerId: string | null) {
  return apiClient
    .patch<ApiResponse<User>>(`/users/${userId}/manager`, { manager_id: managerId })
    .then((res) => res.data.data)
}
