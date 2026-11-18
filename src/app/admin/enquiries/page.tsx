import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { getContactSubmissions } from '@/services/enquiryService';
import EnquiriesTableClient from './EnquiriesTableClient';

export default async function AdminEnquiriesPage() {
  const submissions = await getContactSubmissions();

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <AdminSidebar userRole="SUPER_ADMIN" userEmail="admin@khair.in" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="General Contact Enquiries"
          subtitle="Manage queries, patient messages, and general communications"
        />

        <div className="p-6 sm:p-8 max-w-7xl">
          <EnquiriesTableClient initialSubmissions={submissions} />
        </div>
      </div>
    </div>
  );
}

