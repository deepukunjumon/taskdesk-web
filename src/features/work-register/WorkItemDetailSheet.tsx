import { useState } from 'react'
import { format } from 'date-fns'
import { Pencil, Trash2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatusBadge } from '@/features/work-register/StatusBadge'
import { PriorityBadge } from '@/features/work-register/PriorityBadge'
import { StatusTransitionControl } from '@/features/work-register/StatusTransitionControl'
import { WorkItemEditSheet } from '@/features/work-register/WorkItemEditSheet'
import {
  useAssignableUsers,
  useDeleteWorkItem,
  useUpdateWorkItemStatus,
  useReassignWorkItem,
  useWorkItem,
} from '@/features/work-register/hooks'
import { STATUS_LABELS, type WorkItem, type WorkItemStatus } from '@/types'

interface WorkItemDetailSheetProps {
  workItemId: string | null
  onOpenChange: (open: boolean) => void
}

export function WorkItemDetailSheet({ workItemId, onOpenChange }: WorkItemDetailSheetProps) {
  const { data: item, isLoading } = useWorkItem(workItemId)

  return (
    <Sheet open={workItemId !== null} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-lg">
        {isLoading || !item ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        ) : (
          <WorkItemDetailContent item={item} onClose={() => onOpenChange(false)} />
        )}
      </SheetContent>
    </Sheet>
  )
}

function WorkItemDetailContent({ item, onClose }: { item: WorkItem; onClose: () => void }) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const deleteMutation = useDeleteWorkItem(item.id)

  const showEdit = item.editable_fields.length > 0
  const showDelete = item.permissions?.can_delete ?? false

  return (
    <div className="flex flex-col">
      <SheetHeader>
        <div className="flex items-center gap-2">
          <SheetTitle>{item.work_id}</SheetTitle>
          <StatusBadge status={item.status} />
          <PriorityBadge priority={item.priority} />
        </div>
        <SheetDescription>{item.subject}</SheetDescription>

        {(showEdit || showDelete) && (
          <div className="flex gap-2 pt-1">
            {showEdit && (
              <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
                <Pencil className="size-3.5" />
                Edit
              </Button>
            )}
            {showDelete && (
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => setIsConfirmingDelete(true)}
              >
                <Trash2 className="size-3.5" />
                Delete
              </Button>
            )}
          </div>
        )}

        {isConfirmingDelete && (
          <div className="space-y-2 rounded-md border border-destructive/30 bg-destructive/5 p-3">
            <p className="text-sm">
              Are you sure you want to delete <strong>{item.work_id}</strong>?
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="destructive"
                disabled={deleteMutation.isPending}
                onClick={() =>
                  deleteMutation.mutate(undefined, {
                    onSuccess: () => onClose(),
                  })
                }
              >
                Confirm Delete
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsConfirmingDelete(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </SheetHeader>

      {showEdit && <WorkItemEditSheet item={item} open={isEditOpen} onOpenChange={setIsEditOpen} />}

      <div className="space-y-4 px-4 pb-4">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <Field label="Department" value={item.department?.name} />
          <Field label="Entry Type" value={item.entry_type.replace('_', ' ')} capitalize />
          <Field label="Assigned By" value={item.assigned_by?.name} />
          <Field label="Assigned To" value={item.assigned_to?.name} />
          <Field label="Created By" value={item.created_by?.name} />
          <Field label="Source" value={item.source.replace('_', ' ')} capitalize />
          <Field label="Branch/Client" value={item.branch?.name} />
          <Field label="Category" value={item.category?.name} />
          <Field label="Created" value={format(new Date(item.created_at), 'dd MMM yyyy, HH:mm')} />
          <Field
            label="SLA Due"
            value={item.sla_due_at ? format(new Date(item.sla_due_at), 'dd MMM yyyy, HH:mm') : undefined}
          />
          <Field
            label="Started"
            value={item.start_time ? format(new Date(item.start_time), 'dd MMM yyyy, HH:mm') : undefined}
          />
          <Field
            label="Ended"
            value={item.end_time ? format(new Date(item.end_time), 'dd MMM yyyy, HH:mm') : undefined}
          />
        </dl>

        <div>
          <p className="mb-1 text-xs font-medium text-muted-foreground">Description</p>
          <p className="text-sm whitespace-pre-wrap">{item.description}</p>
        </div>

        {item.resolution && (
          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">Resolution</p>
            <p className="text-sm whitespace-pre-wrap">{item.resolution}</p>
          </div>
        )}

        {item.remarks && (
          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">Remarks</p>
            <p className="text-sm whitespace-pre-wrap">{item.remarks}</p>
          </div>
        )}

        <Separator />

        {item.permissions?.can_update_status && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Update Status</p>
            <StatusUpdateControl item={item} />
          </div>
        )}

        {item.permissions?.can_reassign && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Reassign</p>
            <ReassignControl item={item} />
          </div>
        )}

        <Separator />

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">History</p>
          <TimelineFeed entries={item.timeline ?? []} />
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  capitalize,
}: {
  label: string
  value: string | undefined | null
  capitalize?: boolean
}) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={capitalize ? 'capitalize' : undefined}>{value ?? '—'}</dd>
    </div>
  )
}

function StatusUpdateControl({ item }: { item: WorkItem }) {
  const [pendingStatus, setPendingStatus] = useState<WorkItemStatus | null>(null)
  const [resolution, setResolution] = useState(item.resolution ?? '')
  const [note, setNote] = useState('')
  const mutation = useUpdateWorkItemStatus(item.id)

  function handleConfirm() {
    if (!pendingStatus) return

    mutation.mutate(
      {
        status: pendingStatus,
        note: note || null,
        resolution: pendingStatus === 'closed' ? resolution : undefined,
      },
      {
        onSuccess: () => {
          setPendingStatus(null)
          setNote('')
        },
      },
    )
  }

  return (
    <div className="space-y-2">
      <StatusTransitionControl
        nextStatuses={item.next_statuses}
        onSelect={setPendingStatus}
        disabled={mutation.isPending}
      />

      {pendingStatus && (
        <div className="space-y-2 rounded-md border p-3">
          <p className="text-sm">
            Move to <strong>{STATUS_LABELS[pendingStatus]}</strong>
          </p>

          {pendingStatus === 'closed' && (
            <Textarea
              placeholder="Resolution (required)"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
            />
          )}

          <Textarea placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleConfirm}
              disabled={
                mutation.isPending || (pendingStatus === 'closed' && resolution.trim() === '')
              }
            >
              Confirm
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setPendingStatus(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function ReassignControl({ item }: { item: WorkItem }) {
  const { data: assignableUsers } = useAssignableUsers()
  const [selectedUserId, setSelectedUserId] = useState('')
  const mutation = useReassignWorkItem(item.id)

  const candidates = assignableUsers?.filter((u) => u.id !== item.assigned_to?.id)

  return (
    <div className="flex gap-2">
      <Select value={selectedUserId} onValueChange={setSelectedUserId}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select new assignee" />
        </SelectTrigger>
        <SelectContent>
          {candidates?.map((candidate) => (
            <SelectItem key={candidate.id} value={candidate.id}>
              {candidate.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        size="sm"
        disabled={!selectedUserId || mutation.isPending}
        onClick={() =>
          mutation.mutate(
            { assigned_to_id: selectedUserId },
            { onSuccess: () => setSelectedUserId('') },
          )
        }
      >
        Reassign
      </Button>
    </div>
  )
}

function TimelineFeed({ entries }: { entries: WorkItem['timeline'] }) {
  if (!entries || entries.length === 0) {
    return <p className="text-sm text-muted-foreground">No history yet.</p>
  }

  return (
    <ol className="space-y-3 border-l pl-4">
      {entries.map((entry) => (
        <li key={entry.id} className="relative">
          <span className="absolute -left-[21px] top-1 size-2 rounded-full bg-primary" />
          <p className="text-sm">
            <span className="font-medium">{entry.actor?.name ?? 'System'}</span>{' '}
            {describeAction(entry)}
          </p>
          {entry.note && <p className="text-sm text-muted-foreground">{entry.note}</p>}
          <p className="text-xs text-muted-foreground">
            {format(new Date(entry.created_at), 'dd MMM yyyy, HH:mm')}
          </p>
        </li>
      ))}
    </ol>
  )
}

function describeAction(entry: NonNullable<WorkItem['timeline']>[number]): string {
  if (entry.action === 'created') return 'created this task'
  if (entry.action === 'reassigned') return 'reassigned this task'
  if (entry.action === 'deleted') return 'deleted this task'
  if (entry.action === 'status_changed' && entry.from_status && entry.to_status) {
    return `changed status from ${STATUS_LABELS[entry.from_status]} to ${STATUS_LABELS[entry.to_status]}`
  }
  return 'updated this task'
}
