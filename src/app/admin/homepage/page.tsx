import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { getHomepageSections } from '@/services/contentService';
import HomepageCmsClient from './HomepageCmsClient';

export default async function AdminHomepageCmsPage() {
  const sections = await getHomepageSections('en');

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <AdminSidebar userRole="SUPER_ADMIN" userEmail="admin@khair.in" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Homepage CMS & Section Controls"
          subtitle="Manage hero content, CTAs, highlight badges, and section visibilities"
        />

        <div className="p-6 sm:p-8 max-w-5xl">
          <HomepageCmsClient initialSections={sections} />
        </div>
      </div>
    </div>
  );
}

