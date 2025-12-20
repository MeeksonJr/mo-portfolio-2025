import AdminSidebar from '@/components/admin/admin-sidebar'
import AdminHeader from '@/components/admin/admin-header'
import AdminAuthWrapper from '@/components/admin/admin-auth-wrapper'
import AdminKeyboardShortcuts from '@/components/admin/admin-keyboard-shortcuts'
import KeyboardShortcutsHelp from '@/components/admin/keyboard-shortcuts-help'
import MobileAdminWrapper from '@/components/admin/mobile-admin-wrapper'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthWrapper>
      <AdminKeyboardShortcuts />
      <KeyboardShortcutsHelp />
      {/* Desktop Layout */}
      <div className="hidden lg:block min-h-screen bg-background">
        <div className="flex">
          {/* Sidebar */}
          <AdminSidebar />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            <AdminHeader />
            <main className="flex-1 p-6 overflow-x-hidden">
              <div className="max-w-full">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
      
      {/* Mobile Layout */}
      <MobileAdminWrapper>
        {children}
      </MobileAdminWrapper>
    </AdminAuthWrapper>
  )
}
