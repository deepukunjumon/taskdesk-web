import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { router } from '@/routes/router'
import { useAuthStore } from '@/stores/authStore'

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
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  )
}

export default App
