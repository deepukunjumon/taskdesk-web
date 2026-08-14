import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as workItemsApi from '@/api/workItems'
import * as lookupsApi from '@/api/lookups'
import type { CreateWorkItemPayload, UpdateWorkItemPayload, WorkItemStatus } from '@/types'

const WORK_ITEMS_KEY = 'work-items'

export function useWorkItem(id: string | null) {
  return useQuery({
    queryKey: [WORK_ITEMS_KEY, id],
    queryFn: () => workItemsApi.getWorkItem(id as string),
    enabled: id !== null,
  })
}

export function useDepartments(enabled: boolean = true) {
  return useQuery({ queryKey: ['departments'], queryFn: () => lookupsApi.listDepartments(), enabled })
}

/**
 * Minimal, active-only department list for dropdowns/comboboxes — cheaper
 * than useDepartments() and supports a `q` name search for search-as-you-type.
 */
export function useDepartmentOptions(enabled: boolean = true, q?: string) {
  return useQuery({
    queryKey: ['departments', 'options', q ?? null],
    queryFn: () => lookupsApi.listDepartmentOptions(q),
    enabled,
    placeholderData: (previous) => previous,
  })
}

export function useBranches() {
  return useQuery({ queryKey: ['branches'], queryFn: () => lookupsApi.listBranches() })
}

export function useCategories(departmentId?: string) {
  return useQuery({
    queryKey: ['categories', departmentId],
    queryFn: () => lookupsApi.listCategories(departmentId),
  })
}

/**
 * Scoped per the current actor — self + descendants, or everyone for
 * admin/superadmin. Passing `departmentId` narrows it to that department,
 * so the "Assigned To" list stays in sync once a department is picked.
 * Passing `q` narrows it further to a name search for search-as-you-type;
 * `placeholderData` keeps the previous results on screen while a new
 * keystroke's request is in flight, so the list doesn't flash empty.
 */
export function useAssignableUsers(enabled: boolean = true, departmentId?: string, q?: string) {
  return useQuery({
    queryKey: ['users', 'assignable', departmentId ?? null, q ?? null],
    queryFn: () => lookupsApi.listAssignableUsers(departmentId, q),
    enabled,
    placeholderData: (previous) => previous,
  })
}

export function useCreateWorkItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateWorkItemPayload) => workItemsApi.createWorkItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORK_ITEMS_KEY] })
      toast.success('Task created.')
    },
    onError: () => toast.error('Could not create the task.'),
  })
}

export function useUpdateWorkItem(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateWorkItemPayload) => workItemsApi.updateWorkItem(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORK_ITEMS_KEY] })
      toast.success('Task updated.')
    },
    onError: () => toast.error('Could not update the task.'),
  })
}

interface UpdateStatusInput {
  status: WorkItemStatus
  resolution?: string | null
  note?: string | null
}

export function useUpdateWorkItemStatus(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateStatusInput) => workItemsApi.updateWorkItemStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORK_ITEMS_KEY] })
      toast.success('Status updated.')
    },
    onError: (error: unknown) => {
      const message = extractErrorMessage(error) ?? 'Could not update the status.'
      toast.error(message)
    },
  })
}

export function useReassignWorkItem(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { assigned_to_id: string; note?: string | null }) =>
      workItemsApi.reassignWorkItem(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORK_ITEMS_KEY] })
      toast.success('Task reassigned.')
    },
    onError: () => toast.error('Could not reassign the task.'),
  })
}

export function useDeleteWorkItem(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => workItemsApi.deleteWorkItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORK_ITEMS_KEY] })
      toast.success('Task deleted.')
    },
    onError: () => toast.error('Could not delete the task.'),
  })
}

function extractErrorMessage(error: unknown): string | null {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message ===
      'string'
  ) {
    return (error as { response: { data: { message: string } } }).response.data.message
  }

  return null
}
