import { z } from 'zod'
import { BRANCH_TYPES } from '@/types'

export const departmentFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  code: z.string().min(1, 'Code is required').max(50),
})

export type DepartmentFormValues = z.infer<typeof departmentFormSchema>

export const branchFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  code: z.string().min(1, 'Code is required').max(50),
  type: z.enum(BRANCH_TYPES),
})

export type BranchFormValues = z.infer<typeof branchFormSchema>

export const categoryFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  // Empty means "common" — applies regardless of which department is selected.
  department_ids: z.array(z.string().uuid()),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>
