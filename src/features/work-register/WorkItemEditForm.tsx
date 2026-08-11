import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { workItemEditSchema, type WorkItemEditValues } from '@/features/work-register/schema'
import { useBranches, useCategories } from '@/features/work-register/hooks'
import { ENTRY_TYPES, PRIORITIES, PRIORITY_LABELS, SOURCES } from '@/types'

interface WorkItemEditFormProps {
  /** Which of this item's fields the backend says this user may edit — drives what renders. */
  editableFields: string[]
  /** Fixed, not editable here — used only to scope the category list. */
  departmentId: string | undefined
  onSubmit: (values: Partial<WorkItemEditValues>) => void
  isSubmitting: boolean
  defaultValues: WorkItemEditValues
}

export function WorkItemEditForm({
  editableFields,
  departmentId,
  onSubmit,
  isSubmitting,
  defaultValues,
}: WorkItemEditFormProps) {
  const form = useForm<WorkItemEditValues>({
    resolver: zodResolver(workItemEditSchema),
    defaultValues,
  })

  const showBranchOrCategory = editableFields.includes('branch_id') || editableFields.includes('category_id')
  const { data: branches, isLoading: branchesLoading } = useBranches()
  const { data: categories } = useCategories(departmentId)

  function handleSubmit(values: WorkItemEditValues) {
    const submitted: Partial<WorkItemEditValues> = {}
    for (const field of editableFields) {
      if (field in values) {
        // @ts-expect-error -- field is a validated key of WorkItemEditValues
        submitted[field] = values[field]
      }
    }
    onSubmit(submitted)
  }

  if (showBranchOrCategory && branchesLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {editableFields.includes('entry_type') && (
          <FormField
            control={form.control}
            name="entry_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entry Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ENTRY_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === 'task' ? 'Task' : 'Support Call'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {(editableFields.includes('source') || editableFields.includes('priority')) && (
          <div className="grid grid-cols-2 gap-4">
            {editableFields.includes('source') && (
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SOURCES.map((source) => (
                          <SelectItem key={source} value={source}>
                            {source === 'branch_client' ? 'Branch/Client' : 'Internal'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {editableFields.includes('priority') && (
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRIORITIES.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {PRIORITY_LABELS[priority]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        )}

        {showBranchOrCategory && (
          <div className="grid grid-cols-2 gap-4">
            {editableFields.includes('branch_id') && (
              <FormField
                control={form.control}
                name="branch_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch/Client</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="None" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {branches?.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {editableFields.includes('category_id') && (
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="None" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        )}

        {editableFields.includes('subject') && (
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Short summary" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {editableFields.includes('description') && (
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={4} placeholder="Describe the issue or task" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {editableFields.includes('resolution') && (
          <FormField
            control={form.control}
            name="resolution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resolution</FormLabel>
                <FormControl>
                  <Textarea rows={3} placeholder="How was this resolved?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {editableFields.includes('remarks') && (
          <FormField
            control={form.control}
            name="remarks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remarks</FormLabel>
                <FormControl>
                  <Textarea rows={3} placeholder="Additional notes" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  )
}
