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
import { DepartmentCreateSheet } from '@/features/admin/DepartmentCreateSheet'
import { DepartmentEditSheet } from '@/features/admin/DepartmentEditSheet'
import { useAdminDepartments, useDeleteDepartment, useToggleDepartmentActive } from '@/features/admin/hooks'
import type { Department } from '@/types'

function DepartmentRow({ department }: { department: Department }) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const toggleMutation = useToggleDepartmentActive(department.id)
  const deleteMutation = useDeleteDepartment(department.id)

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{department.name}</TableCell>
        <TableCell>{department.code}</TableCell>
        <TableCell>
          <Badge variant={department.is_active ? 'default' : 'secondary'}>
            {department.is_active ? 'Active' : 'Inactive'}
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
                {department.is_active ? 'Disable' : 'Enable'}
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
      <DepartmentEditSheet department={department} open={isEditOpen} onOpenChange={setIsEditOpen} />
    </>
  )
}

export function DepartmentsPage() {
  const { data: departments, isLoading, isError } = useAdminDepartments()
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Departments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Departments group tasks and categories across the organization.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>Add Department</Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : isError || !departments ? (
        <p className="text-sm text-destructive">Could not load departments.</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                    No departments yet.
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((dept) => <DepartmentRow key={dept.id} department={dept} />)
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <DepartmentCreateSheet open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
