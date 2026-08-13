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

/**
 * The backend takes multi-value filters (status, priority, entry_type,
 * department_id, assigned_to_id) as a comma-separated string rather than
 * PHP's array query-string syntax — simpler than getting axios to serialize
 * arrays a specific way, and avoids ever sending an empty array as a filter.
 */
function serializeFilters(filters: WorkItemFilters): Record<string, string | number | undefined> {
  const params: Record<string, string | number | undefined> = {}

  for (const [key, value] of Object.entries(filters)) {
    if (Array.isArray(value)) {
      if (value.length > 0) {
        params[key] = value.join(',')
      }
    } else if (value !== undefined) {
      params[key] = value
    }
  }

  return params
}

export function listWorkItems(filters: WorkItemFilters = {}) {
  return apiClient
    .get<PaginatedResponse<WorkItem>>('/work-items', { params: serializeFilters(filters) })
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
