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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { categoryFormSchema, type CategoryFormValues } from '@/features/admin/schema'
import { useDepartments } from '@/features/work-register/hooks'

const NO_DEPARTMENT = '__none__'

interface CategoryFormProps {
  onSubmit: (values: CategoryFormValues) => void
  isSubmitting: boolean
  defaultValues?: CategoryFormValues
}

export function CategoryForm({ onSubmit, isSubmitting, defaultValues }: CategoryFormProps) {
  const { data: departments, isLoading: departmentsLoading } = useDepartments()

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: defaultValues ?? { name: '', department_id: '' },
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
          name="department_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <Select
                onValueChange={(v) => field.onChange(v === NO_DEPARTMENT ? '' : v)}
                value={field.value || NO_DEPARTMENT}
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
