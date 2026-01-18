import SettingsDashboard from '@/components/admin/settings-dashboard'
import { TYPOGRAPHY } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

export default async function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className={cn(TYPOGRAPHY.h2)}>Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your portfolio settings and preferences
        </p>
      </div>
      <SettingsDashboard />
    </div>
  )
}

