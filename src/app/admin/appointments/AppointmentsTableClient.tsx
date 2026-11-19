'use client';

import { useState } from 'react';
import { Appointment, Department, AppointmentStatus } from '@/types';
import { Search, Download, Filter, MessageSquare, Check, X, Clock, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  initialAppointments: Appointment[];
  departments: Department[];
}

export default function AppointmentsTableClient({ initialAppointments, departments }: Props) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState<Appointment | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const filtered = appointments.filter((app) => {
    const matchesSearch =
      app.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      app.phone.includes(search) ||
      app.reference_no.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesDept = deptFilter === 'all' || app.department_id === deptFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const handleStatusChange = async (id: string, newStatus: AppointmentStatus) => {
    if (isUpdating) return;
    setIsUpdating(true);
    // Optimistic update
    const prevAppointments = appointments;
    const prevSelected = selectedApp;
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp({ ...selectedApp, status: newStatus });
    }
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Update failed');
      }
      showToast('success', `Status updated to "${newStatus}"`);
    } catch (err: any) {
      // Rollback on failure
      setAppointments(prevAppointments);
      setSelectedApp(prevSelected);
      showToast('error', err.message || 'Failed to update status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Reference No', 'Patient Name', 'Phone', 'Email', 'Department', 'Date', 'Time Slot', 'Status', 'Message'];
    const rows = filtered.map((a) => [
      a.reference_no,
      `"${a.patient_name}"`,
      `"${a.phone}"`,
      `"${a.email || ''}"`,
      `"${a.department_name || 'General'}"`,
      a.preferred_date,
      `"${a.preferred_time || ''}"`,
      a.status,
      `"${(a.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `khair_appointments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold border transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {toast.type === 'success'
            ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            : <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
          <span>{toast.msg}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-gray-400 hover:text-gray-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Control Bar: Search, Filters & Export */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search patient, phone, ref..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3.5 py-2 pl-9 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:border-khair-gold outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:border-khair-gold outline-none"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-khair-deepForest bg-khair-warmIvory hover:bg-khair-softBeige rounded-xl border border-khair-gold/40 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 border-b border-gray-100 text-gray-500">
              <tr>
                <th className="py-3 px-4 font-semibold">Ref Code</th>
                <th className="py-3 px-4 font-semibold">Patient Name</th>
                <th className="py-3 px-4 font-semibold">Contact Phone</th>
                <th className="py-3 px-4 font-semibold">Department</th>
                <th className="py-3 px-4 font-semibold">Date & Slot</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length > 0 ? (
                filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-khair-deepForest">
                      {app.reference_no}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-800">
                      {app.patient_name}
                      {app.email && <span className="block text-[10px] text-gray-400 font-normal">{app.email}</span>}
                    </td>
                    <td className="py-3.5 px-4 text-gray-700">
                      <a href={`tel:${app.phone}`} className="hover:text-khair-botanical hover:underline">
                        {app.phone}
                      </a>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      {app.department_name || 'General Consultation'}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      <span className="block font-medium">{app.preferred_date}</span>
                      <span className="block text-[10px] text-gray-400">{app.preferred_time || 'Morning'}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          app.status === 'New'
                            ? 'bg-amber-100 text-amber-700'
                            : app.status === 'Contacted'
                            ? 'bg-blue-100 text-blue-700'
                            : app.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : app.status === 'Completed'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedApp(app)}
                        className="px-3 py-1.5 text-[11px] font-semibold text-khair-deepForest bg-khair-warmIvory hover:bg-khair-softBeige rounded-lg border border-khair-gold/30 transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    No matching appointment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment Details & Status Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl border border-khair-gold/30">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-khair-botanical">
                  ENQUIRY REFERENCE
                </span>
                <h3 className="font-mono text-xl font-bold text-khair-deepForest">
                  {selectedApp.reference_no}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-700">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-gray-50">
                <div>
                  <span className="text-gray-400 block text-[10px]">Patient Name</span>
                  <span className="font-bold text-gray-900">{selectedApp.patient_name}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Contact Phone</span>
                  <a href={`tel:${selectedApp.phone}`} className="font-bold text-khair-botanical underline">
                    {selectedApp.phone}
                  </a>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Department</span>
                  <span className="font-semibold">{selectedApp.department_name || 'General Consultation'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Preferred Date</span>
                  <span className="font-semibold">{selectedApp.preferred_date}</span>
                </div>
              </div>

              {selectedApp.message && (
                <div className="p-3 rounded-2xl bg-khair-warmIvory/60 border border-khair-gold/30">
                  <span className="font-bold text-khair-deepForest block mb-1">Patient Symptoms / Notes:</span>
                  <p className="leading-relaxed">{selectedApp.message}</p>
                </div>
              )}

              {/* Status Update Actions */}
              <div className="space-y-2 pt-2">
                <span className="font-bold text-gray-900 block text-xs">Update Status:</span>
                <div className="flex flex-wrap gap-2">
                  {(['New', 'Contacted', 'Confirmed', 'Completed', 'Cancelled'] as AppointmentStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleStatusChange(selectedApp.id, st)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        selectedApp.status === st
                          ? 'bg-khair-deepForest text-white border-khair-deepForest shadow-xs'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2 text-xs font-bold text-white bg-khair-deepForest rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
