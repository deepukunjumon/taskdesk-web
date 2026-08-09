import { useQuery } from '@tanstack/react-query'
import { getWorkItemStats } from '@/api/workItems'

export function useWorkItemStats() {
  return useQuery({
    queryKey: ['work-items', 'stats'],
    queryFn: getWorkItemStats,
  })
}
