import { StatsCards } from '@/features/dashboard/StatsCards'

export function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <StatsCards />
    </div>
  )
}
