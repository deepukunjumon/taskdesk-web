import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { PRIORITY_LABELS, type Priority } from '@/types'

const PRIORITY_STYLES: Record<Priority, string> = {
  low: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-sky-200 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
  high: 'bg-orange-200 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
  critical: 'bg-red-200 text-red-800 dark:bg-red-950 dark:text-red-300',
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge variant="outline" className={cn('border-transparent', PRIORITY_STYLES[priority])}>
      {PRIORITY_LABELS[priority]}
    </Badge>
  )
}
