import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { CategoryForm } from '@/features/admin/CategoryForm'
import { useCreateCategory } from '@/features/admin/hooks'
import type { CategoryFormValues } from '@/features/admin/schema'

interface CategoryCreateSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoryCreateSheet({ open, onOpenChange }: CategoryCreateSheetProps) {
  const mutation = useCreateCategory()

  function handleSubmit(values: CategoryFormValues) {
    mutation.mutate(
      { name: values.name, department_ids: values.department_ids },
      { onSuccess: () => onOpenChange(false) },
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Add Category</SheetTitle>
          <SheetDescription>Create a new category.</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4">
          <CategoryForm onSubmit={handleSubmit} isSubmitting={mutation.isPending} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
