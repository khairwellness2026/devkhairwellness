import { getServiceRoleClient } from '@/lib/supabase/service-role';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Appointment, AppointmentNote, AppointmentStatus } from '@/types';

export function generateAppointmentRef(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `KHR-${year}-${random}`;
}

export async function createAppointment(data: {
  patient_name: string;
  phone: string;
  email?: string;
  department_id?: string;
  preferred_date: string;
  preferred_time?: string;
  message?: string;
  ip_address?: string;
}) {
  const reference_no = generateAppointmentRef();
  const client = getServiceRoleClient();
  if (!client) {
    throw new Error('Database client unavailable');
  }

  const { data: record, error } = await client
    .from('appointments')
    .insert([
      {
        reference_no,
        patient_name: data.patient_name.trim(),
        phone: data.phone.trim(),
        email: data.email?.trim() || null,
        department_id: data.department_id || null,
        preferred_date: data.preferred_date,
        preferred_time: data.preferred_time || null,
        message: data.message?.trim() || null,
        status: 'New',
        ip_address: data.ip_address || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error inserting appointment:', error);
    throw error;
  }

  return record as Appointment;
}

export async function getAppointments(filters?: {
  status?: string;
  department_id?: string;
  search?: string;
  date?: string;
}): Promise<Appointment[]> {
  const client = getServiceRoleClient();
  if (!client) return [];

  let query = client
    .from('appointments')
    .select(`
      *,
      departments ( slug, department_translations ( locale, name ) )
    `)
    .order('created_at', { ascending: false });

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }
  if (filters?.department_id && filters.department_id !== 'all') {
    query = query.eq('department_id', filters.department_id);
  }
  if (filters?.date) {
    query = query.eq('preferred_date', filters.date);
  }
  if (filters?.search) {
    query = query.or(`patient_name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,reference_no.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error || !data) {
    console.error('Error fetching appointments:', error);
    return [];
  }

  return data.map((item: any) => {
    const deptTrans = item.departments?.department_translations?.find((t: any) => t.locale === 'en');
    return {
      id: item.id,
      reference_no: item.reference_no,
      patient_name: item.patient_name,
      phone: item.phone,
      email: item.email,
      department_id: item.department_id,
      department_name: deptTrans?.name || '',
      preferred_date: item.preferred_date,
      preferred_time: item.preferred_time,
      message: item.message,
      status: item.status,
      created_at: item.created_at,
    };
  });
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  const client = getServiceRoleClient();
  if (!client) throw new Error('Database client unavailable');

  const { data, error } = await client
    .from('appointments')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addAppointmentNote(appointment_id: string, note: string, userId?: string) {
  const client = getServiceRoleClient();
  if (!client) throw new Error('Database client unavailable');

  const { data, error } = await client
    .from('appointment_notes')
    .insert([{ appointment_id, note, created_by: userId || null }])
    .select()
    .single();

  if (error) throw error;
  return data as AppointmentNote;
}

export async function getAppointmentNotes(appointment_id: string): Promise<AppointmentNote[]> {
  const client = getServiceRoleClient();
  if (!client) return [];

  const { data, error } = await client
    .from('appointment_notes')
    .select('*')
    .eq('appointment_id', appointment_id)
    .order('created_at', { ascending: true });

  if (error || !data) return [];
  return data as AppointmentNote[];
}

