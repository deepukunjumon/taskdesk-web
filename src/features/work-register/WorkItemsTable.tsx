import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTablePagination } from '@/components/ui/data-table-pagination'
import { StatusBadge } from '@/features/work-register/StatusBadge'
import { PriorityBadge } from '@/features/work-register/PriorityBadge'
import type { PaginatedMeta, WorkItem } from '@/types'

const BASE_COLUMNS = [
  'Sl.No',
  'Date',
  'Task ID',
  'Entry Type',
  'Assigned By',
  'Assigned To',
  'Source',
  'Branch/Client',
  'Priority',
  'Subject',
  'Status',
]

interface WorkItemsTableProps {
  items: WorkItem[] | undefined
  meta: PaginatedMeta | undefined
  isLoading: boolean
  isError: boolean
  onRowClick: (item: WorkItem) => void
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: number) => void
  /** Every row is already the current user — e.g. My Tasks — so the column is redundant. */
  showAssigneeColumn?: boolean
}

export function WorkItemsTable({
  items: itemsProp,
  meta,
  isLoading,
  isError,
  onRowClick,
  onPageChange,
  onPerPageChange,
  showAssigneeColumn = true,
}: WorkItemsTableProps) {
  const columns = showAssigneeColumn
    ? BASE_COLUMNS
    : BASE_COLUMNS.filter((col) => col !== 'Assigned To')
  if (isError) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center text-sm text-destructive">
        Failed to load tasks. Please try again.
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-2 rounded-md border p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  const items = itemsProp ?? []

  if (items.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
        No tasks found. Try adjusting your filters or create a new one.
      </div>
    )
  }

  const startIndex = ((meta?.current_page ?? 1) - 1) * (meta?.per_page ?? 15)

  return (
    <div className="space-y-3">
      <Table containerClassName="overflow-y-auto overscroll-contain rounded-md border">
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col} className="sticky top-0 bg-background">
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow
              key={item.id}
              className="cursor-pointer"
              onClick={() => onRowClick(item)}
            >
              <TableCell>{startIndex + index + 1}</TableCell>
              <TableCell>{format(new Date(item.created_at), 'dd MMM yyyy')}</TableCell>
              <TableCell className="font-medium">{item.task_id}</TableCell>
              <TableCell className="capitalize">{item.entry_type.replace('_', ' ')}</TableCell>
              <TableCell>{item.assigned_by?.name ?? ''}</TableCell>
              {showAssigneeColumn && <TableCell>{item.assigned_to?.name ?? ''}</TableCell>}
              <TableCell className="capitalize">{item.source.replace('_', ' ')}</TableCell>
              <TableCell>{item.branch?.name ?? ''}</TableCell>
              <TableCell>
                <PriorityBadge priority={item.priority} />
              </TableCell>
              <TableCell className="max-w-60 truncate">{item.subject}</TableCell>
              <TableCell>
                <StatusBadge status={item.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {meta && (
        <DataTablePagination meta={meta} onPageChange={onPageChange} onPerPageChange={onPerPageChange} />
      )}
    </div>
  )
}
