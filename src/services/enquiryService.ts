import { getServiceRoleClient } from '@/lib/supabase/service-role';
import { ContactSubmission, SubmissionStatus } from '@/types';

export async function createContactSubmission(data: {
  full_name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  const client = getServiceRoleClient();
  if (!client) throw new Error('Database client unavailable');

  const { data: record, error } = await client
    .from('contact_submissions')
    .insert([
      {
        full_name: data.full_name.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || null,
        subject: data.subject?.trim() || null,
        message: data.message.trim(),
        status: 'New',
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error inserting contact submission:', error);
    throw error;
  }

  return record as ContactSubmission;
}

export async function getContactSubmissions(filters?: {
  status?: string;
  search?: string;
}): Promise<ContactSubmission[]> {
  const client = getServiceRoleClient();
  if (!client) return [];

  let query = client.from('contact_submissions').select('*').order('created_at', { ascending: false });

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }
  if (filters?.search) {
    query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,message.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return data as ContactSubmission[];
}

export async function updateContactStatus(id: string, status: SubmissionStatus, internal_notes?: string) {
  const client = getServiceRoleClient();
  if (!client) throw new Error('Database client unavailable');

  const updatePayload: any = { status, updated_at: new Date().toISOString() };
  if (internal_notes !== undefined) {
    updatePayload.internal_notes = internal_notes;
  }

  const { data, error } = await client
    .from('contact_submissions')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteContactSubmission(id: string) {
  const client = getServiceRoleClient();
  if (!client) throw new Error('Database client unavailable');

  const { error } = await client.from('contact_submissions').delete().eq('id', id);
  if (error) throw error;
  return true;
}

