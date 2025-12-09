import DashboardContent from '@/components/DashboardContent'
import AppShell from '@/components/AppShell'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <AppShell active="dashboard">
      <DashboardContent />
    </AppShell>
  )
}
