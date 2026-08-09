import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { STATUS_LABELS, type WorkItemStatus } from '@/types'

const STATUS_STYLES: Record<WorkItemStatus, string> = {
  open: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
  in_progress: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  pending: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
  closed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  deleted: 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

export function StatusBadge({ status }: { status: WorkItemStatus }) {
  return (
    <Badge variant="outline" className={cn('border-transparent', STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </Badge>
  )
}
