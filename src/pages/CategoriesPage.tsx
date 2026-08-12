import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
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
import { CategoryEditSheet } from '@/features/admin/CategoryEditSheet'
import { useAdminCategories, useDeleteCategory, useToggleCategoryActive } from '@/features/admin/hooks'
import type { Category } from '@/types'

function CategoryRow({ category }: { category: Category }) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const toggleMutation = useToggleCategoryActive(category.id)
  const deleteMutation = useDeleteCategory(category.id)

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{category.name}</TableCell>
        <TableCell>
          {category.department_names.length ? (
            category.department_names.join(', ')
          ) : (
            <span className="text-muted-foreground">All departments</span>
          )}
        </TableCell>
        <TableCell>
          <Badge variant={category.is_active ? 'default' : 'secondary'}>
            {category.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </TableCell>
        <TableCell>
          {isConfirmingDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Delete?</span>
              <Button
                size="sm"
                variant="destructive"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate()}
              >
                Confirm
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsConfirmingDelete(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsEditOpen(true)}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={toggleMutation.isPending}
                onClick={() => toggleMutation.mutate()}
              >
                {category.is_active ? 'Disable' : 'Enable'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-destructive hover:text-destructive"
                onClick={() => setIsConfirmingDelete(true)}
              >
                Delete
              </Button>
            </div>
          )}
        </TableCell>
      </TableRow>
      <CategoryEditSheet category={category} open={isEditOpen} onOpenChange={setIsEditOpen} />
    </>
  )
}

export function CategoriesPage() {
  const { data: categories, isLoading, isError } = useAdminCategories()
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Categories can belong to one or more departments — or none, to apply everywhere.
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
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                    No categories yet.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => <CategoryRow key={category.id} category={category} />)
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <CategoryCreateSheet open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
