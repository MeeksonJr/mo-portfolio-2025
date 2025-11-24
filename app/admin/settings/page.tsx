import SettingsDashboard from '@/components/admin/settings-dashboard'

export default async function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your portfolio settings and preferences
        </p>
      </div>
      <SettingsDashboard />
    </div>
  )
}

