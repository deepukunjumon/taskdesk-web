import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { WorkItemEditForm } from '@/features/work-register/WorkItemEditForm'
import { useUpdateWorkItem } from '@/features/work-register/hooks'
import type { WorkItemEditValues } from '@/features/work-register/schema'
import type { WorkItem } from '@/types'

interface WorkItemEditSheetProps {
  item: WorkItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WorkItemEditSheet({ item, open, onOpenChange }: WorkItemEditSheetProps) {
  const mutation = useUpdateWorkItem(item.id)

  function handleSubmit(values: Partial<WorkItemEditValues>) {
    mutation.mutate(
      {
        ...values,
        branch_id: 'branch_id' in values ? values.branch_id || null : undefined,
        category_id: 'category_id' in values ? values.category_id || null : undefined,
      },
      { onSuccess: () => onOpenChange(false) },
    )
  }

  const defaultValues: WorkItemEditValues = {
    entry_type: item.entry_type,
    source: item.source,
    branch_id: item.branch?.id ?? '',
    category_id: item.category?.id ?? '',
    priority: item.priority,
    subject: item.subject,
    description: item.description,
    resolution: item.resolution ?? '',
    remarks: item.remarks ?? '',
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Edit {item.task_id}</SheetTitle>
          <SheetDescription>Update this task's details.</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4">
          <WorkItemEditForm
            editableFields={item.editable_fields}
            departmentId={item.department?.id}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isSubmitting={mutation.isPending}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
