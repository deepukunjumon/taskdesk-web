import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as lookupsApi from '@/api/lookups'

export function useUpdateUserManager() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, managerId }: { userId: string; managerId: string | null }) =>
      lookupsApi.updateUserManager(userId, managerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Manager updated.')
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error) ?? 'Could not update the manager.')
    },
  })
}

function extractErrorMessage(error: unknown): string | null {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message ===
      'string'
  ) {
    return (error as { response: { data: { message: string } } }).response.data.message
  }

  return null
}
