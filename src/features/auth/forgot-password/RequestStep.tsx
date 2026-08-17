import { type FormEvent, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { requestPasswordResetOtp } from '@/api/passwordReset'
import { getErrorStatus } from '@/features/auth/forgot-password/utils'

interface RequestStepProps {
  onSubmitted: (email: string) => void
}

export function RequestStep({ onSubmitted }: RequestStepProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await requestPasswordResetOtp(email)
      onSubmitted(email)
    } catch (err) {
      if (getErrorStatus(err) === 429) {
        setError('Too many requests. Please wait a while before trying again.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="forgot-email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="forgot-email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
          className="h-10"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={isSubmitting} className="mt-2 h-10">
        {isSubmitting ? 'Sending...' : 'Send verification code'}
      </Button>
    </form>
  )
}
