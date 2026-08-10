import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useUpdateUserManager } from '@/features/admin/hooks'
import { useUsers } from '@/features/work-register/hooks'
import type { User } from '@/types'

const NO_MANAGER = '__none__'

export function ReportingStructurePage() {
  const { data: users, isLoading, isError } = useUsers()
  const mutation = useUpdateUserManager()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Reporting Structure</h1>
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (isError || !users) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Reporting Structure</h1>
        <p className="text-sm text-destructive">Could not load users.</p>
      </div>
    )
  }

  const usersById = new Map(users.map((u) => [u.id, u]))

  function managerOptionsFor(user: User) {
    // A user can't report to themself or to anyone already in their own
    // descendant chain — the backend rejects cycles anyway, but filtering
    // obviously-invalid options keeps the dropdown honest.
    return users!.filter((candidate) => candidate.id !== user.id)
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Reporting Structure</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Set each user's manager. This determines who can assign tasks to them, at any depth in
          the chain.
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Manager</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  {user.roles.map((role) => (
                    <Badge key={role} variant="secondary" className="capitalize">
                      {role}
                    </Badge>
                  ))}
                </TableCell>
                <TableCell>
                  <Select
                    value={user.manager_id ?? NO_MANAGER}
                    onValueChange={(value) =>
                      mutation.mutate({
                        userId: user.id,
                        managerId: value === NO_MANAGER ? null : value,
                      })
                    }
                    disabled={mutation.isPending}
                  >
                    <SelectTrigger className="w-56">
                      <SelectValue placeholder="No manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NO_MANAGER}>No manager</SelectItem>
                      {managerOptionsFor(user).map((candidate) => (
                        <SelectItem key={candidate.id} value={candidate.id}>
                          {candidate.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {user.manager_id && !usersById.has(user.manager_id) && (
                    <p className="mt-1 text-xs text-muted-foreground">Manager not visible</p>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
