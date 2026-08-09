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

export function listSlaSettings() {
  return apiClient.get<ApiResponse<SlaSetting[]>>('/sla-settings').then((res) => res.data.data)
}

export function listUsers() {
  return apiClient.get<ApiResponse<User[]>>('/users').then((res) => res.data.data)
}
