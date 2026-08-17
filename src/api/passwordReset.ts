import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types'

export function requestPasswordResetOtp(email: string) {
  return apiClient
    .post<ApiResponse<null>>('/forgot-password', { email })
    .then((res) => res.data)
}

export function verifyPasswordResetOtp(email: string, otp: string) {
  return apiClient
    .post<ApiResponse<{ reset_token: string }>>('/verify-otp', { email, otp })
    .then((res) => res.data.data)
}

export function resetPassword(resetToken: string, password: string, passwordConfirmation: string) {
  return apiClient
    .post<ApiResponse<null>>('/reset-password', {
      reset_token: resetToken,
      password,
      password_confirmation: passwordConfirmation,
    })
    .then((res) => res.data)
}
