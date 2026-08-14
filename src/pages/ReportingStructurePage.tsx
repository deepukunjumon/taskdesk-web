import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/ui/data-table-pagination'
import { UserEditSheet } from '@/features/admin/UserEditSheet'
import { UserRelieveDialog } from '@/features/admin/UserRelieveDialog'
import { UserFiltersBar } from '@/features/admin/UserFiltersBar'
import { useUpdateUserStatus } from '@/features/admin/hooks'
import { listAdminUsers } from '@/api/users'
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery'
import type { AdminUserFilters, User } from '@/types'

function StatusBadge({ user }: { user: User }) {
  if (user.is_active) {
    return <Badge variant="default">Active</Badge>
  }
  if (user.relieved_on) {
    return <Badge variant="destructive">Relieved</Badge>
  }
  return <Badge variant="secondary">Inactive</Badge>
}

function UserRow({ user, slNo }: { user: User; slNo: number }) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isRelieveOpen, setIsRelieveOpen] = useState(false)
  const statusMutation = useUpdateUserStatus(user.id)

  return (
    <>
      <TableRow>
        <TableCell>{slNo}</TableCell>
        <TableCell>{user.employee_code ?? ''}</TableCell>
        <TableCell className="font-medium">{user.name}</TableCell>
        <TableCell className="text-muted-foreground">{user.email}</TableCell>
        <TableCell>{user.department?.name ?? ''}</TableCell>
        <TableCell>{user.manager?.name ?? ''}</TableCell>
        <TableCell>
          <StatusBadge user={user} />
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setIsEditOpen(true)}>
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={statusMutation.isPending}
              onClick={() => statusMutation.mutate(!user.is_active)}
            >
              {user.is_active ? 'Disable' : 'Enable'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={Boolean(user.relieved_on)}
              className="text-destructive hover:text-destructive"
              onClick={() => setIsRelieveOpen(true)}
            >
              {user.relieved_on ? 'Relieved' : 'Mark Relieved'}
            </Button>
          </div>
        </TableCell>
      </TableRow>
      <UserEditSheet user={user} open={isEditOpen} onOpenChange={setIsEditOpen} />
      <UserRelieveDialog user={user} open={isRelieveOpen} onOpenChange={setIsRelieveOpen} />
    </>
  )
}

export function ReportingStructurePage() {
  const [filters, setFilters] = useState<AdminUserFilters>({})
  const { data, meta, isLoading, isError, setPage, setPerPage } = usePaginatedQuery<
    User,
    AdminUserFilters
  >({
    // Matches the key admin/hooks.ts mutations already invalidate on
    // edit/status/relieve/manager changes, so those keep working unchanged.
    queryKey: ['users', 'admin'],
    queryFn: listAdminUsers,
    filters,
  })

  function handleFiltersChange(next: AdminUserFilters) {
    setFilters(next)
    setPage(1)
  }

  const startIndex = ((meta?.current_page ?? 1) - 1) * (meta?.per_page ?? 15)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage user details, status, and each user's manager — this determines who can assign
          tasks to them, at any depth in the chain.
        </p>
      </div>

      <UserFiltersBar filters={filters} onChange={handleFiltersChange} />

      {isError ? (
        <p className="text-sm text-destructive">Could not load users.</p>
      ) : isLoading && !data ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sl.No</TableHead>
                  <TableHead>Employee Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-sm text-muted-foreground">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.map((user, index) => (
                    <UserRow key={user.id} user={user} slNo={startIndex + index + 1} />
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {meta && (
            <DataTablePagination meta={meta} onPageChange={setPage} onPerPageChange={setPerPage} />
          )}
        </div>
      )}
    </div>
  )
}
