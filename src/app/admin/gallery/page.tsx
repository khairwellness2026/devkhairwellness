import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { getGalleryImages, getGalleryCategories } from '@/services/contentService';
import GalleryManagerClient from './GalleryManagerClient';

export default async function AdminGalleryPage() {
  const [images, categories] = await Promise.all([
    getGalleryImages('en'),
    getGalleryCategories('en'),
  ]);

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <AdminSidebar userRole="SUPER_ADMIN" userEmail="admin@khair.in" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Gallery & Visual Assets"
          subtitle="Manage facilities photography, treatment room galleries, and captions"
        />

        <div className="p-6 sm:p-8 max-w-7xl">
          <GalleryManagerClient initialImages={images} categories={categories} />
        </div>
      </div>
    </div>
  );
}

