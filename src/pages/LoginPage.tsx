import { type FormEvent, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LayoutGrid } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Footer } from '@/components/layout/Footer'
import { useAuthStore } from '@/stores/authStore'
import packageJson from '../../package.json'

export function LoginPage() {
  const token = useAuthStore((state) => state.token)
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  if (token) {
    const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? '/'
    return <Navigate to={redirectTo} replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch {
      toast.error('Invalid email or password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left — branding panel, hidden below lg */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary-foreground/10">
            <LayoutGrid className="size-4.5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">TaskDesk</span>
        </div>

        <div className="relative max-w-md space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight text-balance">
            Keep every task moving, on time.
          </h2>
          <p className="text-primary-foreground/70">
            Assign work across your team, track status end to end, and stay ahead of SLAs - all
            in one place.
          </p>
        </div>

        <p className="relative text-sm text-primary-foreground/50">
          TaskDesk v{packageJson.version} &copy; {new Date().getFullYear()}
        </p>
      </div>

      {/* Right — form */}
      <div className="flex flex-col bg-background">
        <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-sm">
            <div className="mb-8 flex flex-col gap-3 lg:hidden">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <LayoutGrid className="size-4.5" />
              </div>
            </div>

            <div className="mb-8 space-y-1.5">
              <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
              <p className="text-sm text-muted-foreground">Sign in to your TaskDesk account</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  required
                  className="h-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    required
                    className="h-10 pr-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting} className="mt-2 h-10">
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
            <p className="mt-4 text-right text-sm text-muted-foreground">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
            </p>
          </div>
        </div>

        <div className="lg:hidden">
          <Footer />
        </div>
      </div>
    </div>
  )
}
