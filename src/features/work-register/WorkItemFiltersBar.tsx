import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAssignableUsers, useDepartmentOptions } from '@/features/work-register/hooks'
import {
  ENTRY_TYPES,
  FILTERABLE_STATUSES,
  PRIORITIES,
  PRIORITY_LABELS,
  STATUS_LABELS,
  type WorkItemFilters,
} from '@/types'

interface WorkItemFiltersBarProps {
  filters: WorkItemFilters
  onChange: (filters: WorkItemFilters) => void
  showDepartmentFilter?: boolean
  showAssigneeFilter?: boolean
}

const ALL = '__all__'

export function WorkItemFiltersBar({
  filters,
  onChange,
  showDepartmentFilter = false,
  showAssigneeFilter = false,
}: WorkItemFiltersBarProps) {
  const [departmentQuery, setDepartmentQuery] = useState('')
  const [assigneeQuery, setAssigneeQuery] = useState('')

  const { data: departments, isLoading: departmentsLoading } = useDepartmentOptions(
    showDepartmentFilter,
    departmentQuery,
  )
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

  function clearAll() {
    onChange({ page: 1, per_page: filters.per_page })
  }

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => !['page', 'per_page', 'sort_by', 'sort_dir'].includes(key) && Boolean(value),
  )

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Status</label>
        <Select
          value={filters.status ?? ALL}
          onValueChange={(v) => set('status', v === ALL ? undefined : (v as WorkItemFilters['status']))}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All</SelectItem>
            {FILTERABLE_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Priority</label>
        <Select
          value={filters.priority ?? ALL}
          onValueChange={(v) =>
            set('priority', v === ALL ? undefined : (v as WorkItemFilters['priority']))
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All</SelectItem>
            {PRIORITIES.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {PRIORITY_LABELS[priority]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Entry type</label>
        <Select
          value={filters.entry_type ?? ALL}
          onValueChange={(v) =>
            set('entry_type', v === ALL ? undefined : (v as WorkItemFilters['entry_type']))
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All</SelectItem>
            {ENTRY_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type === 'task' ? 'Task' : 'Support Call'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showDepartmentFilter && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Department</label>
          <Combobox
            className="w-44"
            value={filters.department_id ?? ALL}
            onValueChange={(v) => set('department_id', v === ALL ? undefined : v)}
            onSearchChange={setDepartmentQuery}
            isLoading={departmentsLoading}
            searchPlaceholder="Search departments..."
            options={[
              { value: ALL, label: 'All' },
              ...(departments ?? []).map((dept) => ({ value: dept.id, label: dept.name })),
            ]}
          />
        </div>
      )}

      {showAssigneeFilter && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Assigned to</label>
          <Combobox
            className="w-44"
            value={filters.assigned_to_id ?? ALL}
            onValueChange={(v) => set('assigned_to_id', v === ALL ? undefined : v)}
            onSearchChange={setAssigneeQuery}
            isLoading={assignableUsersLoading}
            searchPlaceholder="Search people..."
            options={[
              { value: ALL, label: 'Anyone' },
              ...(assignableUsers ?? []).map((user) => ({ value: user.id, label: user.name })),
            ]}
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
