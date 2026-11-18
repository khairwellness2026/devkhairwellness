import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { getPageContent } from '@/services/contentService';
import PagesCmsClient from './PagesCmsClient';

export default async function AdminPagesCmsPage() {
  const [aboutEn, contactEn] = await Promise.all([
    getPageContent('about', 'en'),
    getPageContent('contact', 'en'),
  ]);

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <AdminSidebar userRole="SUPER_ADMIN" userEmail="admin@khair.in" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Page Content & Translation CMS"
          subtitle="Edit narrative pages (About Us, Contact, Privacy Policy, Terms) across all 3 languages"
        />

        <div className="p-6 sm:p-8 max-w-5xl">
          <PagesCmsClient initialAbout={aboutEn} initialContact={contactEn} />
        </div>
      </div>
    </div>
  );
}

