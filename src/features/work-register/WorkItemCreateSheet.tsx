import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { WorkItemForm } from '@/features/work-register/WorkItemForm'
import { useCreateWorkItem } from '@/features/work-register/hooks'
import type { WorkItemFormValues } from '@/features/work-register/schema'

interface WorkItemCreateSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WorkItemCreateSheet({ open, onOpenChange }: WorkItemCreateSheetProps) {
  const mutation = useCreateWorkItem()

  function handleSubmit(values: WorkItemFormValues) {
    mutation.mutate(
      {
        ...values,
        branch_id: values.branch_id || null,
        category_id: values.category_id || null,
      },
      { onSuccess: () => onOpenChange(false) },
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Add New Task</SheetTitle>
          <SheetDescription>Create a new task or support call entry.</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4">
          <WorkItemForm onSubmit={handleSubmit} isSubmitting={mutation.isPending} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
