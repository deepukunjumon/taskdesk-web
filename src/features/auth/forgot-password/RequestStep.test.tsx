import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RequestStep } from '@/features/auth/forgot-password/RequestStep'
import * as passwordResetApi from '@/api/passwordReset'

vi.mock('@/api/passwordReset')

function apiError(status: number, data: Record<string, unknown>) {
  return { response: { status, data } }
}

describe('RequestStep', () => {
  beforeEach(() => {
    vi.mocked(passwordResetApi.requestPasswordResetOtp).mockReset()
  })

  it('calls onSubmitted with the email on success', async () => {
    const user = userEvent.setup()
    const onSubmitted = vi.fn()
    vi.mocked(passwordResetApi.requestPasswordResetOtp).mockResolvedValue({
      success: true,
      data: null,
    })

    render(<RequestStep onSubmitted={onSubmitted} />)
    await user.type(screen.getByLabelText(/email/i), 'jane@company.com')
    await user.click(screen.getByRole('button', { name: /send verification code/i }))

    expect(onSubmitted).toHaveBeenCalledWith('jane@company.com')
  })

  it('shows the specific "no account found" message and does not advance', async () => {
    const user = userEvent.setup()
    const onSubmitted = vi.fn()
    vi.mocked(passwordResetApi.requestPasswordResetOtp).mockRejectedValue(
      apiError(422, { errors: { email: ['No account found with this email address.'] } }),
    )

    render(<RequestStep onSubmitted={onSubmitted} />)
    await user.type(screen.getByLabelText(/email/i), 'nobody@company.com')
    await user.click(screen.getByRole('button', { name: /send verification code/i }))

    expect(await screen.findByText(/no account found with this email address/i)).toBeInTheDocument()
    expect(onSubmitted).not.toHaveBeenCalled()
  })

  it('shows a rate-limit message on 429', async () => {
    const user = userEvent.setup()
    vi.mocked(passwordResetApi.requestPasswordResetOtp).mockRejectedValue(apiError(429, {}))

    render(<RequestStep onSubmitted={vi.fn()} />)
    await user.type(screen.getByLabelText(/email/i), 'jane@company.com')
    await user.click(screen.getByRole('button', { name: /send verification code/i }))

    expect(await screen.findByText(/too many requests/i)).toBeInTheDocument()
  })
})
