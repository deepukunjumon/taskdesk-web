import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRelieveUser } from '@/features/admin/hooks'
import type { User } from '@/types'

interface UserRelieveDialogProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserRelieveDialog({ user, open, onOpenChange }: UserRelieveDialogProps) {
  const [relievedOn, setRelievedOn] = useState('')
  const mutation = useRelieveUser(user.id)

  function handleConfirm() {
    if (!relievedOn) return
    mutation.mutate(relievedOn, {
      onSuccess: () => {
        onOpenChange(false)
        setRelievedOn('')
      },
    })
  }

  const pendingReports = user.reports_count ?? 0

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Mark {user.name} as relieved</AlertDialogTitle>
          <AlertDialogDescription>
            This sets the relieved date and disables the account, blocking login.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {pendingReports > 0 && (
          <div className="rounded-md border border-amber-500/50 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
            {pendingReports} {pendingReports === 1 ? 'report' : 'reports'} still list {user.name}{' '}
            as their manager and will need reassignment — this action does not reassign them
            automatically.
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="relieved-on">Relieved on</Label>
          <Input
            id="relieved-on"
            type="date"
            value={relievedOn}
            onChange={(e) => setRelievedOn(e.target.value)}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setRelievedOn('')}>Cancel</AlertDialogCancel>
          <Button disabled={!relievedOn || mutation.isPending} onClick={handleConfirm}>
            {mutation.isPending ? 'Saving...' : 'Confirm'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
