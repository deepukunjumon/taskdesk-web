import { z } from 'zod'
import { EXTERNAL_ASSIGNED_BY_OPTIONS, ENTRY_TYPES, PRIORITIES, SOURCES } from '@/types'

export const workItemFormSchema = z.object({
  department_id: z.string().uuid('Select a department'),
  entry_type: z.enum(ENTRY_TYPES),
  // 'self'/'manager' are computed server-side — only an external channel is
  // ever pickable here, and it's optional (blank means "internal, computed").
  assigned_by: z.enum(EXTERNAL_ASSIGNED_BY_OPTIONS).optional().or(z.literal('')),
  assigned_to_id: z.string().uuid('Select an assignee'),
  source: z.enum(SOURCES),
  branch_id: z.string().uuid().optional().or(z.literal('')),
  category_id: z.string().uuid().optional().or(z.literal('')),
  priority: z.enum(PRIORITIES),
  subject: z.string().min(1, 'Subject is required').max(255),
  description: z.string().min(1, 'Description is required'),
})

export type WorkItemFormValues = z.infer<typeof workItemFormSchema>

/**
 * Covers every field the backend might ever list in WorkItem.editable_fields
 * (see WorkItemPolicy::editableFields()) — never department_id/assigned_to_id,
 * those are immutable via edit and never appear in that list. All optional
 * because WorkItemEditForm only renders/submits whichever subset of these
 * keys the backend says this user may edit on this item.
 */
export const workItemEditSchema = z.object({
  entry_type: z.enum(ENTRY_TYPES).optional(),
  assigned_by: z.enum(EXTERNAL_ASSIGNED_BY_OPTIONS).optional().or(z.literal('')),
  source: z.enum(SOURCES).optional(),
  branch_id: z.string().uuid().optional().or(z.literal('')),
  category_id: z.string().uuid().optional().or(z.literal('')),
  priority: z.enum(PRIORITIES).optional(),
  subject: z.string().min(1, 'Subject is required').max(255).optional(),
  description: z.string().min(1, 'Description is required').optional(),
  resolution: z.string().optional().or(z.literal('')),
  remarks: z.string().optional().or(z.literal('')),
})

export type WorkItemEditValues = z.infer<typeof workItemEditSchema>
