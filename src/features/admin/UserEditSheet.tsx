import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { UserEditForm } from '@/features/admin/UserEditForm'
import { useUpdateUser, useUpdateUserManager } from '@/features/admin/hooks'
import type { UserEditFormValues } from '@/features/admin/schema'
import type { User } from '@/types'

interface UserEditSheetProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserEditSheet({ user, open, onOpenChange }: UserEditSheetProps) {
  const updateUser = useUpdateUser(user.id)
  const updateManager = useUpdateUserManager()

  async function handleSubmit(values: UserEditFormValues) {
    const managerId = values.manager_id ?? null

    await updateUser.mutateAsync({
      name: values.name,
      email: values.email,
      mobile: values.mobile || null,
      employee_code: values.employee_code || null,
      department_id: values.department_id || null,
    })

    if (managerId !== user.manager_id) {
      await updateManager.mutateAsync({ userId: user.id, managerId })
    }

    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Edit User</SheetTitle>
          <SheetDescription>Update this user's details.</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4">
          <UserEditForm
            onSubmit={handleSubmit}
            isSubmitting={updateUser.isPending || updateManager.isPending}
            targetRole={user.roles[0] ?? 'user'}
            userId={user.id}
            currentManager={user.manager}
            defaultValues={{
              name: user.name,
              email: user.email,
              mobile: user.mobile ?? '',
              employee_code: user.employee_code ?? '',
              department_id: user.department_id ?? undefined,
              manager_id: user.manager_id ?? undefined,
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
