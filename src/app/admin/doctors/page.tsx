import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { getDoctors, getDepartments } from '@/services/contentService';
import DoctorsManagerClient from './DoctorsManagerClient';

export default async function AdminDoctorsPage() {
  const [doctors, departments] = await Promise.all([
    getDoctors('en'),
    getDepartments('en'),
  ]);

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <AdminSidebar userRole="SUPER_ADMIN" userEmail="admin@khair.in" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Medical Experts & Doctors"
          subtitle="Manage doctors, qualifications, biographies, and department associations"
        />

        <div className="p-6 sm:p-8 max-w-7xl">
          <DoctorsManagerClient
            initialDoctors={doctors}
            departments={departments}
          />
        </div>
      </div>
    </div>
  );
}

