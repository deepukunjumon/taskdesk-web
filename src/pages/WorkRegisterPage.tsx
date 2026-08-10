import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { WorkItemsTable } from '@/features/work-register/WorkItemsTable'
import { WorkItemFiltersBar } from '@/features/work-register/WorkItemFiltersBar'
import { WorkItemDetailSheet } from '@/features/work-register/WorkItemDetailSheet'
import { WorkItemCreateSheet } from '@/features/work-register/WorkItemCreateSheet'
import { useWorkItems } from '@/features/work-register/hooks'
import { useAuthStore } from '@/stores/authStore'
import type { WorkItem, WorkItemFilters } from '@/types'

export function WorkRegisterPage() {
  const user = useAuthStore((state) => state.user)
  const [filters, setFilters] = useState<WorkItemFilters>({ page: 1, per_page: 15 })
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const { data, isLoading, isError } = useWorkItems(filters)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Task Register</h1>
        {user?.abilities?.can_create_work_items && (
          <Button onClick={() => setCreateOpen(true)}>Add New Task</Button>
        )}
      </div>

      <WorkItemFiltersBar
        filters={filters}
        onChange={setFilters}
        showDepartmentFilter
        showAssigneeFilter
      />

      <WorkItemsTable
        data={data}
        isLoading={isLoading}
        isError={isError}
        onRowClick={setSelectedItem}
        onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
      />

      <WorkItemDetailSheet
        workItemId={selectedItem?.id ?? null}
        onOpenChange={(open) => !open && setSelectedItem(null)}
      />

      <WorkItemCreateSheet open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
