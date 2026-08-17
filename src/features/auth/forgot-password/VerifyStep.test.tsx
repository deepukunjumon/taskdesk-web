import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VerifyStep } from '@/features/auth/forgot-password/VerifyStep'
import * as passwordResetApi from '@/api/passwordReset'

vi.mock('@/api/passwordReset')

function apiError(status: number, data: Record<string, unknown>) {
  return { response: { status, data } }
}

async function typeOtp(user: ReturnType<typeof userEvent.setup>, code: string) {
  const boxes = screen.getAllByLabelText(/Digit \d of 6/);
  for (let i = 0; i < code.length; i++) {
    await user.type(boxes[i], code[i]);
  }
}

describe('VerifyStep', () => {
  beforeEach(() => {
    vi.mocked(passwordResetApi.verifyPasswordResetOtp).mockReset()
    vi.mocked(passwordResetApi.requestPasswordResetOtp).mockReset()
  })

  it('renders 6 individual digit boxes', () => {
    render(<VerifyStep email="jane@company.com" onVerified={vi.fn()} onRestart={vi.fn()} />)

    expect(screen.getAllByLabelText(/Digit \d of 6/)).toHaveLength(6)
  })

  it('calls onVerified with the reset token on a correct code', async () => {
    const user = userEvent.setup()
    const onVerified = vi.fn()
    vi.mocked(passwordResetApi.verifyPasswordResetOtp).mockResolvedValue({
      reset_token: 'the-reset-token',
    })

    render(<VerifyStep email="jane@company.com" onVerified={onVerified} onRestart={vi.fn()} />)
    await typeOtp(user, '123456')
    await user.click(screen.getByRole('button', { name: /verify code/i }))

    expect(passwordResetApi.verifyPasswordResetOtp).toHaveBeenCalledWith('jane@company.com', '123456')
    expect(onVerified).toHaveBeenCalledWith('the-reset-token')
  })

  it('shows an expired-specific message for error_code "expired"', async () => {
    const user = userEvent.setup()
    vi.mocked(passwordResetApi.verifyPasswordResetOtp).mockRejectedValue(
      apiError(422, { error_code: 'expired', message: 'This code has expired. Please request a new one.' }),
    )

    render(<VerifyStep email="jane@company.com" onVerified={vi.fn()} onRestart={vi.fn()} />)
    await typeOtp(user, '123456')
    await user.click(screen.getByRole('button', { name: /verify code/i }))

    expect(await screen.findByText(/this code has expired/i)).toBeInTheDocument()
  })

  it('shows a locked-out-specific message for error_code "locked_out"', async () => {
    const user = userEvent.setup()
    vi.mocked(passwordResetApi.verifyPasswordResetOtp).mockRejectedValue(
      apiError(422, {
        error_code: 'locked_out',
        message: 'Too many incorrect attempts. Please request a new code.',
      }),
    )

    render(<VerifyStep email="jane@company.com" onVerified={vi.fn()} onRestart={vi.fn()} />)
    await typeOtp(user, '000000')
    await user.click(screen.getByRole('button', { name: /verify code/i }))

    expect(await screen.findByText(/too many incorrect attempts/i)).toBeInTheDocument()
  })

  it('shows a wrong-code-specific message for error_code "invalid"', async () => {
    const user = userEvent.setup()
    vi.mocked(passwordResetApi.verifyPasswordResetOtp).mockRejectedValue(
      apiError(422, { error_code: 'invalid', message: 'Incorrect code. 3 attempts remaining.' }),
    )

    render(<VerifyStep email="jane@company.com" onVerified={vi.fn()} onRestart={vi.fn()} />)
    await typeOtp(user, '000000')
    await user.click(screen.getByRole('button', { name: /verify code/i }))

    expect(await screen.findByText(/3 attempts remaining/i)).toBeInTheDocument()
  })

  it('disables the resend link during the cooldown window', () => {
    render(<VerifyStep email="jane@company.com" onVerified={vi.fn()} onRestart={vi.fn()} />)

    expect(screen.getByText(/resend in \d+s/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /resend code/i })).not.toBeInTheDocument()
  })

  it('calls onRestart when "entered the wrong email?" is clicked', async () => {
    const user = userEvent.setup()
    const onRestart = vi.fn()
    render(<VerifyStep email="jane@company.com" onVerified={vi.fn()} onRestart={onRestart} />)

    await user.click(screen.getByRole('button', { name: /entered the wrong email/i }))

    expect(onRestart).toHaveBeenCalled()
  })
})
