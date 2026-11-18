import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { Search, Globe, Save } from 'lucide-react';

export default function AdminSeoPage() {
  const routes = [
    { path: '/', label: 'Home Page' },
    { path: '/about', label: 'About Us' },
    { path: '/departments', label: 'Departments Listing' },
    { path: '/doctors', label: 'Doctors Directory' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/contact', label: 'Contact & Booking' },
  ];

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <AdminSidebar userRole="SUPER_ADMIN" userEmail="admin@khair.in" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="SEO & Metadata Management"
          subtitle="Configure canonical URLs, Open Graph tags, robots directives, and localized metadata"
        />

        <div className="p-6 sm:p-8 max-w-5xl space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-khair-deepForest">
              Configured Route Metadata (English, Hindi, Arabic)
            </h3>

            <div className="divide-y divide-gray-100">
              {routes.map((r) => (
                <div key={r.path} className="py-4 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-khair-deepForest bg-khair-warmIvory px-2 py-0.5 rounded border border-khair-gold/30">
                      {r.path}
                    </span>
                    <h4 className="text-sm font-semibold text-gray-800 mt-1">{r.label}</h4>
                    <p className="text-[11px] text-gray-400">Canonical: https://khair.in{r.path} • Robots: index, follow</p>
                  </div>

                  <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                    3 Locales Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

