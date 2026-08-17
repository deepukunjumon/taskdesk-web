/**
 * This file contains utility functions for handling errors related to OTP (One-Time Password) operations in the forgot-password feature.
 */
export type OtpErrorCode = 'expired' | 'invalid' | 'locked_out'

export function getErrorStatus(error: unknown): number | undefined {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    return (error as { response?: { status?: number } }).response?.status
  }
  return undefined
}

export function getErrorCode(error: unknown): OtpErrorCode | undefined {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const code = (error as { response?: { data?: { error_code?: string } } }).response?.data
      ?.error_code
    if (code === 'expired' || code === 'invalid' || code === 'locked_out') {
      return code
    }
  }
  return undefined
}

export function getErrorMessage(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    return (error as { response?: { data?: { message?: string } } }).response?.data?.message
  }
  return undefined
}

/**
 * 
 * @param error 
 * @param field 
 * @returns 
 */
export function getValidationError(error: unknown, field: string): string | undefined {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const errors = (error as { response?: { data?: { errors?: Record<string, string[]> } } })
      .response?.data?.errors
    return errors?.[field]?.[0]
  }
  return undefined
}
