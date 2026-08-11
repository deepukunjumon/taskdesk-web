import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { router } from '@/routes/router'
import { useAuthStore } from '@/stores/authStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      // Every query always refetches — data is never served from a stale
      // in-memory cache (e.g. a newly added department/category showing up
      // immediately everywhere it's looked up, not just where it was created).
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: 'always',
    },
  },
})

function App() {
  const hydrate = useAuthStore((state) => state.hydrate)
  const isHydrated = useAuthStore((state) => state.isHydrated)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  if (!isHydrated) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
