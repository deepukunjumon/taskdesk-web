import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as workItemsApi from '@/api/workItems'
import * as lookupsApi from '@/api/lookups'
import type {
  CreateWorkItemPayload,
  UpdateWorkItemPayload,
  WorkItemFilters,
  WorkItemStatus,
} from '@/types'

const WORK_ITEMS_KEY = 'work-items'

export function useWorkItems(filters: WorkItemFilters) {
  return useQuery({
    queryKey: [WORK_ITEMS_KEY, filters],
    queryFn: () => workItemsApi.listWorkItems(filters),
    placeholderData: (previous) => previous,
  })
}

export function useWorkItem(id: string | null) {
  return useQuery({
    queryKey: [WORK_ITEMS_KEY, id],
    queryFn: () => workItemsApi.getWorkItem(id as string),
    enabled: id !== null,
  })
}

export function useDepartments() {
  return useQuery({ queryKey: ['departments'], queryFn: lookupsApi.listDepartments })
}

export function useBranches() {
  return useQuery({ queryKey: ['branches'], queryFn: lookupsApi.listBranches })
}

export function useCategories(departmentId?: string) {
  return useQuery({
    queryKey: ['categories', departmentId],
    queryFn: () => lookupsApi.listCategories(departmentId),
  })
}

export function useUsers() {
  return useQuery({ queryKey: ['users'], queryFn: lookupsApi.listUsers })
}

export function useCreateWorkItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateWorkItemPayload) => workItemsApi.createWorkItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORK_ITEMS_KEY] })
      toast.success('Work item created.')
    },
    onError: () => toast.error('Could not create the work item.'),
  })
}

export function useUpdateWorkItem(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateWorkItemPayload) => workItemsApi.updateWorkItem(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORK_ITEMS_KEY] })
      toast.success('Work item updated.')
    },
    onError: () => toast.error('Could not update the work item.'),
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
      toast.success('Work item reassigned.')
    },
    onError: () => toast.error('Could not reassign the work item.'),
  })
}

export function useDeleteWorkItem(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => workItemsApi.deleteWorkItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORK_ITEMS_KEY] })
      toast.success('Work item deleted.')
    },
    onError: () => toast.error('Could not delete the work item.'),
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
