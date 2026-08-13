import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useDepartmentOptions } from '@/features/work-register/hooks'
import { userEditFormSchema, type UserEditFormValues } from '@/features/admin/schema'
import { ManagerCombobox } from '@/features/admin/ManagerCombobox'
import type { Role, UserRef } from '@/types'

const NO_DEPARTMENT = '__none__'

interface UserEditFormProps {
  onSubmit: (values: UserEditFormValues) => void
  isSubmitting: boolean
  defaultValues: UserEditFormValues
  /** The user's own role — decides whether employee_code is shown at all. */
  targetRole: Role
  userId: string
  currentManager: UserRef | null
}

export function UserEditForm({
  onSubmit,
  isSubmitting,
  defaultValues,
  targetRole,
  userId,
  currentManager,
}: UserEditFormProps) {
  const { data: departments, isLoading: departmentsLoading } = useDepartmentOptions()

  const form = useForm<UserEditFormValues>({
    resolver: zodResolver(userEditFormSchema),
    defaultValues,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="jane@company.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 9876543210" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {targetRole === 'user' && (
          <FormField
            control={form.control}
            name="employee_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee Code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. EMP0123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="department_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              {departmentsLoading ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                <Select
                  value={field.value ?? NO_DEPARTMENT}
                  onValueChange={(v) => field.onChange(v === NO_DEPARTMENT ? undefined : v)}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="No department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={NO_DEPARTMENT}>No department</SelectItem>
                    {departments?.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="manager_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manager</FormLabel>
              <FormControl>
                <ManagerCombobox
                  className="w-full"
                  userId={userId}
                  value={field.value ?? null}
                  currentManager={currentManager}
                  onChange={(managerId) => field.onChange(managerId ?? undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Saving...' : 'Save User'}
        </Button>
      </form>
    </Form>
  )
}
