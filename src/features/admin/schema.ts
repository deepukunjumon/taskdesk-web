import { z } from 'zod'

export const departmentFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  code: z.string().min(1, 'Code is required').max(50),
})

export type DepartmentFormValues = z.infer<typeof departmentFormSchema>

export const categoryFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  // Blank means "no department" — the backend column is nullable.
  department_id: z.string().uuid().optional().or(z.literal('')),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>
