import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CategoryCreateSheet } from '@/features/admin/CategoryCreateSheet'
import { useCategories, useDepartments } from '@/features/work-register/hooks'

export function CategoriesPage() {
  const { data: departments } = useDepartments()
  const { data: categories, isLoading, isError } = useCategories()
  const [createOpen, setCreateOpen] = useState(false)

  const departmentsById = new Map((departments ?? []).map((dept) => [dept.id, dept]))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Categories optionally belong to a department and classify tasks within it.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>Add Category</Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : isError || !categories ? (
        <p className="text-sm text-destructive">Could not load categories.</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-sm text-muted-foreground">
                    No categories yet.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>
                      {category.department_id
                        ? (departmentsById.get(category.department_id)?.name ?? '—')
                        : '—'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <CategoryCreateSheet open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
