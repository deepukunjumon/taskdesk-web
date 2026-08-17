import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { LoginPage } from '@/pages/LoginPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { WorkRegisterPage } from '@/pages/WorkRegisterPage'
import { MyTasksPage } from '@/pages/MyTasksPage'
import { ReportingStructurePage } from '@/pages/ReportingStructurePage'
import { DepartmentsPage } from '@/pages/DepartmentsPage'
import { CategoriesPage } from '@/pages/CategoriesPage'
import { BranchesPage } from '@/pages/BranchesPage'
import { RequireAuth } from '@/routes/RequireAuth'
import { RequireRole } from '@/routes/RequireRole'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <DashboardPage /> },
          {
            path: 'work-register',
            element: (
              <RequireRole
                roles={['superadmin', 'admin', 'user']}
                predicate={(user) =>
                  user.roles.some((role) => role === 'superadmin' || role === 'admin') ||
                  (user.abilities?.is_reporting_manager ?? false)
                }
              >
                <WorkRegisterPage />
              </RequireRole>
            ),
          },
          { path: 'my-tasks', element: <MyTasksPage /> },
          {
            path: 'reports',
            element: (
              <RequireRole roles={['superadmin', 'admin']}>
                <PlaceholderPage title="Reports" />
              </RequireRole>
            ),
          },
          {
            path: 'admin/reporting-structure',
            element: (
              <RequireRole roles={['superadmin', 'admin']}>
                <ReportingStructurePage />
              </RequireRole>
            ),
          },
          {
            path: 'admin/departments',
            element: (
              <RequireRole roles={['superadmin', 'admin']}>
                <DepartmentsPage />
              </RequireRole>
            ),
          },
          {
            path: 'admin/categories',
            element: (
              <RequireRole roles={['superadmin', 'admin']}>
                <CategoriesPage />
              </RequireRole>
            ),
          },
          {
            path: 'admin/branches',
            element: (
              <RequireRole roles={['superadmin', 'admin']}>
                <BranchesPage />
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
