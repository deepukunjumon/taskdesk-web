import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/layout/Footer'
import { RequestStep } from '@/features/auth/forgot-password/RequestStep'
import { VerifyStep } from '@/features/auth/forgot-password/VerifyStep'
import { ResetStep } from '@/features/auth/forgot-password/ResetStep'
import packageJson from '../../package.json'

type Step = 'request' | 'verify' | 'reset' | 'done'

const STEP_COPY: Record<Step, { title: string; subtitle: string }> = {
  request: {
    title: 'Forgot your password?',
    subtitle: "Enter your email and we'll send you a verification code.",
  },
  verify: {
    title: 'Enter verification code',
    subtitle: 'Check your inbox for the 6-digit code.',
  },
  reset: {
    title: 'Set a new password',
    subtitle: 'Choose a new password for your account.',
  },
  done: {
    title: 'Password reset',
    subtitle: 'You can now sign in with your new password.',
  },
}

export function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('request')
  const [email, setEmail] = useState('')
  const [resetToken, setResetToken] = useState('')

  const { title, subtitle } = STEP_COPY[step]

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
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>

            {step === 'request' && (
              <RequestStep
                onSubmitted={(submittedEmail) => {
                  setEmail(submittedEmail)
                  setStep('verify')
                }}
              />
            )}

            {step === 'verify' && (
              <VerifyStep
                email={email}
                onVerified={(token) => {
                  setResetToken(token)
                  setStep('reset')
                }}
                onRestart={() => setStep('request')}
              />
            )}

            {step === 'reset' && (
              <ResetStep resetToken={resetToken} onReset={() => setStep('done')} />
            )}

            {step === 'done' && (
              <Button asChild className="h-10 w-full">
                <Link to="/login">Back to login</Link>
              </Button>
            )}

            {step !== 'done' && (
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Remembered your password?{' '}
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Back to login
                </Link>
              </p>
            )}
          </div>
        </div>

        <div className="lg:hidden">
          <Footer />
        </div>
      </div>
    </div>
  )
}
