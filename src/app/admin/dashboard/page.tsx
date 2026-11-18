import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { getAppointments } from '@/services/appointmentService';
import { getContactSubmissions } from '@/services/enquiryService';
import { getDepartments, getDoctors, getGalleryImages } from '@/services/contentService';
import {
  CalendarCheck,
  Users,
  Building2,
  Image as ImageIcon,
  Mail,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const [appointments, submissions, departments, doctors, galleryImages] = await Promise.all([
    getAppointments(),
    getContactSubmissions(),
    getDepartments('en'),
    getDoctors('en'),
    getGalleryImages('en'),
  ]);

  const totalAppointments = appointments.length;
  const newAppointments = appointments.filter((a) => a.status === 'New').length;
  const confirmedAppointments = appointments.filter((a) => a.status === 'Confirmed').length;
  const newSubmissions = submissions.filter((s) => s.status === 'New').length;

  const stats = [
    {
      title: 'Total Appointments',
      value: totalAppointments,
      subtitle: `${newAppointments} awaiting review`,
      icon: CalendarCheck,
      color: 'bg-emerald-500',
    },
    {
      title: 'Contact Enquiries',
      value: submissions.length,
      subtitle: `${newSubmissions} new enquiries`,
      icon: Mail,
      color: 'bg-blue-500',
    },
    {
      title: 'Clinical Departments',
      value: departments.length,
      subtitle: 'Published in 3 languages',
      icon: Building2,
      color: 'bg-amber-500',
    },
    {
      title: 'Medical Specialists',
      value: doctors.length,
      subtitle: 'Active consultants',
      icon: Users,
      color: 'bg-teal-500',
    },
  ];

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <AdminSidebar userRole="SUPER_ADMIN" userEmail="admin@khair.in" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Dashboard Overview" subtitle="Real-time clinical management and content metrics" />

        <div className="p-6 sm:p-8 space-y-8 max-w-7xl">
          
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-serif font-bold text-khair-deepForest">
                      {stat.value}
                    </p>
                    <p className="text-[11px] text-gray-400 font-medium">
                      {stat.subtitle}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl ${stat.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Appointments & Enquiries Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Recent Appointments Table */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div>
                  <h3 className="font-serif text-lg font-bold text-khair-deepForest">
                    Recent Consultation Enquiries
                  </h3>
                  <p className="text-xs text-gray-400">Incoming patient appointment requests</p>
                </div>
                <a
                  href="/admin/appointments"
                  className="text-xs font-bold text-khair-botanical hover:underline flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {appointments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-100">
                        <th className="py-2.5 font-medium">Ref #</th>
                        <th className="py-2.5 font-medium">Patient</th>
                        <th className="py-2.5 font-medium">Department</th>
                        <th className="py-2.5 font-medium">Date</th>
                        <th className="py-2.5 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {appointments.slice(0, 5).map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="py-3 font-mono font-bold text-khair-deepForest">
                            {app.reference_no}
                          </td>
                          <td className="py-3 font-semibold text-gray-800">
                            {app.patient_name}
                          </td>
                          <td className="py-3 text-gray-600">
                            {app.department_name || 'General Consultation'}
                          </td>
                          <td className="py-3 text-gray-500">
                            {app.preferred_date}
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                app.status === 'New'
                                  ? 'bg-amber-100 text-amber-700'
                                  : app.status === 'Confirmed'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {app.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-gray-400">
                  No appointment enquiries received yet.
                </div>
              )}
            </div>

            {/* Quick Content Summary Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs space-y-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-khair-deepForest">
                  Website Health & CMS Status
                </h3>
                <p className="text-xs text-gray-400">Active content items in database</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <span className="font-semibold text-gray-700">Supported Languages</span>
                  <span className="font-bold text-khair-deepForest">English (en), हिन्दी (hi), العربية (ar)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <span className="font-semibold text-gray-700">Media Storage Engine</span>
                  <span className="font-bold text-khair-deepForest">Cloudinary (Server-signed)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <span className="font-semibold text-gray-700">Database Engine</span>
                  <span className="font-bold text-khair-deepForest">Supabase PostgreSQL (RLS Enabled)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <span className="font-semibold text-gray-700">Active Gallery Images</span>
                  <span className="font-bold text-khair-deepForest">{galleryImages.length} images</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="/admin/homepage"
                  className="w-full py-3 text-xs font-bold text-white bg-khair-deepForest hover:bg-khair-darkGreen rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Manage Homepage CMS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

