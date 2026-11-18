import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { getDepartments } from '@/services/contentService';
import DepartmentsManagerClient from './DepartmentsManagerClient';

export default async function AdminDepartmentsPage() {
  const [deptsEn, deptsHi, deptsAr] = await Promise.all([
    getDepartments('en'),
    getDepartments('hi'),
    getDepartments('ar'),
  ]);

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <AdminSidebar userRole="SUPER_ADMIN" userEmail="admin@khair.in" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Departments & Clinical Specialities"
          subtitle="Manage departments, treatments, translations, and publication states"
        />

        <div className="p-6 sm:p-8 max-w-7xl">
          <DepartmentsManagerClient
            initialEn={deptsEn}
            initialHi={deptsHi}
            initialAr={deptsAr}
          />
        </div>
      </div>
    </div>
  );
}

