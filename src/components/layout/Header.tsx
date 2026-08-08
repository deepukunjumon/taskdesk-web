import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'

export function Header() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  return (
    <header className="flex h-14 shrink-0 items-center justify-end border-b border-border px-4 sm:px-6">
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="text-sm">
          <span className="font-medium">{user?.name}</span>
          {user?.roles[0] && (
            <span className="ml-2 hidden rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground capitalize sm:inline">
              {user.roles[0]}
            </span>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={() => logout()}>
          Log out
        </Button>
      </div>
    </header>
  )
}
