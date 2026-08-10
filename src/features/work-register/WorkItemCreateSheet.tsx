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
import { useAuthStore } from '@/stores/authStore'

interface WorkItemCreateSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Skips the "Assigned To" field entirely and assigns to the current user. */
  assignToSelf?: boolean
}

export function WorkItemCreateSheet({
  open,
  onOpenChange,
  assignToSelf = false,
}: WorkItemCreateSheetProps) {
  const currentUser = useAuthStore((state) => state.user)
  const mutation = useCreateWorkItem()

  function handleSubmit(values: WorkItemFormValues) {
    mutation.mutate(
      {
        ...values,
        assigned_by: values.assigned_by || null,
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
          <WorkItemForm
            onSubmit={handleSubmit}
            isSubmitting={mutation.isPending}
            assignToSelf={assignToSelf}
            defaultValues={
              assignToSelf
                ? {
                    assigned_to_id: currentUser?.id,
                    // Known when the user has a department of their own — lets the
                    // form skip both fetching and asking for it. Falls back to the
                    // normal picker (and fetch) if it's ever null.
                    ...(currentUser?.department_id
                      ? { department_id: currentUser.department_id }
                      : {}),
                  }
                : undefined
            }
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
