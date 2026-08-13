import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDepartmentOptions } from '@/features/work-register/hooks'
import { ROLES, type AdminUserFilters } from '@/types'

interface UserFiltersBarProps {
  filters: AdminUserFilters
  onChange: (filters: AdminUserFilters) => void
}

const ALL = '__all__'
const ACTIVE = 'active'
const INACTIVE = 'inactive'

export function UserFiltersBar({ filters, onChange }: UserFiltersBarProps) {
  const [departmentQuery, setDepartmentQuery] = useState('')
  const { data: departments, isLoading: departmentsLoading } = useDepartmentOptions(
    true,
    departmentQuery,
  )

  function set<K extends keyof AdminUserFilters>(key: K, value: AdminUserFilters[K] | undefined) {
    onChange({ ...filters, [key]: value, page: 1 })
  }

  function clearAll() {
    onChange({ page: 1, per_page: filters.per_page })
  }

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => !['page', 'per_page'].includes(key) && Boolean(value),
  )

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Search</label>
        <Input
          className="w-56"
          placeholder="Name, email, or employee code"
          value={filters.q ?? ''}
          onChange={(e) => set('q', e.target.value || undefined)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Role</label>
        <Select
          value={filters.role ?? ALL}
          onValueChange={(v) => set('role', v === ALL ? undefined : (v as AdminUserFilters['role']))}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All</SelectItem>
            {ROLES.map((role) => (
              <SelectItem key={role} value={role} className="capitalize">
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Status</label>
        <Select
          value={filters.is_active === undefined ? ALL : filters.is_active ? ACTIVE : INACTIVE}
          onValueChange={(v) =>
            set('is_active', v === ALL ? undefined : v === ACTIVE)
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All</SelectItem>
            <SelectItem value={ACTIVE}>Active</SelectItem>
            <SelectItem value={INACTIVE}>Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearAll}>
          Clear filters
        </Button>
      )}
    </div>
  )
}
