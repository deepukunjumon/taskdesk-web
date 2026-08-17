import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as lookupsApi from '@/api/lookups'
import * as usersApi from '@/api/users'
import type { AdminUserFilters, BranchType, Role } from '@/types'

const ADMIN_USERS_KEY = ['users', 'admin']

export function useAdminUsers(filters: AdminUserFilters) {
  return useQuery({
    queryKey: [...ADMIN_USERS_KEY, filters],
    queryFn: () => usersApi.listAdminUsers(filters),
    placeholderData: (previous) => previous,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: {
      name: string
      email: string
      password: string
      role: Role
      mobile?: string | null
      employee_code?: string | null
      department_id?: string | null
      manager_id?: string | null
    }) => usersApi.createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY })
      toast.success('User created.')
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error) ?? 'Could not create the user.')
    },
  })
}

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: {
      name?: string
      email?: string
      mobile?: string | null
      employee_code?: string | null
      department_id?: string | null
    }) => usersApi.updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY })
      toast.success('User updated.')
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error) ?? 'Could not update the user.')
    },
  })
}

export function useUpdateUserStatus(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (isActive: boolean) => usersApi.updateUserStatus(id, isActive),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY })
      toast.success(user.is_active ? 'User enabled.' : 'User disabled.')
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error) ?? 'Could not update the user.')
    },
  })
}

export function useRelieveUser(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (relievedOn: string) => usersApi.relieveUser(id, relievedOn),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY })
      toast.success('User marked relieved.')
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error) ?? 'Could not mark the user relieved.')
    },
  })
}

export function useUpdateUserManager() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, managerId }: { userId: string; managerId: string | null }) =>
      usersApi.updateUserManager(userId, managerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY })
      toast.success('Manager updated.')
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error) ?? 'Could not update the manager.')
    },
  })
}

// ---------------------------------------------------------------------------
// Departments
// ---------------------------------------------------------------------------

/** Admin management screen only — includes inactive departments so they can be re-enabled. */
export function useAdminDepartments() {
  return useQuery({
    queryKey: ['departments', 'admin'],
    queryFn: () => lookupsApi.listDepartments(true),
  })
}

export function useCreateDepartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { name: string; code: string }) => lookupsApi.createDepartment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
      toast.success('Department created.')
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error) ?? 'Could not create the department.')
    },
  })
}

export function useUpdateDepartment(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { name?: string; code?: string }) =>
      lookupsApi.updateDepartment(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
      toast.success('Department updated.')
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error) ?? 'Could not update the department.')
    },
  })
}

export function useToggleDepartmentActive(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => lookupsApi.toggleDepartmentActive(id),
    onSuccess: (department) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
      toast.success(department.is_active ? 'Department enabled.' : 'Department disabled.')
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error) ?? 'Could not update the department.')
    },
  })
}

export function useDeleteDepartment(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => lookupsApi.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
      toast.success('Department deleted.')
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error) ?? 'Could not delete the department.')
    },
  })
}

// ---------------------------------------------------------------------------
// Branches
// ---------------------------------------------------------------------------

/** Admin management screen only — includes inactive branches so they can be re-enabled. */
export function useAdminBranches() {
  return useQuery({
    queryKey: ['branches', 'admin'],
    queryFn: () => lookupsApi.listBranches(true),
  })
}

export function useCreateBranch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { name: string; code: string; type: BranchType }) =>
      lookupsApi.createBranch(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] })
      toast.success('Branch created.')
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error) ?? 'Could not create the branch.')
    },
  })
}

export function useUpdateBranch(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { name?: string; code?: string; type?: BranchType }) =>
      lookupsApi.updateBranch(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] })
      toast.success('Branch updated.')
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error) ?? 'Could not update the branch.')
    },
  })
}

export function useToggleBranchActive(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => lookupsApi.toggleBranchActive(id),
    onSuccess: (branch) => {
      queryClient.invalidateQueries({ queryKey: ['branches'] })
      toast.success(branch.is_active ? 'Branch enabled.' : 'Branch disabled.')
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error) ?? 'Could not update the branch.')
    },
  })
}

export function useDeleteBranch(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => lookupsApi.deleteBranch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] })
      toast.success('Branch deleted.')
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error) ?? 'Could not delete the branch.')
    },
  })
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

/** Admin management screen only — includes inactive categories so they can be re-enabled. */
export function useAdminCategories() {
  return useQuery({
    queryKey: ['categories', 'admin'],
    queryFn: () => lookupsApi.listCategories(undefined, true),
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { name: string; department_ids?: string[] }) =>
      lookupsApi.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category created.')
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error) ?? 'Could not create the category.')
    },
  })
}

export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { name?: string; department_ids?: string[] }) =>
      lookupsApi.updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category updated.')
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error) ?? 'Could not update the category.')
    },
  })
}

export function useToggleCategoryActive(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => lookupsApi.toggleCategoryActive(id),
    onSuccess: (category) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success(category.is_active ? 'Category enabled.' : 'Category disabled.')
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error) ?? 'Could not update the category.')
    },
  })
}

export function useDeleteCategory(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => lookupsApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category deleted.')
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error) ?? 'Could not delete the category.')
    },
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
