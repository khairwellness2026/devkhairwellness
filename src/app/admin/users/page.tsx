import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { getServiceRoleClient } from '@/lib/supabase/service-role';
import { ShieldCheck } from 'lucide-react';

export default async function AdminUsersPage() {
  let users: any[] = [];

  const client = getServiceRoleClient();
  if (client) {
    const { data } = await client
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) users = data;
  }

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <AdminSidebar userRole="SUPER_ADMIN" userEmail="admin@khair.in" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Staff Roles & Access Control"
          subtitle="Enforce Role-Based Access Control (SUPER_ADMIN, ADMIN, EDITOR) with Supabase Auth"
        />

        <div className="p-6 sm:p-8 max-w-5xl space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-serif text-lg font-bold text-khair-deepForest">
                Authorized Administrative Staff
              </h3>
            </div>

            {users.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {users.map((u) => (
                  <div key={u.id} className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-khair-warmIvory border border-khair-gold/40 flex items-center justify-center font-bold text-khair-deepForest text-xs">
                        {(u.full_name || u.email || 'AD').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-800">{u.full_name || 'Admin User'}</h4>
                        <p className="text-[11px] text-gray-400">{u.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          u.role === 'SUPER_ADMIN'
                            ? 'bg-purple-100 text-purple-700'
                            : u.role === 'ADMIN'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-gray-400 space-y-2">
                <ShieldCheck className="w-8 h-8 text-gray-300 mx-auto" />
                <p>No user profiles synced from Supabase Auth yet.</p>
                <p className="text-[11px] text-gray-400">
                  Users registered via Supabase Auth will be auto-synced by the database trigger.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
