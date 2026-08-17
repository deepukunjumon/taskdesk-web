import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { UserCreateForm } from '@/features/admin/UserCreateForm'
import { useCreateUser } from '@/features/admin/hooks'
import type { UserCreateFormValues } from '@/features/admin/schema'
import { useAuthStore } from '@/stores/authStore'
import { ROLES, type Role } from '@/types'

interface UserCreateSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserCreateSheet({ open, onOpenChange }: UserCreateSheetProps) {
  const actor = useAuthStore((state) => state.user)
  const mutation = useCreateUser()

  // Only a superadmin may create another superadmin — a plain admin can
  // hand out user/admin accounts but never mint a peer/superior for themself.
  const availableRoles: Role[] = actor?.roles.includes('superadmin')
    ? [...ROLES]
    : ROLES.filter((role) => role !== 'superadmin')

  function handleSubmit(values: UserCreateFormValues) {
    mutation.mutate(
      {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        mobile: values.mobile || null,
        employee_code: values.employee_code || null,
        department_id: values.department_id || null,
        manager_id: values.manager_id || null,
      },
      { onSuccess: () => onOpenChange(false) },
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Add User</SheetTitle>
          <SheetDescription>Create a new account and assign its role.</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4">
          <UserCreateForm
            onSubmit={handleSubmit}
            isSubmitting={mutation.isPending}
            availableRoles={availableRoles}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
