import { useQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { listMyReports } from '@/api/users'
import type { User } from '@/types'

function StatusBadge({ user }: { user: User }) {
  if (user.is_active) {
    return <Badge variant="default">Active</Badge>
  }
  if (user.relieved_on) {
    return <Badge variant="destructive">Relieved</Badge>
  }
  return <Badge variant="secondary">Inactive</Badge>
}

export function MyTeamPage() {
  const { data: reports, isLoading, isError } = useQuery({
    queryKey: ['users', 'me', 'reports'],
    queryFn: listMyReports,
  })

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">My Team</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The people who report directly to you.
        </p>
      </div>

      {isError ? (
        <p className="text-sm text-destructive">Could not load your team.</p>
      ) : isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Employee Code</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                    You don't have anyone reporting to you yet.
                  </TableCell>
                </TableRow>
              ) : (
                reports?.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.name}</TableCell>
                    <TableCell>{report.employee_code ?? ''}</TableCell>
                    <TableCell className="text-muted-foreground">{report.email}</TableCell>
                    <TableCell>{report.mobile ?? ''}</TableCell>
                    <TableCell>{report.department?.name ?? ''}</TableCell>
                    <TableCell>
                      <StatusBadge user={report} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
