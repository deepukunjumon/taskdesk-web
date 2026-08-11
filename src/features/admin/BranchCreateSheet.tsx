import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { BranchForm } from '@/features/admin/BranchForm'
import { useCreateBranch } from '@/features/admin/hooks'
import type { BranchFormValues } from '@/features/admin/schema'

interface BranchCreateSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BranchCreateSheet({ open, onOpenChange }: BranchCreateSheetProps) {
  const mutation = useCreateBranch()

  function handleSubmit(values: BranchFormValues) {
    mutation.mutate(values, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Add Branch</SheetTitle>
          <SheetDescription>Create a new branch.</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4">
          <BranchForm onSubmit={handleSubmit} isSubmitting={mutation.isPending} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
