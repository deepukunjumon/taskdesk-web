import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { DepartmentForm } from '@/features/admin/DepartmentForm'
import { useUpdateDepartment } from '@/features/admin/hooks'
import type { DepartmentFormValues } from '@/features/admin/schema'
import type { Department } from '@/types'

interface DepartmentEditSheetProps {
  department: Department
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DepartmentEditSheet({ department, open, onOpenChange }: DepartmentEditSheetProps) {
  const mutation = useUpdateDepartment(department.id)

  function handleSubmit(values: DepartmentFormValues) {
    mutation.mutate(values, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Edit Department</SheetTitle>
          <SheetDescription>Update this department's details.</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4">
          <DepartmentForm
            onSubmit={handleSubmit}
            isSubmitting={mutation.isPending}
            defaultValues={{ name: department.name, code: department.code }}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
