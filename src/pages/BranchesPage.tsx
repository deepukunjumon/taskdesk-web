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
import { BranchCreateSheet } from '@/features/admin/BranchCreateSheet'
import { BranchEditSheet } from '@/features/admin/BranchEditSheet'
import { useAdminBranches, useDeleteBranch, useToggleBranchActive } from '@/features/admin/hooks'
import type { Branch } from '@/types'

function BranchRow({ branch }: { branch: Branch }) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const toggleMutation = useToggleBranchActive(branch.id)
  const deleteMutation = useDeleteBranch(branch.id)

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{branch.name}</TableCell>
        <TableCell>{branch.code}</TableCell>
        <TableCell className="capitalize">{branch.type}</TableCell>
        <TableCell>
          <Badge variant={branch.is_active ? 'default' : 'secondary'}>
            {branch.is_active ? 'Active' : 'Inactive'}
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
                {branch.is_active ? 'Disable' : 'Enable'}
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
      <BranchEditSheet branch={branch} open={isEditOpen} onOpenChange={setIsEditOpen} />
    </>
  )
}

export function BranchesPage() {
  const { data: branches, isLoading, isError } = useAdminBranches()
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Branches</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Branches represent external organizations or locations linked to tasks.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>Add Branch</Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : isError || !branches ? (
        <p className="text-sm text-destructive">Could not load branches.</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                    No branches yet.
                  </TableCell>
                </TableRow>
              ) : (
                branches.map((branch) => <BranchRow key={branch.id} branch={branch} />)
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <BranchCreateSheet open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
