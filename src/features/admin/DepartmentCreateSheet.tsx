import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { DepartmentForm } from '@/features/admin/DepartmentForm'
import { useCreateDepartment } from '@/features/admin/hooks'
import type { DepartmentFormValues } from '@/features/admin/schema'

interface DepartmentCreateSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DepartmentCreateSheet({ open, onOpenChange }: DepartmentCreateSheetProps) {
  const mutation = useCreateDepartment()

  function handleSubmit(values: DepartmentFormValues) {
    mutation.mutate(values, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Add Department</SheetTitle>
          <SheetDescription>Create a new department.</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4">
          <DepartmentForm onSubmit={handleSubmit} isSubmitting={mutation.isPending} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
