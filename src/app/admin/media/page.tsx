import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import MediaLibraryClient from './MediaLibraryClient';

export default function AdminMediaPage() {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <AdminSidebar userRole="SUPER_ADMIN" userEmail="admin@khair.in" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Cloudinary Media Library"
          subtitle="Manage uploaded branding, department photography, doctor photos, and gallery images"
        />

        <div className="p-6 sm:p-8 max-w-7xl">
          <MediaLibraryClient />
        </div>
      </div>
    </div>
  );
}

