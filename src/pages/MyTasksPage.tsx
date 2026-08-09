import { useState } from 'react'
import { WorkItemsTable } from '@/features/work-register/WorkItemsTable'
import { WorkItemFiltersBar } from '@/features/work-register/WorkItemFiltersBar'
import { WorkItemDetailSheet } from '@/features/work-register/WorkItemDetailSheet'
import { useWorkItems } from '@/features/work-register/hooks'
import { useAuthStore } from '@/stores/authStore'
import type { WorkItem, WorkItemFilters } from '@/types'

export function MyTasksPage() {
  const user = useAuthStore((state) => state.user)
  const [filters, setFilters] = useState<WorkItemFilters>({ page: 1, per_page: 15 })
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null)

  const { data, isLoading, isError } = useWorkItems({
    ...filters,
    assigned_to_id: user?.id,
  })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">My Tasks</h1>

      <WorkItemFiltersBar filters={filters} onChange={setFilters} />

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
    </div>
  )
}
