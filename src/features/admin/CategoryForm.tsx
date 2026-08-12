import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { categoryFormSchema, type CategoryFormValues } from '@/features/admin/schema'
import { useDepartments } from '@/features/work-register/hooks'

interface CategoryFormProps {
  onSubmit: (values: CategoryFormValues) => void
  isSubmitting: boolean
  defaultValues?: CategoryFormValues
}

export function CategoryForm({ onSubmit, isSubmitting, defaultValues }: CategoryFormProps) {
  const { data: departments, isLoading: departmentsLoading } = useDepartments()

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: defaultValues ?? { name: '', department_ids: [] },
  })

  if (departmentsLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    )
  }

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
                <Input placeholder="e.g. Network" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="department_ids"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departments</FormLabel>
              <p className="text-xs text-muted-foreground">
                Leave every department unchecked to make this category common — available
                regardless of which department is selected.
              </p>
              <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-3">
                {departments?.length ? (
                  departments.map((dept) => {
                    const checked = field.value.includes(dept.id)
                    return (
                      <label
                        key={dept.id}
                        className="flex items-center gap-2 text-sm font-normal"
                      >
                        <input
                          type="checkbox"
                          className="size-4 rounded border-input accent-primary"
                          checked={checked}
                          onChange={(e) =>
                            field.onChange(
                              e.target.checked
                                ? [...field.value, dept.id]
                                : field.value.filter((id) => id !== dept.id),
                            )
                          }
                        />
                        {dept.name}
                      </label>
                    )
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">No departments yet.</p>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Saving...' : 'Save Category'}
        </Button>
      </form>
    </Form>
  )
}
