import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { getAppointments } from '@/services/appointmentService';
import { getDepartments } from '@/services/contentService';
import AppointmentsTableClient from './AppointmentsTableClient';

export default async function AdminAppointmentsPage() {
  const [appointments, departments] = await Promise.all([
    getAppointments(),
    getDepartments('en'),
  ]);

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <AdminSidebar userRole="SUPER_ADMIN" userEmail="admin@khair.in" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Patient Appointment Enquiries"
          subtitle="Review, update status, and manage incoming patient consultation requests"
        />

        <div className="p-6 sm:p-8 max-w-7xl">
          <AppointmentsTableClient
            initialAppointments={appointments}
            departments={departments}
          />
        </div>
      </div>
    </div>
  );
}

