import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { BranchForm } from '@/features/admin/BranchForm'
import { useUpdateBranch } from '@/features/admin/hooks'
import type { BranchFormValues } from '@/features/admin/schema'
import type { Branch } from '@/types'

interface BranchEditSheetProps {
  branch: Branch
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BranchEditSheet({ branch, open, onOpenChange }: BranchEditSheetProps) {
  const mutation = useUpdateBranch(branch.id)

  function handleSubmit(values: BranchFormValues) {
    mutation.mutate(values, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Edit Branch</SheetTitle>
          <SheetDescription>Update this branch's details.</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4">
          <BranchForm
            onSubmit={handleSubmit}
            isSubmitting={mutation.isPending}
            defaultValues={{ name: branch.name, code: branch.code, type: branch.type }}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
