import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { STATUS_LABELS, type WorkItemStatus } from '@/types'

interface StatusTransitionControlProps {
  /** Valid next-states for this item, as computed by the backend (WorkItem.next_statuses). */
  nextStatuses: WorkItemStatus[]
  onSelect: (status: WorkItemStatus) => void
  disabled?: boolean
}

/**
 * Purely presentational — only ever renders whatever next_statuses the
 * backend sent for this item, never a free dropdown to any status. The
 * frontend does not know or guess the state machine rules itself.
 */
export function StatusTransitionControl({
  nextStatuses,
  onSelect,
  disabled,
}: StatusTransitionControlProps) {
  if (nextStatuses.length === 0) {
    return <span className="text-sm text-muted-foreground">No further transitions available</span>
  }

  return (
    <Select onValueChange={(value) => onSelect(value as WorkItemStatus)} disabled={disabled}>
      <SelectTrigger className="w-48" aria-label="Change status">
        <SelectValue placeholder="Change status..." />
      </SelectTrigger>
      <SelectContent>
        {nextStatuses.map((status) => (
          <SelectItem key={status} value={status}>
            {STATUS_LABELS[status]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
