export const WORK_ITEM_STATUSES = ['open', 'in_progress', 'pending', 'closed', 'deleted'] as const
export type WorkItemStatus = (typeof WORK_ITEM_STATUSES)[number]

/** Statuses a user can filter/select by — "deleted" is a terminal state reached only via delete. */
export const FILTERABLE_STATUSES = WORK_ITEM_STATUSES.filter((s) => s !== 'deleted')

export const ENTRY_TYPES = ['task', 'support_call'] as const
export type EntryType = (typeof ENTRY_TYPES)[number]

export const PRIORITIES = ['low', 'medium', 'high', 'critical'] as const
export type Priority = (typeof PRIORITIES)[number]

export const SOURCES = ['branch_client', 'internal'] as const
export type Source = (typeof SOURCES)[number]

export const BRANCH_TYPES = ['branch', 'client'] as const
export type BranchType = (typeof BRANCH_TYPES)[number]

export const STATUS_LABELS: Record<WorkItemStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  pending: 'Pending',
  closed: 'Closed',
  deleted: 'Deleted',
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
}

export interface Department {
  id: string
  name: string
  code: string
  is_active: boolean
}

export interface Branch {
  id: string
  name: string
  code: string
  type: BranchType
  is_active: boolean
}

export interface Category {
  id: string
  name: string
  department_id: string | null
  is_active: boolean
}

export interface SlaSetting {
  id: string
  priority: Priority
  hours: number
}

/** Item-level abilities, computed server-side by WorkItemPolicy. Drives all edit/delete/reassign UI. */
export interface WorkItemPermissions {
  can_update: boolean
  can_update_status: boolean
  can_reassign: boolean
  can_delete: boolean
}

/** Dashboard stat card data — scoped server-side exactly like the task list. */
export interface WorkItemStats {
  total: number
  open: number
  in_progress: number
  pending: number
  closed: number
  overdue: number
}

export interface WorkItemTimelineEntry {
  id: string
  actor: { id: string; name: string } | null
  action: string
  from_status: WorkItemStatus | null
  to_status: WorkItemStatus | null
  assigned_to_name: string | null
  note: string | null
  created_at: string
}

export interface WorkItem {
  id: string
  task_id: string
  department: Department | null
  entry_type: EntryType
  assigned_by: { id: string; name: string } | null
  assigned_to: { id: string; name: string } | null
  created_by: { id: string; name: string } | null
  source: Source
  branch: Branch | null
  category: Category | null
  priority: Priority
  subject: string
  description: string
  status: WorkItemStatus
  start_time: string | null
  end_time: string | null
  resolution: string | null
  remarks: string | null
  sla_due_at: string | null
  timeline?: WorkItemTimelineEntry[]
  created_at: string
  updated_at: string

  /** Server-computed — the frontend never re-derives these. */
  permissions: WorkItemPermissions | null
  editable_fields: string[]
  next_statuses: WorkItemStatus[]
}

export interface WorkItemFilters {
  status?: WorkItemStatus
  priority?: Priority
  department_id?: string
  assigned_to_id?: string
  entry_type?: EntryType
  branch_id?: string
  category_id?: string
  date_from?: string
  date_to?: string
  sort_by?: 'created_at' | 'priority' | 'status' | 'task_id'
  sort_dir?: 'asc' | 'desc'
  page?: number
  per_page?: number
}

export interface CreateWorkItemPayload {
  department_id: string
  entry_type: EntryType
  assigned_to_id: string
  source: Source
  branch_id?: string | null
  category_id?: string | null
  priority: Priority
  subject: string
  description: string
}

export interface UpdateWorkItemPayload {
  entry_type?: EntryType
  source?: Source
  branch_id?: string | null
  category_id?: string | null
  priority?: Priority
  subject?: string
  description?: string
  resolution?: string | null
  remarks?: string | null
}
