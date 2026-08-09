import { apiClient } from '@/api/client'
import type {
  CreateWorkItemPayload,
  PaginatedResponse,
  UpdateWorkItemPayload,
  WorkItem,
  WorkItemFilters,
  WorkItemStats,
  WorkItemStatus,
} from '@/types'

export function listWorkItems(filters: WorkItemFilters = {}) {
  return apiClient
    .get<PaginatedResponse<WorkItem>>('/work-items', { params: filters })
    .then((res) => res.data)
}

export function getWorkItemStats() {
  return apiClient.get<{ data: WorkItemStats }>('/work-items/stats').then((res) => res.data.data)
}

export function getWorkItem(id: string) {
  return apiClient.get<{ data: WorkItem }>(`/work-items/${id}`).then((res) => res.data.data)
}

export function createWorkItem(payload: CreateWorkItemPayload) {
  return apiClient.post<{ data: WorkItem }>('/work-items', payload).then((res) => res.data.data)
}

export function updateWorkItem(id: string, payload: UpdateWorkItemPayload) {
  return apiClient
    .patch<{ data: WorkItem }>(`/work-items/${id}`, payload)
    .then((res) => res.data.data)
}

interface UpdateStatusPayload {
  status: WorkItemStatus
  resolution?: string | null
  note?: string | null
}

export function updateWorkItemStatus(id: string, payload: UpdateStatusPayload) {
  return apiClient
    .patch<{ data: WorkItem }>(`/work-items/${id}/status`, payload)
    .then((res) => res.data.data)
}

interface ReassignPayload {
  assigned_to_id: string
  note?: string | null
}

export function reassignWorkItem(id: string, payload: ReassignPayload) {
  return apiClient
    .patch<{ data: WorkItem }>(`/work-items/${id}/reassign`, payload)
    .then((res) => res.data.data)
}

/** Logical delete only — backend sets status to "deleted", never removes the row. */
export function deleteWorkItem(id: string) {
  return apiClient.delete<{ success: boolean }>(`/work-items/${id}`).then((res) => res.data)
}
