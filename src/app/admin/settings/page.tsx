import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { getSiteSettings } from '@/services/contentService';
import SettingsClient from './SettingsClient';

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <AdminSidebar userRole="SUPER_ADMIN" userEmail="admin@khair.in" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Global Website Settings"
          subtitle="Configure contact phone numbers, WhatsApp, addresses, brand assets, and locale defaults"
        />

        <div className="p-6 sm:p-8 max-w-4xl">
          <SettingsClient initialSettings={settings} />
        </div>
      </div>
    </div>
  );
}

