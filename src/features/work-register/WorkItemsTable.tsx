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
import { StatusBadge } from '@/features/work-register/StatusBadge'
import { PriorityBadge } from '@/features/work-register/PriorityBadge'
import { TablePagination } from '@/features/work-register/TablePagination'
import type { PaginatedResponse, WorkItem } from '@/types'

const COLUMNS = [
  'Sl.No',
  'Date',
  'Work ID',
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
  data: PaginatedResponse<WorkItem> | undefined
  isLoading: boolean
  isError: boolean
  onRowClick: (item: WorkItem) => void
  onPageChange: (page: number) => void
}

export function WorkItemsTable({
  data,
  isLoading,
  isError,
  onRowClick,
  onPageChange,
}: WorkItemsTableProps) {
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

  const items = data?.data ?? []

  if (items.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
        No tasks found. Try adjusting your filters or create a new one.
      </div>
    )
  }

  const startIndex = ((data?.meta.current_page ?? 1) - 1) * (data?.meta.per_page ?? 15)

  return (
    <div className="space-y-3">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {COLUMNS.map((col) => (
                <TableHead key={col}>{col}</TableHead>
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
                <TableCell className="font-medium">{item.work_id}</TableCell>
                <TableCell className="capitalize">{item.entry_type.replace('_', ' ')}</TableCell>
                <TableCell className="capitalize">{item.assigned_by}</TableCell>
                <TableCell>{item.assigned_to?.name ?? '—'}</TableCell>
                <TableCell className="capitalize">{item.source.replace('_', ' ')}</TableCell>
                <TableCell>{item.branch?.name ?? '—'}</TableCell>
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
      </div>

      {data && <TablePagination meta={data.meta} onPageChange={onPageChange} />}
    </div>
  )
}
