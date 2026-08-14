import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { WorkItemsTable } from '@/features/work-register/WorkItemsTable'
import { WorkItemFiltersBar } from '@/features/work-register/WorkItemFiltersBar'
import { WorkItemDetailSheet } from '@/features/work-register/WorkItemDetailSheet'
import { WorkItemCreateSheet } from '@/features/work-register/WorkItemCreateSheet'
import { listWorkItems } from '@/api/workItems'
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery'
import { useAuthStore } from '@/stores/authStore'
import type { WorkItem, WorkItemFilters } from '@/types'

export function MyTasksPage() {
  const user = useAuthStore((state) => state.user)
  const [filters, setFilters] = useState<WorkItemFilters>({})
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const { data, meta, isLoading, isError, setPage, setPerPage } = usePaginatedQuery<
    WorkItem,
    WorkItemFilters
  >({
    queryKey: ['work-items'],
    queryFn: listWorkItems,
    filters: { ...filters, assigned_to_id: user?.id ? [user.id] : undefined },
  })

  function handleFiltersChange(next: WorkItemFilters) {
    setFilters(next)
    setPage(1)
  }

  // Managers and admin/superadmin already have the full Task Register for
  // this; a non-managing plain user has no other way to log a task for
  // themself, so give them a self-assign shortcut right here.
  const showSelfAssignButton =
    !!user &&
    user.roles.every((role) => role === 'user') &&
    !(user.abilities?.is_reporting_manager ?? false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Tasks</h1>
        {showSelfAssignButton && (
          <Button onClick={() => setCreateOpen(true)}>Add Task</Button>
        )}
      </div>

      <WorkItemFiltersBar filters={filters} onChange={handleFiltersChange} />

      <WorkItemsTable
        items={data}
        meta={meta}
        isLoading={isLoading}
        isError={isError}
        onRowClick={setSelectedItem}
        onPageChange={setPage}
        onPerPageChange={setPerPage}
        showAssigneeColumn={false}
      />

      <WorkItemDetailSheet
        workItemId={selectedItem?.id ?? null}
        onOpenChange={(open) => !open && setSelectedItem(null)}
      />

      {showSelfAssignButton && (
        <WorkItemCreateSheet open={createOpen} onOpenChange={setCreateOpen} assignToSelf />
      )}
    </div>
  )
}
