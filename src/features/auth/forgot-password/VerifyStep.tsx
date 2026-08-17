import { type FormEvent, type KeyboardEvent, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { requestPasswordResetOtp, verifyPasswordResetOtp } from '@/api/passwordReset'
import {
  getErrorCode,
  getErrorMessage,
  getErrorStatus,
} from '@/features/auth/forgot-password/utils'

const OTP_LENGTH = 6
const RESEND_COOLDOWN_SECONDS = 60

interface VerifyStepProps {
  email: string
  onVerified: (resetToken: string) => void
  onRestart: () => void
}

export function VerifyStep({ email, onVerified, onRestart }: VerifyStepProps) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  function setDigitsFrom(index: number, rawValue: string) {
    const clean = rawValue.replace(/\D/g, '')

    setDigits((prev) => {
      const next = [...prev]
      if (!clean) {
        next[index] = ''
        return next
      }
      // Supports pasting the full code into any box, not just typing one digit at a time.
      clean.split('').forEach((char, offset) => {
        if (index + offset < OTP_LENGTH) {
          next[index + offset] = char
        }
      })
      return next
    })

    if (clean) {
      const nextIndex = Math.min(index + clean.length, OTP_LENGTH - 1)
      inputRefs.current[nextIndex]?.focus()
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function resetDigits() {
    setDigits(Array(OTP_LENGTH).fill(''))
    inputRefs.current[0]?.focus()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const otp = digits.join('')

    if (otp.length !== OTP_LENGTH) {
      setError('Enter the full 6-digit code.')
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      const { reset_token } = await verifyPasswordResetOtp(email, otp)
      onVerified(reset_token)
    } catch (err) {
      const code = getErrorCode(err)
      const message = getErrorMessage(err)

      if (code === 'expired') {
        setError(message ?? 'This code has expired. Please request a new one.')
      } else if (code === 'locked_out') {
        setError(message ?? 'Too many incorrect attempts. Please request a new code.')
      } else if (code === 'invalid') {
        setError(message ?? 'Incorrect code. Please try again.')
      } else {
        setError('Something went wrong. Please try again.')
      }
      resetDigits()
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleResend() {
    if (cooldown > 0 || isResending) return

    setIsResending(true)
    setError(null)

    try {
      await requestPasswordResetOtp(email)
      setCooldown(RESEND_COOLDOWN_SECONDS)
      resetDigits()
    } catch (err) {
      if (getErrorStatus(err) === 429) {
        setError('Too many requests. Please wait a while before trying again.')
      } else {
        setError('Could not resend the code. Please try again.')
      }
    } finally {
      setIsResending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        If an account exists for <span className="font-medium text-foreground">{email}</span>,
        we've sent a 6-digit verification code. Enter it below.
      </p>

      <div className="flex justify-between gap-2">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            maxLength={OTP_LENGTH}
            value={digit}
            onChange={(e) => setDigitsFrom(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
            className="h-12 w-11 rounded-md border border-input bg-transparent text-center text-lg font-semibold shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={isSubmitting} className="mt-2 h-10">
        {isSubmitting ? 'Verifying...' : 'Verify code'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Didn't get a code?{' '}
        {cooldown > 0 ? (
          <span>Resend in {cooldown}s</span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="font-medium text-primary hover:underline disabled:opacity-50"
          >
            {isResending ? 'Resending...' : 'Resend code'}
          </button>
        )}
      </p>

      <button
        type="button"
        onClick={onRestart}
        className="text-center text-sm text-muted-foreground hover:underline"
      >
        Entered the wrong email?
      </button>
    </form>
  )
}
