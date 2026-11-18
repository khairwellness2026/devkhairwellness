import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { getServiceRoleClient } from '@/lib/supabase/service-role';
import { History } from 'lucide-react';

export default async function AdminLogsPage() {
  let logs: any[] = [];

  const client = getServiceRoleClient();
  if (client) {
    const { data } = await client
      .from('admin_activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    if (data) logs = data;
  }

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <AdminSidebar userRole="SUPER_ADMIN" userEmail="admin@khair.in" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Administrative Audit Trail & Activity Logs"
          subtitle="Immutable record of content updates, appointments handling, and authentication events"
        />

        <div className="p-6 sm:p-8 max-w-5xl space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <History className="w-4 h-4 text-khair-botanical" />
              <h3 className="font-serif text-lg font-bold text-khair-deepForest">
                Recorded Administrative Operations
              </h3>
            </div>

            {logs.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <div key={log.id} className="py-3.5 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800">{log.user_email || 'Administrator'}</span>
                        <span className="font-mono text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {log.action}
                        </span>
                      </div>
                      <p className="text-gray-500">{log.entity_type}: {log.entity_id}</p>
                    </div>
                    <span className="text-[11px] text-gray-400">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-gray-400">
                No activity logs recorded yet. Actions taken in the CMS will appear here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
