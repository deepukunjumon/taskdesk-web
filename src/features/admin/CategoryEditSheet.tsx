import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { CategoryForm } from '@/features/admin/CategoryForm'
import { useUpdateCategory } from '@/features/admin/hooks'
import type { CategoryFormValues } from '@/features/admin/schema'
import type { Category } from '@/types'

interface CategoryEditSheetProps {
  category: Category
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoryEditSheet({ category, open, onOpenChange }: CategoryEditSheetProps) {
  const mutation = useUpdateCategory(category.id)

  function handleSubmit(values: CategoryFormValues) {
    mutation.mutate(
      { name: values.name, department_id: values.department_id || null },
      { onSuccess: () => onOpenChange(false) },
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Edit Category</SheetTitle>
          <SheetDescription>Update this category's details.</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4">
          <CategoryForm
            onSubmit={handleSubmit}
            isSubmitting={mutation.isPending}
            defaultValues={{ name: category.name, department_id: category.department_id ?? '' }}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
