import { type FormEvent, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { resetPassword } from '@/api/passwordReset'
import { getErrorMessage } from '@/features/auth/forgot-password/utils'

interface ResetStepProps {
  resetToken: string
  onReset: () => void
}

export function ResetStep({ resetToken, onReset }: ResetStepProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)

    try {
      await resetPassword(resetToken, password, confirmPassword)
      onReset()
    } catch (err) {
      setError(
        getErrorMessage(err) ??
          'This reset link has expired or already been used. Please start over.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="off">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="new-password" className="text-sm font-medium">
          New password
        </label>
        <div className="relative">
          <Input
            id="new-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="At least 8 characters"
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

      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirm-password" className="text-sm font-medium">
          Confirm password
        </label>
        <Input
          id="confirm-password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Re-enter password"
          required
          className="h-10"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={isSubmitting} className="mt-2 h-10">
        {isSubmitting ? 'Resetting...' : 'Reset password'}
      </Button>
    </form>
  )
}
