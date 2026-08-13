import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MultiCombobox } from '@/components/ui/multi-combobox'
import { useAssignableUsers, useDepartmentOptions } from '@/features/work-register/hooks'
import { useAuthStore } from '@/stores/authStore'
import {
  ENTRY_TYPES,
  FILTERABLE_STATUSES,
  PRIORITIES,
  PRIORITY_LABELS,
  STATUS_LABELS,
  type EntryType,
  type Priority,
  type WorkItemFilters,
  type WorkItemStatus,
} from '@/types'

interface WorkItemFiltersBarProps {
  filters: WorkItemFilters
  onChange: (filters: WorkItemFilters) => void
  showDepartmentFilter?: boolean
  showAssigneeFilter?: boolean
}

const ENTRY_TYPE_LABELS: Record<EntryType, string> = {
  task: 'Task',
  support_call: 'Support Call',
}

export function WorkItemFiltersBar({
  filters,
  onChange,
  showDepartmentFilter = false,
  showAssigneeFilter = false,
}: WorkItemFiltersBarProps) {
  const [departmentQuery, setDepartmentQuery] = useState('')
  const [assigneeQuery, setAssigneeQuery] = useState('')

  const user = useAuthStore((state) => state.user)
  const isManager = user ? user.roles.every((role) => role === 'user') : false

  const { data: departments, isLoading: departmentsLoading } = useDepartmentOptions(
    showDepartmentFilter,
    departmentQuery,
  )
  // Unscoped — used only to derive which departments this actor actually has
  // a report in, so a manager's Department filter never offers one they have
  // no visibility into (they'd always get zero results). Admin/superadmin
  // skip this entirely and see every department, matching their unrestricted
  // work-item scope.
  const { data: allAssignableUsers } = useAssignableUsers(showDepartmentFilter && isManager)
  const allowedDepartmentIds = isManager
    ? new Set((allAssignableUsers ?? []).map((u) => u.department_id).filter((id): id is string => !!id))
    : null
  const departmentOptions = allowedDepartmentIds
    ? (departments ?? []).filter((dept) => allowedDepartmentIds.has(dept.id))
    : departments

  // Scoped per actor — self + hierarchy descendants for a plain manager,
  // everyone for admin/superadmin — same endpoint the assign-to dropdown
  // uses, so this filter never needs the admin-only /users endpoint.
  const { data: assignableUsers, isLoading: assignableUsersLoading } = useAssignableUsers(
    showAssigneeFilter,
    undefined,
    assigneeQuery,
  )

  function set<K extends keyof WorkItemFilters>(key: K, value: WorkItemFilters[K] | undefined) {
    onChange({ ...filters, [key]: value, page: 1 })
  }

  function setMulti<K extends 'status' | 'priority' | 'entry_type' | 'department_id' | 'assigned_to_id'>(
    key: K,
    values: string[],
  ) {
    set(key, (values.length > 0 ? values : undefined) as WorkItemFilters[K])
  }

  function clearAll() {
    onChange({ page: 1, per_page: filters.per_page })
  }

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) =>
      !['page', 'per_page', 'sort_by', 'sort_dir'].includes(key) &&
      (Array.isArray(value) ? value.length > 0 : Boolean(value)),
  )

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Status</label>
        <MultiCombobox
          className="w-40"
          value={filters.status ?? []}
          onValueChange={(values) => setMulti('status', values as WorkItemStatus[])}
          placeholder="All"
          options={FILTERABLE_STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] }))}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Priority</label>
        <MultiCombobox
          className="w-40"
          value={filters.priority ?? []}
          onValueChange={(values) => setMulti('priority', values as Priority[])}
          placeholder="All"
          options={PRIORITIES.map((priority) => ({ value: priority, label: PRIORITY_LABELS[priority] }))}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Entry type</label>
        <MultiCombobox
          className="w-40"
          value={filters.entry_type ?? []}
          onValueChange={(values) => setMulti('entry_type', values as EntryType[])}
          placeholder="All"
          options={ENTRY_TYPES.map((type) => ({ value: type, label: ENTRY_TYPE_LABELS[type] }))}
        />
      </div>

      {showDepartmentFilter && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Department</label>
          <MultiCombobox
            className="w-44"
            value={filters.department_id ?? []}
            onValueChange={(values) => setMulti('department_id', values)}
            onSearchChange={setDepartmentQuery}
            isLoading={departmentsLoading}
            placeholder="All"
            searchPlaceholder="Search departments..."
            options={(departmentOptions ?? []).map((dept) => ({ value: dept.id, label: dept.name }))}
          />
        </div>
      )}

      {showAssigneeFilter && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Assigned to</label>
          <MultiCombobox
            className="w-44"
            value={filters.assigned_to_id ?? []}
            onValueChange={(values) => setMulti('assigned_to_id', values)}
            onSearchChange={setAssigneeQuery}
            isLoading={assignableUsersLoading}
            placeholder="Anyone"
            searchPlaceholder="Search people..."
            options={(assignableUsers ?? []).map((user) => ({ value: user.id, label: user.name }))}
          />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">From</label>
        <Input
          type="date"
          className="w-40"
          value={filters.date_from ?? ''}
          onChange={(e) => set('date_from', e.target.value || undefined)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">To</label>
        <Input
          type="date"
          className="w-40"
          value={filters.date_to ?? ''}
          onChange={(e) => set('date_to', e.target.value || undefined)}
        />
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearAll}>
          Clear filters
        </Button>
      )}
    </div>
  )
}
