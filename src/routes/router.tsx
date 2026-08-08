import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { LoginPage } from '@/pages/LoginPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RequireAuth } from '@/routes/RequireAuth'
import { RequireRole } from '@/routes/RequireRole'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <PlaceholderPage title="Dashboard" /> },
          { path: 'work-register', element: <PlaceholderPage title="Work Register" /> },
          {
            path: 'reports',
            element: (
              <RequireRole roles={['superadmin', 'admin']}>
                <PlaceholderPage title="Reports" />
              </RequireRole>
            ),
          },
          {
            path: 'admin',
            element: (
              <RequireRole roles={['superadmin']}>
                <PlaceholderPage title="Admin" />
              </RequireRole>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
