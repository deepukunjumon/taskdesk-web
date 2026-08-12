import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  ClipboardList,
  Loader2,
  PauseCircle,
  type LucideIcon,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useWorkItemStats } from '@/features/dashboard/hooks'
import type { WorkItemStats } from '@/types'

interface StatDefinition {
  key: keyof WorkItemStats
  label: string
  icon: LucideIcon
  iconClassName: string
}

const STAT_DEFINITIONS: StatDefinition[] = [
  { key: 'total', label: 'Total', icon: ClipboardList, iconClassName: 'text-blue-500' },
  { key: 'open', label: 'Open', icon: CircleDot, iconClassName: 'text-blue-500' },
  { key: 'in_progress', label: 'In Progress', icon: Loader2, iconClassName: 'text-amber-500' },
  { key: 'pending', label: 'Pending', icon: PauseCircle, iconClassName: 'text-purple-500' },
  { key: 'closed', label: 'Closed', icon: CheckCircle2, iconClassName: 'text-emerald-500' },
  { key: 'overdue', label: 'Overdue', icon: AlertTriangle, iconClassName: 'text-red-500' },
]

export function StatsCards() {
  const { data, isLoading, isError } = useWorkItemStats()

  if (isError) {
    return (
      <div className="rounded-md border border-dashed p-6 text-center text-sm text-destructive">
        Failed to load dashboard stats. Please try again.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {STAT_DEFINITIONS.map(({ key, label, icon: Icon, iconClassName }) => (
        <Card key={key}>
          <CardContent className="flex items-center gap-3">
            <Icon className={cn('size-6 shrink-0', iconClassName)} />
            <div className="min-w-0">
              {isLoading || !data ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                <p className="text-2xl font-semibold tabular-nums">{data[key]}</p>
              )}
              <p className="text-sm font-medium">{label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
