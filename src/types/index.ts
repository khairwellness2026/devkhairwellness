export type Locale = 'en' | 'hi' | 'ar';
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';
export type AppointmentStatus = 'New' | 'Contacted' | 'Confirmed' | 'Completed' | 'Cancelled';
export type SubmissionStatus = 'New' | 'Contacted' | 'Archived';

export interface SiteSettings {
  id: string;
  site_name: string;
  tagline: string;
  sub_tagline: string;
  phone_primary: string;
  phone_secondary?: string;
  whatsapp_number: string;
  email: string;
  address_line: string;
  location_details?: string;
  google_maps_url?: string;
  default_locale: string;
  enabled_locales: string[];
  logo_url: string;
  emblem_url: string;
  favicon_url: string;
  footer_text: string;
  created_at?: string;
  updated_at?: string;
}

export interface NavigationItem {
  id: string;
  path: string;
  sort_order: number;
  is_published: boolean;
  label: string; // from localized translation
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  featured_image?: string;
  content?: any;
  meta_title?: string;
  meta_description?: string;
}

export interface HomepageSection {
  id: string;
  section_key: string;
  is_visible: boolean;
  sort_order: number;
  image_url?: string;
  mobile_image_url?: string;
  metadata?: any;
  title?: string;
  subtitle?: string;
  description?: string;
  cta_label?: string;
  cta_link?: string;
  content?: any;
}

export interface Department {
  id: string;
  slug: string;
  icon: string;
  featured_image?: string;
  gallery_images?: string[];
  sort_order: number;
  is_published: boolean;
  name: string;
  short_description: string;
  full_description: string;
  treatments: string[];
  meta_title?: string;
  meta_description?: string;
  hero_banner_url?: string;
  hero_mobile_banner_url?: string;
}

export interface Doctor {
  id: string;
  slug: string;
  photo_url?: string;
  experience_years: number;
  department_id?: string;
  department_name?: string;
  sort_order: number;
  is_published: boolean;
  name: string;
  specialization: string;
  qualifications: string;
  biography: string;
}

export interface GalleryCategory {
  id: string;
  slug: string;
  sort_order: number;
  name: string;
}

export interface GalleryImage {
  id: string;
  category_id?: string;
  category_slug?: string;
  category_name?: string;
  image_url: string;
  cloudinary_public_id?: string;
  width?: number;
  height?: number;
  sort_order: number;
  is_published: boolean;
  title: string;
  caption?: string;
  alt_text: string;
}

export interface Appointment {
  id: string;
  reference_no: string;
  patient_name: string;
  phone: string;
  email?: string;
  department_id?: string;
  department_name?: string;
  preferred_date: string;
  preferred_time?: string;
  message?: string;
  status: AppointmentStatus;
  created_at: string;
}

export interface AppointmentNote {
  id: string;
  appointment_id: string;
  note: string;
  created_by?: string;
  created_at: string;
}

export interface ContactSubmission {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: SubmissionStatus;
  internal_notes?: string;
  created_at: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  public_id: string;
  secure_url: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  folder: string;
  alt_text?: string;
  created_at: string;
}

export interface SeoMetadata {
  id: string;
  route_path: string;
  locale: string;
  title: string;
  description: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  robots?: string;
  json_ld?: any;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
}

export interface AdminActivityLog {
  id: string;
  user_id?: string;
  user_email?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  metadata?: any;
  created_at: string;
}

