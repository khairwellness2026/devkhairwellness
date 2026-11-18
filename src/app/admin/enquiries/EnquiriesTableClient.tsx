'use client';

import { useState } from 'react';
import { ContactSubmission, SubmissionStatus } from '@/types';
import { Search, Mail, Phone, Trash2, CheckCircle2, Archive, X } from 'lucide-react';

export default function EnquiriesTableClient({
  initialSubmissions,
}: {
  initialSubmissions: ContactSubmission[];
}) {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>(initialSubmissions);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ContactSubmission | null>(null);

  const filtered = submissions.filter(
    (s) =>
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.message && s.message.toLowerCase().includes(search.toLowerCase()))
  );

  const updateStatus = async (id: string, status: SubmissionStatus) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
    if (selected && selected.id === id) {
      setSelected({ ...selected, status });
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    if (selected && selected.id === id) setSelected(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Search */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search by name, email, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3.5 py-2 pl-9 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 border-b border-gray-100 text-gray-500">
              <tr>
                <th className="py-3 px-4 font-semibold">Sender</th>
                <th className="py-3 px-4 font-semibold">Subject</th>
                <th className="py-3 px-4 font-semibold">Message Preview</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length > 0 ? (
                filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-gray-800">
                      <div>{sub.full_name}</div>
                      <div className="text-[10px] text-gray-400 font-normal">{sub.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-700 font-medium">
                      {sub.subject || 'General Enquiry'}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 max-w-xs truncate">
                      {sub.message}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          sub.status === 'New'
                            ? 'bg-amber-100 text-amber-700'
                            : sub.status === 'Contacted'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => setSelected(sub)}
                        className="px-3 py-1.5 text-[11px] font-semibold text-khair-deepForest bg-khair-warmIvory rounded-lg border border-khair-gold/30 hover:bg-khair-softBeige"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSubmission(sub.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    No contact submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enquiry Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl border border-khair-gold/30">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-khair-botanical">
                  CONTACT MESSAGE
                </span>
                <h3 className="font-serif text-xl font-bold text-khair-deepForest">
                  {selected.full_name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-700">
              <div className="p-3 rounded-2xl bg-gray-50 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-gray-400 block text-[10px]">Email</span>
                  <a href={`mailto:${selected.email}`} className="font-semibold text-khair-botanical underline">
                    {selected.email}
                  </a>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Phone</span>
                  <span>{selected.phone || 'Not provided'}</span>
                </div>
              </div>

              <div>
                <span className="text-gray-400 block text-[10px] mb-1">Subject</span>
                <p className="font-bold text-gray-900">{selected.subject || 'General Enquiry'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-khair-warmIvory/60 border border-khair-gold/30">
                <span className="text-gray-500 block text-[10px] mb-1 font-semibold">Message Content:</span>
                <p className="leading-relaxed whitespace-pre-line">{selected.message}</p>
              </div>

              <div className="space-y-2 pt-2">
                <span className="font-bold text-gray-900 block text-xs">Update Status:</span>
                <div className="flex gap-2">
                  {(['New', 'Contacted', 'Archived'] as SubmissionStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateStatus(selected.id, st)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        selected.status === st
                          ? 'bg-khair-deepForest text-white border-khair-deepForest'
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
                onClick={() => setSelected(null)}
                className="px-5 py-2 text-xs font-bold text-white bg-khair-deepForest rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

