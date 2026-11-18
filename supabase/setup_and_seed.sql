-- ============================================================================
-- KHAIR INTERNATIONAL — SUPABASE DATABASE SETUP & SEED SCRIPT
-- Master Architecture: Tables, RLS, Indexes, Triggers, and Multilingual Seed Data
-- Safe to execute in Supabase SQL Editor (Idempotent)
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS & DOMAINS (IF NOT EXISTS)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status') THEN
        CREATE TYPE appointment_status AS ENUM ('New', 'Contacted', 'Confirmed', 'Completed', 'Cancelled');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_status') THEN
        CREATE TYPE submission_status AS ENUM ('New', 'Contacted', 'Archived');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_type') THEN
        CREATE TYPE user_role_type AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR');
    END IF;
END $$;

-- 3. PROFILES TABLE (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role_type NOT NULL DEFAULT 'EDITOR',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 4. USER ROLES TABLE
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role_type NOT NULL DEFAULT 'EDITOR',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    CONSTRAINT unique_user_role UNIQUE (user_id, role)
);

-- 5. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_name TEXT NOT NULL DEFAULT 'KHAIR International',
    tagline TEXT DEFAULT 'Your Journey Back to Wellbeing',
    sub_tagline TEXT DEFAULT 'Kottakkal Heritage Ayurveda and Integrated Rehabilitation',
    phone_primary TEXT NOT NULL DEFAULT '+91 94473 60670',
    phone_secondary TEXT DEFAULT '+91 90204 69647',
    whatsapp_number TEXT NOT NULL DEFAULT '+91 94473 60670',
    email TEXT NOT NULL DEFAULT 'info@khair.in',
    address_line TEXT NOT NULL DEFAULT 'Kondotty / Kottakkal, Malappuram, Kerala, India',
    location_details TEXT DEFAULT 'Close to Calicut International Airport',
    google_maps_url TEXT DEFAULT 'https://maps.google.com/?q=Kottakkal+Malappuram+Kerala',
    default_locale TEXT NOT NULL DEFAULT 'en',
    enabled_locales TEXT[] NOT NULL DEFAULT ARRAY['en', 'hi', 'ar'],
    logo_url TEXT DEFAULT '/images/branding/khair-logo-full.png',
    emblem_url TEXT DEFAULT '/images/branding/khair-emblem.png',
    favicon_url TEXT DEFAULT '/favicon.ico',
    footer_text TEXT DEFAULT '© 2026 KHAIR Healthcare Centre. All Rights Reserved.',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 6. PAGES TABLE
CREATE TABLE IF NOT EXISTS public.pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 7. PAGE TRANSLATIONS TABLE
CREATE TABLE IF NOT EXISTS public.page_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
    locale TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    content JSONB DEFAULT '{}'::jsonb,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    CONSTRAINT unique_page_locale UNIQUE (page_id, locale)
);

-- 8. HOMEPAGE SECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.homepage_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_key TEXT NOT NULL UNIQUE,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    image_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 9. HOMEPAGE SECTION TRANSLATIONS TABLE
CREATE TABLE IF NOT EXISTS public.homepage_section_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id UUID NOT NULL REFERENCES public.homepage_sections(id) ON DELETE CASCADE,
    locale TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    cta_label TEXT,
    cta_link TEXT,
    content JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    CONSTRAINT unique_section_locale UNIQUE (section_id, locale)
);

-- 10. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL DEFAULT 'Activity',
    featured_image TEXT,
    gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 11. DEPARTMENT TRANSLATIONS TABLE
CREATE TABLE IF NOT EXISTS public.department_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    locale TEXT NOT NULL,
    name TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    treatments JSONB DEFAULT '[]'::jsonb,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    CONSTRAINT unique_department_locale UNIQUE (department_id, locale)
);

-- 12. DOCTORS TABLE
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    photo_url TEXT,
    experience_years INT NOT NULL DEFAULT 5,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 13. DOCTOR TRANSLATIONS TABLE
CREATE TABLE IF NOT EXISTS public.doctor_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    locale TEXT NOT NULL,
    name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    qualifications TEXT NOT NULL,
    biography TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    CONSTRAINT unique_doctor_locale UNIQUE (doctor_id, locale)
);

-- 14. GALLERY CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.gallery_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 15. GALLERY CATEGORY TRANSLATIONS TABLE
CREATE TABLE IF NOT EXISTS public.gallery_category_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES public.gallery_categories(id) ON DELETE CASCADE,
    locale TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    CONSTRAINT unique_gallery_cat_locale UNIQUE (category_id, locale)
);

-- 16. GALLERY IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.gallery_categories(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    cloudinary_public_id TEXT,
    width INT,
    height INT,
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 17. GALLERY IMAGE TRANSLATIONS TABLE
CREATE TABLE IF NOT EXISTS public.gallery_image_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_id UUID NOT NULL REFERENCES public.gallery_images(id) ON DELETE CASCADE,
    locale TEXT NOT NULL,
    title TEXT NOT NULL,
    caption TEXT,
    alt_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    CONSTRAINT unique_gallery_img_locale UNIQUE (image_id, locale)
);

-- 18. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_no TEXT NOT NULL UNIQUE,
    patient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    preferred_date DATE NOT NULL,
    preferred_time TEXT,
    message TEXT,
    status appointment_status NOT NULL DEFAULT 'New',
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 19. APPOINTMENT NOTES TABLE
CREATE TABLE IF NOT EXISTS public.appointment_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 20. CONTACT SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status submission_status NOT NULL DEFAULT 'New',
    internal_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 21. MEDIA ASSETS TABLE (Cloudinary tracked)
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    public_id TEXT NOT NULL UNIQUE,
    secure_url TEXT NOT NULL,
    format TEXT,
    bytes BIGINT,
    width INT,
    height INT,
    folder TEXT NOT NULL DEFAULT 'khair',
    alt_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 22. NAVIGATION ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.navigation_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    parent_id UUID REFERENCES public.navigation_items(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 23. NAVIGATION TRANSLATIONS TABLE
CREATE TABLE IF NOT EXISTS public.navigation_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    navigation_id UUID NOT NULL REFERENCES public.navigation_items(id) ON DELETE CASCADE,
    locale TEXT NOT NULL,
    label TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    CONSTRAINT unique_nav_locale UNIQUE (navigation_id, locale)
);

-- 24. SEO METADATA TABLE
CREATE TABLE IF NOT EXISTS public.seo_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_path TEXT NOT NULL,
    locale TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    og_title TEXT,
    og_description TEXT,
    og_image TEXT,
    canonical_url TEXT,
    robots TEXT DEFAULT 'index, follow',
    json_ld JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    CONSTRAINT unique_route_locale UNIQUE (route_path, locale)
);

-- 25. SOCIAL LINKS TABLE
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL,
    icon TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 26. ADMIN ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ============================================================================
-- INDEXES FOR MAXIMUM QUERY EFFICIENCY
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);
CREATE INDEX IF NOT EXISTS idx_departments_slug ON public.departments(slug);
CREATE INDEX IF NOT EXISTS idx_departments_order ON public.departments(sort_order);
CREATE INDEX IF NOT EXISTS idx_doctors_slug ON public.doctors(slug);
CREATE INDEX IF NOT EXISTS idx_doctors_dept ON public.doctors(department_id);
CREATE INDEX IF NOT EXISTS idx_gallery_images_cat ON public.gallery_images(category_id);
CREATE INDEX IF NOT EXISTS idx_appointments_ref ON public.appointments(reference_no);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(preferred_date);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_seo_route_locale ON public.seo_metadata(route_path, locale);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON public.admin_activity_logs(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_section_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_image_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper security functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role IN ('SUPER_ADMIN', 'ADMIN')
    ) OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ADMIN')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'SUPER_ADMIN'
    ) OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_editor_or_above()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR')
    ) OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public Read Policies (Published Content Only)
CREATE POLICY "Public read published pages" ON public.pages FOR SELECT USING (is_published = true OR public.is_editor_or_above());
CREATE POLICY "Public read page_translations" ON public.page_translations FOR SELECT USING (true);

CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public read published homepage_sections" ON public.homepage_sections FOR SELECT USING (is_visible = true OR public.is_editor_or_above());
CREATE POLICY "Public read homepage_section_translations" ON public.homepage_section_translations FOR SELECT USING (true);

CREATE POLICY "Public read published departments" ON public.departments FOR SELECT USING (is_published = true OR public.is_editor_or_above());
CREATE POLICY "Public read department_translations" ON public.department_translations FOR SELECT USING (true);

CREATE POLICY "Public read published doctors" ON public.doctors FOR SELECT USING (is_published = true OR public.is_editor_or_above());
CREATE POLICY "Public read doctor_translations" ON public.doctor_translations FOR SELECT USING (true);

CREATE POLICY "Public read gallery_categories" ON public.gallery_categories FOR SELECT USING (true);
CREATE POLICY "Public read gallery_category_translations" ON public.gallery_category_translations FOR SELECT USING (true);

CREATE POLICY "Public read published gallery_images" ON public.gallery_images FOR SELECT USING (is_published = true OR public.is_editor_or_above());
CREATE POLICY "Public read gallery_image_translations" ON public.gallery_image_translations FOR SELECT USING (true);

CREATE POLICY "Public read navigation_items" ON public.navigation_items FOR SELECT USING (is_published = true OR public.is_editor_or_above());
CREATE POLICY "Public read navigation_translations" ON public.navigation_translations FOR SELECT USING (true);

CREATE POLICY "Public read seo_metadata" ON public.seo_metadata FOR SELECT USING (true);
CREATE POLICY "Public read social_links" ON public.social_links FOR SELECT USING (is_active = true OR public.is_editor_or_above());

-- Public Insert Policies for Appointments and Enquiries
CREATE POLICY "Public insert appointments" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert contact_submissions" ON public.contact_submissions FOR INSERT WITH CHECK (true);

-- Admin CRUD Policies
CREATE POLICY "Admin manage site_settings" ON public.site_settings FOR ALL USING (public.is_admin());
CREATE POLICY "Admin manage pages" ON public.pages FOR ALL USING (public.is_editor_or_above());
CREATE POLICY "Admin manage page_translations" ON public.page_translations FOR ALL USING (public.is_editor_or_above());
CREATE POLICY "Admin manage homepage_sections" ON public.homepage_sections FOR ALL USING (public.is_editor_or_above());
CREATE POLICY "Admin manage homepage_section_translations" ON public.homepage_section_translations FOR ALL USING (public.is_editor_or_above());
CREATE POLICY "Admin manage departments" ON public.departments FOR ALL USING (public.is_editor_or_above());
CREATE POLICY "Admin manage department_translations" ON public.department_translations FOR ALL USING (public.is_editor_or_above());
CREATE POLICY "Admin manage doctors" ON public.doctors FOR ALL USING (public.is_editor_or_above());
CREATE POLICY "Admin manage doctor_translations" ON public.doctor_translations FOR ALL USING (public.is_editor_or_above());
CREATE POLICY "Admin manage gallery_categories" ON public.gallery_categories FOR ALL USING (public.is_editor_or_above());
CREATE POLICY "Admin manage gallery_category_translations" ON public.gallery_category_translations FOR ALL USING (public.is_editor_or_above());
CREATE POLICY "Admin manage gallery_images" ON public.gallery_images FOR ALL USING (public.is_editor_or_above());
CREATE POLICY "Admin manage gallery_image_translations" ON public.gallery_image_translations FOR ALL USING (public.is_editor_or_above());
CREATE POLICY "Admin manage navigation" ON public.navigation_items FOR ALL USING (public.is_editor_or_above());
CREATE POLICY "Admin manage navigation_translations" ON public.navigation_translations FOR ALL USING (public.is_editor_or_above());
CREATE POLICY "Admin manage seo_metadata" ON public.seo_metadata FOR ALL USING (public.is_editor_or_above());
CREATE POLICY "Admin manage social_links" ON public.social_links FOR ALL USING (public.is_editor_or_above());
CREATE POLICY "Admin manage media_assets" ON public.media_assets FOR ALL USING (public.is_editor_or_above());

-- Restricted Admin Only Policies
CREATE POLICY "Staff read & manage appointments" ON public.appointments FOR ALL USING (public.is_editor_or_above());
CREATE POLICY "Staff read & manage appointment_notes" ON public.appointment_notes FOR ALL USING (public.is_editor_or_above());
CREATE POLICY "Staff read & manage contact_submissions" ON public.contact_submissions FOR ALL USING (public.is_editor_or_above());
CREATE POLICY "Admin read activity logs" ON public.admin_activity_logs FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin insert activity logs" ON public.admin_activity_logs FOR INSERT WITH CHECK (true);

-- User Profiles & Roles Policies
CREATE POLICY "User can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Super admin can manage profiles" ON public.profiles FOR ALL USING (public.is_super_admin());
CREATE POLICY "Super admin can manage user_roles" ON public.user_roles FOR ALL USING (public.is_super_admin());
CREATE POLICY "User can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

-- Auto Sync New Auth Users Trigger Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        'EDITOR'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================================
-- SEED DATA (VERIFIED CONTENT FROM KHAIR OFFICIAL SOURCE MATERIAL)
-- ============================================================================

-- 1. SITE SETTINGS
INSERT INTO public.site_settings (
    id, site_name, tagline, sub_tagline, phone_primary, phone_secondary, whatsapp_number, email, address_line, location_details, google_maps_url, default_locale, enabled_locales, logo_url, emblem_url, footer_text
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'KHAIR International',
    'Your Journey Back to Wellbeing',
    'Kottakkal Heritage Ayurveda and Integrated Rehabilitation',
    '+91 94473 60670',
    '+91 90204 69647',
    '+91 94473 60670',
    'info@khair.in',
    'Kondotty / Kottakkal, Malappuram, Kerala, India',
    'Close to Calicut International Airport — Accessible by all means of transport with a calm and quiet environment for recovery and rest.',
    'https://maps.google.com/?q=Kottakkal+Malappuram+Kerala',
    'en',
    ARRAY['en', 'hi', 'ar'],
    '/images/branding/khair-logo-full.png',
    '/images/branding/khair-emblem.png',
    '© 2026 KHAIR Healthcare Centre. All Rights Reserved.'
) ON CONFLICT (id) DO UPDATE SET
    site_name = EXCLUDED.site_name,
    tagline = EXCLUDED.tagline,
    sub_tagline = EXCLUDED.sub_tagline,
    phone_primary = EXCLUDED.phone_primary,
    phone_secondary = EXCLUDED.phone_secondary,
    whatsapp_number = EXCLUDED.whatsapp_number,
    email = EXCLUDED.email,
    address_line = EXCLUDED.address_line,
    location_details = EXCLUDED.location_details;

-- 2. SOCIAL LINKS
INSERT INTO public.social_links (platform, url, icon, sort_order, is_active) VALUES
('instagram', 'https://instagram.com/khairinternational', 'Instagram', 1, true),
('facebook', 'https://facebook.com/khairinternational', 'Facebook', 2, true),
('youtube', 'https://youtube.com/@khairinternational', 'Youtube', 3, true),
('linkedin', 'https://linkedin.com/company/khairinternational', 'Linkedin', 4, true)
ON CONFLICT (platform) DO UPDATE SET url = EXCLUDED.url;

-- 3. NAVIGATION ITEMS & TRANSLATIONS
INSERT INTO public.navigation_items (id, path, sort_order, is_published) VALUES
('10000000-0000-0000-0000-000000000001', '/', 1, true),
('10000000-0000-0000-0000-000000000002', '/about', 2, true),
('10000000-0000-0000-0000-000000000003', '/departments', 3, true),
('10000000-0000-0000-0000-000000000004', '/doctors', 4, true),
('10000000-0000-0000-0000-000000000005', '/gallery', 5, true),
('10000000-0000-0000-0000-000000000006', '/contact', 6, true)
ON CONFLICT (id) DO UPDATE SET path = EXCLUDED.path, sort_order = EXCLUDED.sort_order;

INSERT INTO public.navigation_translations (navigation_id, locale, label) VALUES
('10000000-0000-0000-0000-000000000001', 'en', 'Home'),
('10000000-0000-0000-0000-000000000001', 'hi', 'होम'),
('10000000-0000-0000-0000-000000000001', 'ar', 'الرئيسية'),

('10000000-0000-0000-0000-000000000002', 'en', 'About Us'),
('10000000-0000-0000-0000-000000000002', 'hi', 'हमारे बारे में'),
('10000000-0000-0000-0000-000000000002', 'ar', 'من نحن'),

('10000000-0000-0000-0000-000000000003', 'en', 'Departments'),
('10000000-0000-0000-0000-000000000003', 'hi', 'विभाग'),
('10000000-0000-0000-0000-000000000003', 'ar', 'الأقسام الطبية'),

('10000000-0000-0000-0000-000000000004', 'en', 'Doctors'),
('10000000-0000-0000-0000-000000000004', 'hi', 'चिकित्सक'),
('10000000-0000-0000-0000-000000000004', 'ar', 'الأطباء'),

('10000000-0000-0000-0000-000000000005', 'en', 'Gallery'),
('10000000-0000-0000-0000-000000000005', 'hi', 'गैलरी'),
('10000000-0000-0000-0000-000000000005', 'ar', 'معرض الصور'),

('10000000-0000-0000-0000-000000000006', 'en', 'Contact'),
('10000000-0000-0000-0000-000000000006', 'hi', 'संपर्क'),
('10000000-0000-0000-0000-000000000006', 'ar', 'اتصل بنا')
ON CONFLICT (navigation_id, locale) DO UPDATE SET label = EXCLUDED.label;

-- 4. HOMEPAGE SECTIONS
INSERT INTO public.homepage_sections (id, section_key, is_visible, sort_order, image_url, metadata) VALUES
('20000000-0000-0000-0000-000000000001', 'hero', true, 1, '/images/hero/hero-ayurveda-still-life.jpg', '{"label": "INTEGRATIVE HEALTHCARE"}'::jsonb),
('20000000-0000-0000-0000-000000000002', 'highlights_bar', true, 2, NULL, '{"badges": ["Modern design", "Key services & departments", "Featured doctors", "Gallery preview", "WhatsApp & contact CTA"]}'::jsonb),
('20000000-0000-0000-0000-000000000003', 'departments', true, 3, NULL, '{"badge": "OUR DEPARTMENTS"}'::jsonb),
('20000000-0000-0000-0000-000000000004', 'why_choose', true, 4, NULL, '{"badge": "WHY CHOOSE KHAIR?"}'::jsonb),
('20000000-0000-0000-0000-000000000005', 'doctors', true, 5, NULL, '{"badge": "OUR DOCTORS"}'::jsonb),
('20000000-0000-0000-0000-000000000006', 'gallery_preview', true, 6, NULL, '{"badge": "GALLERY PREVIEW"}'::jsonb),
('20000000-0000-0000-0000-000000000007', 'appointment_cta', true, 7, NULL, '{"badge": "START YOUR HEALING JOURNEY"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET section_key = EXCLUDED.section_key, sort_order = EXCLUDED.sort_order, image_url = EXCLUDED.image_url;

-- Homepage Section Translations
-- English
INSERT INTO public.homepage_section_translations (section_id, locale, title, subtitle, description, cta_label, cta_link, content) VALUES
('20000000-0000-0000-0000-000000000001', 'en', 'Your Journey Back to Wellbeing', 'INTEGRATIVE HEALTHCARE', 'A modern centre for Ayurveda, Physiotherapy and Holistic Rehabilitation — where traditional wisdom meets modern science for complete and lasting care.', 'Book Appointment', '/contact#book-appointment', '{"secondary_cta_label": "Our Services", "secondary_cta_link": "/departments"}'::jsonb),
('20000000-0000-0000-0000-000000000003', 'en', 'Comprehensive Care for Your Complete Wellbeing', 'OUR DEPARTMENTS', 'Explore our specialized clinical departments combining Kottakkal heritage Ayurvedic treatments with evidence-based modern physical rehabilitation.', 'View All Departments', '/departments', '{}'::jsonb),
('20000000-0000-0000-0000-000000000004', 'en', 'Care You Can Trust', 'WHY CHOOSE KHAIR?', 'Rooted in timeless heritage, delivered with cutting-edge medical precision and heartfelt compassion.', NULL, NULL, '[
    {"title": "Integrated Care", "desc": "Ayurveda & modern rehabilitation together", "icon": "ShieldCheck"},
    {"title": "Expert Team", "desc": "Experienced and compassionate specialists", "icon": "Users"},
    {"title": "Personalized Treatment", "desc": "Care plans tailored to your unique needs", "icon": "HeartHandshake"},
    {"title": "Healing Environment", "desc": "A calm, natural and patient-friendly centre", "icon": "Building2"}
]'::jsonb),
('20000000-0000-0000-0000-000000000005', 'en', 'Meet Our Experts', 'OUR DOCTORS', 'Our senior physicians and rehabilitation consultants are committed to your comprehensive recovery.', 'View All Doctors', '/doctors', '{}'::jsonb),
('20000000-0000-0000-0000-000000000006', 'en', 'A Glimpse of Our Centre', 'GALLERY PREVIEW', 'Explore our facilities, treatments and the care experience at KHAIR.', 'View Full Gallery', '/gallery', '{}'::jsonb),
('20000000-0000-0000-0000-000000000007', 'en', 'Book a Consultation Today', 'START YOUR HEALING JOURNEY', 'Take the first step towards healing, recovery and lasting wellbeing with an evaluation by our physicians and rehabilitation team.', 'Book Appointment', '/contact#book-appointment', '{"whatsapp_label": "Chat on WhatsApp"}'::jsonb)
ON CONFLICT (section_id, locale) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description, cta_label = EXCLUDED.cta_label, cta_link = EXCLUDED.cta_link, content = EXCLUDED.content;

-- Hindi Translations
INSERT INTO public.homepage_section_translations (section_id, locale, title, subtitle, description, cta_label, cta_link, content) VALUES
('20000000-0000-0000-0000-000000000001', 'hi', 'आरोग्य की ओर आपकी यात्रा', 'समग्र स्वास्थ्य देखभाल', 'आयुर्वेद, फिजियोथेरेपी और समग्र पुनर्वास का एक आधुनिक केंद्र — जहां पारंपरिक ज्ञान और आधुनिक विज्ञान का संपूर्ण स्वास्थ्य के लिए मिलन होता है।', 'अपॉइंटमेंट बुक करें', '/contact#book-appointment', '{"secondary_cta_label": "हमारी सेवाएं", "secondary_cta_link": "/departments"}'::jsonb),
('20000000-0000-0000-0000-000000000003', 'hi', 'आपके संपूर्ण स्वास्थ्य के लिए व्यापक देखभाल', 'हमारे विभाग', 'कोट्टाक्कल विरासत आयुर्वेद और आधुनिक शारीरिक पुनर्वास के सामंजस्य से युक्त हमारे विशिष्ट विभाग।', 'सभी विभाग देखें', '/departments', '{}'::jsonb),
('20000000-0000-0000-0000-000000000004', 'hi', 'विश्वासपूर्ण देखभाल, विरासत से जुड़ी', 'खैर क्यों चुनें?', 'समय-सिद्ध विरासत और आधुनिक चिकित्सीय विशेषज्ञता के साथ संवेदनशील देखभाल।', NULL, NULL, '[
    {"title": "एकीकृत देखभाल", "desc": "आयुर्वेद और आधुनिक पुनर्वास एक साथ", "icon": "ShieldCheck"},
    {"title": "विशेषज्ञ टीम", "desc": "अनुभवी और संवेदनशील विशेषज्ञ चिकित्सक", "icon": "Users"},
    {"title": "व्यक्तिगत उपचार", "desc": "आपकी आवश्यकताओं के अनुसार तैयार योजनाएं", "icon": "HeartHandshake"},
    {"title": "उपचारात्मक वातावरण", "desc": "शांत, प्राकृतिक और मरीज-अनुकूल केंद्र", "icon": "Building2"}
]'::jsonb),
('20000000-0000-0000-0000-000000000005', 'hi', 'हमारे विशेषज्ञों से मिलें', 'हमारे चिकित्सक', 'हमारे वरिष्ठ चिकित्सक और पुनर्वास सलाहकार आपकी पूर्ण रिकवरी के लिए समर्पित हैं।', 'सभी चिकित्सक देखें', '/doctors', '{}'::jsonb),
('20000000-0000-0000-0000-000000000006', 'hi', 'हमारे केंद्र की एक झलक', 'गैलरी पूर्वावलोकन', 'खैर में हमारी आधुनिक सुविधाओं, उपचारों और उपचारात्मक वातावरण का अनुभव करें।', 'पूरी गैलरी देखें', '/gallery', '{}'::jsonb),
('20000000-0000-0000-0000-000000000007', 'hi', 'आज ही परामर्श बुक करें', 'अपनी उपचारात्मक यात्रा शुरू करें', 'हमारे चिकित्सकों और पुनर्वास टीम द्वारा संपूर्ण मूल्यांकन के साथ आरोग्य की ओर पहला कदम बढ़ाएं।', 'अपॉइंटमेंट बुक करें', '/contact#book-appointment', '{"whatsapp_label": "व्हाट्सएप पर संपर्क करें"}'::jsonb)
ON CONFLICT (section_id, locale) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description, cta_label = EXCLUDED.cta_label, cta_link = EXCLUDED.cta_link, content = EXCLUDED.content;

-- Arabic Translations
INSERT INTO public.homepage_section_translations (section_id, locale, title, subtitle, description, cta_label, cta_link, content) VALUES
('20000000-0000-0000-0000-000000000001', 'ar', 'رحلتك نحو العافية والشفاء', 'رعاية صحية تكاملية', 'مركز طبي متكامل للعلاج بالأيورفيدا، والعلاج الطبيعي، وإعادة التأهيل الشامل — حيث تلتقي حكمة التراث مع دقة العلم الحديث لرعاية دائمة.', 'احجز موعد استشارة', '/contact#book-appointment', '{"secondary_cta_label": "أقسامنا وخدماتنا", "secondary_cta_link": "/departments"}'::jsonb),
('20000000-0000-0000-0000-000000000003', 'ar', 'رعاية شاملة لصحتك وعافيتك الكاملة', 'أقسامنا الطبية', 'استكشف أقسامنا السريرية المتخصصة التي تجمع بين عراقة أيورفيدا كوتاكال وأحدث تقنيات إعادة التأهيل البدني.', 'عرض جميع الأقسام', '/departments', '{}'::jsonb),
('20000000-0000-0000-0000-000000000004', 'ar', 'رعاية يمكنك الوثوق بها', 'لماذا تختار خير؟', 'رعاية متجذرة في التراث العريق، مقدمة بأعلى معايير الدقة الطبية والاهتمام الإنساني.', NULL, NULL, '[
    {"title": "رعاية متكاملة", "desc": "الأيورفيدا وإعادة التأهيل الحديث معاً", "icon": "ShieldCheck"},
    {"title": "فريق من الخبراء", "desc": "نخبة من الاستشاريين والأطباء المتميزين", "icon": "Users"},
    {"title": "علاج مخصص لكل حالة", "desc": "خطط علاجية مصممة خصيصاً لتناسب احتياجاتك", "icon": "HeartHandshake"},
    {"title": "بيئة استشفائية هادئة", "desc": "مركز هادئ وطبيعي مهيأ تماماً لراحة المريض", "icon": "Building2"}
]'::jsonb),
('20000000-0000-0000-0000-000000000005', 'ar', 'تعرّف على خبرائنا وأطبائنا', 'أطباؤنا', 'يلتزم كبار أطبائنا واستشاريي إعادة التأهيل بتقديم رعاية دقيقة لتحقيق التعافي الشامل.', 'عرض جميع الأطباء', '/doctors', '{}'::jsonb),
('20000000-0000-0000-0000-000000000006', 'ar', 'لمحة من مركزنا ومرافقه', 'معرض الصور', 'اكتشف مرافقنا الطبية المتطورة، وجلسات العلاج الطبيعي، والبيئة الهادئة في مركز خير.', 'زيارة المعرض كاملاً', '/gallery', '{}'::jsonb),
('20000000-0000-0000-0000-000000000007', 'ar', 'احجز استشارتك الطبية اليوم', 'ابدأ رحلة التعافي', 'اتخذ الخطوة الأولى نحو الشفاء واستعادة الحركة من خلال تقييم شامل من قبل فريقنا الطبي.', 'احجز موعد استشارة', '/contact#book-appointment', '{"whatsapp_label": "تواصل عبر واتساب"}'::jsonb)
ON CONFLICT (section_id, locale) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description, cta_label = EXCLUDED.cta_label, cta_link = EXCLUDED.cta_link, content = EXCLUDED.content;

-- 5. DEPARTMENTS & TRANSLATIONS
INSERT INTO public.departments (id, slug, icon, featured_image, sort_order, is_published) VALUES
('30000000-0000-0000-0000-000000000001', 'ayurveda-treatments', 'Leaf', '/images/departments/ayurveda-herbs.jpg', 1, true),
('30000000-0000-0000-0000-000000000002', 'physiotherapy-rehabilitation', 'Activity', '/images/departments/physiotherapy.jpg', 2, true),
('30000000-0000-0000-0000-000000000003', 'naturopathy-yoga', 'Flower2', '/images/gallery/yoga-meditation.jpg', 3, true),
('30000000-0000-0000-0000-000000000004', 'lifestyle-clinic', 'Heart', '/images/gallery/facility-reception.jpg', 4, true),
('30000000-0000-0000-0000-000000000005', 'advanced-ano-rectal-clinic', 'Stethoscope', '/images/departments/ano-rectal-ot.jpg', 5, true),
('30000000-0000-0000-0000-000000000006', 'occupational-therapy', 'HandHelping', '/images/gallery/treatment-room.jpg', 6, true)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, icon = EXCLUDED.icon, featured_image = EXCLUDED.featured_image, sort_order = EXCLUDED.sort_order;

-- Department Translations: English
INSERT INTO public.department_translations (department_id, locale, name, short_description, full_description, treatments, meta_title, meta_description) VALUES
('30000000-0000-0000-0000-000000000001', 'en', 'Ayurveda Treatments', 'Traditional and authentic Ayurvedic care for long-term healing.', 'Time-honoured therapies rooted in the Kottakkal heritage, delivered by trained Ayurveda physicians and therapists. Our comprehensive Ayurvedic treatments include panchakarma detoxification, rejuvenative therapies, spinal care, and tailored herbal protocols for chronic conditions.', '["Panchakarma Detoxification", "Shirodhara & Herbal Oil Therapies", "Kizhi Poultice Massages", "Spinal & Joint Alignment Therapies", "Rejuvenative Rasayana Programmes"]'::jsonb, 'Ayurveda Treatments | KHAIR International', 'Authentic Kottakkal heritage Ayurvedic treatments and panchakarma therapies.'),

('30000000-0000-0000-0000-000000000002', 'en', 'Physiotherapy & Rehabilitation', 'Evidence-based therapy for recovery, mobility and strength.', 'Structured, goal-oriented programmes designed to restore movement, improve functional mobility, and rebuild strength. Specialised care protocols are available for post-stroke rehabilitation, musculoskeletal trauma, joint replacements, and neurological recovery.', '["Neuro-Rehabilitation & Stroke Care", "Orthopaedic & Musculoskeletal Physio", "Post-Surgical Joint Rehabilitation", "Balance & Gait Retraining", "Pain Management Electrotherapy"]'::jsonb, 'Physiotherapy & Rehabilitation | KHAIR International', 'Evidence-based neuro and orthopedic physiotherapy for mobility, balance, and recovery.'),

('30000000-0000-0000-0000-000000000003', 'en', 'Naturopathy & Yoga', 'Natural therapies and yoga for balance of body, mind and lifestyle.', 'Natural healing modalities and guided therapeutic yoga practices designed to support metabolic equilibrium, deep relaxation, nervous system restoration, and long-term vitality.', '["Therapeutic Yoga Sessions", "Pranayama & Breathwork Protocols", "Hydrotherapy & Mud Packs", "Dietary Cleansing & Fasting Therapy", "Mindfulness Stress Reduction"]'::jsonb, 'Naturopathy & Yoga | KHAIR International', 'Holistic naturopathy, guided therapeutic yoga and natural stress relief therapies.'),

('30000000-0000-0000-0000-000000000004', 'en', 'Lifestyle Clinic', 'Preventive care and lifestyle modification for lasting wellness.', 'Personalised physician guidance on diet, circadian routines, exercise, and habits for preventing chronic diseases and establishing sustainable vitality. Comprehensive support for diabetes management and weight reduction.', '["Ayurvedic Diabetes Management Protocols", "Sustainable Weight Reduction Programmes", "Cardiovascular & Metabolic Health Screening", "Nutritional & Dietary Counselling", "Sleep Hygiene Optimization"]'::jsonb, 'Lifestyle Clinic | KHAIR International', 'Preventive lifestyle medicine, diabetes care, and weight reduction programmes.'),

('30000000-0000-0000-0000-000000000005', 'en', 'Advanced Ano Rectal Clinic', 'Specialized, comfortable and advanced care for ano-rectal conditions.', 'Specialised, dignified care for piles, fistula, fissures, and related ano-rectal conditions, supported by a dedicated modern mini operation theatre and time-tested Ksharasutra protocols.', '["Ksharasutra Specialized Therapy", "Piles & Hemorrhoids Minimally Invasive Care", "Anal Fistula & Fissure Treatments", "Modern Mini OT Procedures", "Comprehensive Post-Procedure Healing Care"]'::jsonb, 'Advanced Ano Rectal Clinic | KHAIR International', 'Dignified, advanced care for piles, fistula and fissures with dedicated mini OT.'),

('30000000-0000-0000-0000-000000000006', 'en', 'Occupational Therapy', 'Helps patients regain independence in everyday activities at home and work.', 'Focused therapeutic interventions to assist individuals recovering from injury, stroke, or developmental conditions in mastering daily living skills, enhancing fine motor coordination, and reclaiming autonomy.', '["Activities of Daily Living (ADL) Training", "Hand & Fine Motor Rehabilitation", "Sensory Integration Therapy", "Ergonomic & Workplace Adaptation", "Cognitive & Perceptual Retraining"]'::jsonb, 'Occupational Therapy | KHAIR International', 'Patient-centred occupational therapy for independence in daily living activities.')
ON CONFLICT (department_id, locale) DO UPDATE SET name = EXCLUDED.name, short_description = EXCLUDED.short_description, full_description = EXCLUDED.full_description, treatments = EXCLUDED.treatments;

-- Department Translations: Hindi
INSERT INTO public.department_translations (department_id, locale, name, short_description, full_description, treatments, meta_title, meta_description) VALUES
('30000000-0000-0000-0000-000000000001', 'hi', 'आयुर्वेद उपचार', 'दीर्घकालिक आरोग्य के लिए पारंपरिक और प्रामाणिक आयुर्वेदिक देखभाल।', 'कोट्टाक्कल विरासत में निहित समय-परीक्षित चिकित्सा, जिसे प्रशिक्षित आयुर्वेद चिकित्सकों और थेरेपिस्टों द्वारा प्रदान किया जाता है। इसमें पंचकर्म विषहरण, रीढ़ और जोड़ों की देखभाल शामिल है।', '["पंचकर्म विषहरण चिकित्सा", "शिरोधारा और औषधीय तैल उपचार", "किषि पोटली मालिश", "रीढ़ और जोड़ों के उपचार", "पुनर्योवन रसायन कार्यक्रम"]'::jsonb, 'आयुर्वेद उपचार | खैर इंटरनेशनल', 'कोट्टाक्कल विरासत के प्रामाणिक आयुर्वेदिक उपचार और पंचकर्म चिकित्सा।'),

('30000000-0000-0000-0000-000000000002', 'hi', 'फिजियोथेरेपी और पुनर्वास', 'पुनर्प्राप्ति, गतिशीलता और ताकत के लिए साक्ष्य-आधारित थेरेपी।', 'स्ट्रोक पुनर्वास, आर्थोपेडिक आघात, जोड़ों के प्रतिस्थापन और न्यूरोलॉजिकल रिकवरी के लिए वैज्ञानिक और लक्ष्य-उन्मुख पुनर्वास कार्यक्रम।', '["न्यूरो-पुनर्वास और स्ट्रोक देखभाल", "आर्थोपेडिक फिजियोथेरेपी", "सर्जरी के बाद का पुनर्वास", "संतुलन और चाल प्रशिक्षण", "दर्द निवारण इलेक्ट्रोथेरेपी"]'::jsonb, 'फिजियोथेरेपी और पुनर्वास | खैर इंटरनेशनल', 'गतिशीलता और संतुलन के लिए साक्ष्य-आधारित फिजियोथेरेपी सेवाएं।'),

('30000000-0000-0000-0000-000000000003', 'hi', 'प्राकृतिक चिकित्सा और योग', 'शरीर, मन और जीवनशैली के संतुलन के लिए प्राकृतिक उपचार और योग।', 'प्राकृतिक चिकित्सा और निर्देशित उपचारात्मक योग अभ्यास जो चयापचय संतुलन, गहन विश्राम और तंत्रिका तंत्र के संतुलन को बढ़ावा देते हैं।', '["उपचारात्मक योग सत्र", "प्राणायाम एवं श्वसन अभ्यास", "जल चिकित्सा एवं मड बाथ", "आहार शुद्धि चिकित्सा", "तनाव प्रबंधन तकनीक"]'::jsonb, 'प्राकृतिक चिकित्सा और योग | खैर इंटरनेशनल', 'प्राकृतिक उपचार और निर्देशित योग सत्र।'),

('30000000-0000-0000-0000-000000000004', 'hi', 'लाइफस्टाइल क्लिनिक', 'स्थायी स्वास्थ्य के लिए निवारक देखभाल और जीवनशैली में बदलाव।', 'मधुमेह प्रबंधन और वजन नियंत्रण के लिए आहार, दैनिक दिनचर्या और आदतों पर व्यक्तिगत विशेषज्ञ मार्गदर्शन।', '["आयुर्वेदिक मधुमेह प्रबंधन", "वजन घटाने के वैज्ञानिक कार्यक्रम", "चयापचय स्वास्थ्य जांच", "पोषण परामर्श", "नींद सुधार मार्गदर्शन"]'::jsonb, 'लाइफस्टाइल क्लिनिक | खैर इंटरनेशनल', 'निवारक जीवनशैली चिकित्सा और मधुमेह देखभाल।'),

('30000000-0000-0000-0000-000000000005', 'hi', 'उन्नत एनो-रेक्टल क्लिनिक', 'बवासीर और भगंदर के लिए विशिष्ट, आरामदायक और उन्नत देखभाल।', 'बवासीर, भगंदर और फिशर के लिए समर्पित मिनी ऑपरेशन थिएटर और क्षारसूत्र चिकित्सा के साथ उन्नत उपचार।', '["क्षारसूत्र विशेष चिकित्सा", "बवासीर का उन्नत उपचार", "भगंदर और फिशर देखभाल", "आधुनिक मिनी ओटी प्रक्रियाएं", "प्रक्रिया पश्चात देखभाल"]'::jsonb, 'उन्नत एनो-रेक्टल क्लिनिक | खैर इंटरनेशनल', 'बवासीर और भगंदर के लिए समर्पित उन्नत एनो-रेक्टल उपचार।'),

('30000000-0000-0000-0000-000000000006', 'hi', 'ऑक्यूपेशनल थेरेपी', 'मरीजों को घर और काम पर दैनिक गतिविधियों में स्वतंत्रता पाने में मदद करती है।', 'चोट या स्ट्रोक के बाद दैनिक जीवन कौशल को फिर से सीखने और स्वायत्तता प्राप्त करने के लिए केंद्रित उपचारात्मक सहायता।', '["दैनिक जीवन कौशल प्रशिक्षण", "हाथ एवं मोटर पुनर्वास", "संवेदी एकीकरण थेरेपी", "कार्यस्थल अनुकूलन", "संज्ञानात्मक पुनर्प्रशिक्षण"]'::jsonb, 'ऑक्यूपेशनल थेरेपी | खैर इंटरनेशनल', 'दैनिक गतिविधियों में स्वतंत्रता के लिए ऑक्यूपेशनल थेरेपी।')
ON CONFLICT (department_id, locale) DO UPDATE SET name = EXCLUDED.name, short_description = EXCLUDED.short_description, full_description = EXCLUDED.full_description, treatments = EXCLUDED.treatments;

-- Department Translations: Arabic
INSERT INTO public.department_translations (department_id, locale, name, short_description, full_description, treatments, meta_title, meta_description) VALUES
('30000000-0000-0000-0000-000000000001', 'ar', 'علاجات الأيورفيدا الأصيلة', 'رعاية أيورفيدية تراثية أصيلة لتحقيق الشفاء المستدام والصحة العميقة.', 'جلسات علاجية تقليدية متجذرة في تراث كوتاكال العريق، يقدمها نخبة من أطباء الأيورفيدا والمعالجين المتخصصين. تشمل برامج بانشاكارما لتنقية الجسم، وعلاجات المفاصل والعمود الفقري، والزيوت العشبية المهدئة.', '["برامج بانشاكارما للتنقية الشاملة", "علاج شيرودهارا بالزيوت العشبية الدافئة", "مساج كيزي بالكمادات العشبية", "علاج آلام المفاصل والعمود الفقري", "برامج تجديد الحيوية والنشاط"]'::jsonb, 'علاجات الأيورفيدا | مركز خير الدولي', 'علاجات أيورفيدا كوتاكال الأصيلة وبرامج تنقية الجسم.'),

('30000000-0000-0000-0000-000000000002', 'ar', 'العلاج الطبيعي والتأهيل الطبي', 'علاج قائم على الأدلة العلمية لاستعادة الحركة والتوازن والقوة.', 'برامج تأهيلية منظمة وموجهة لإعادة تأهيل مرضى السكتات الدماغية، والإصابات العضلية الهيكلية، ومرحلة ما بعد جراحات العظام والمفاصل واستعادة التوازن الوظيفي.', '["إعادة التأهيل العصبي وعلاج الجلطات", "العلاج الطبيعي لإصابات العظام والمفاصل", "التأهيل الحركي بعد العمليات الجراحية", "تدريب المشي واستعادة التوازن", "العلاج بالتحفيز الكهربائي لتخفيف الآلام"]'::jsonb, 'العلاج الطبيعي والتأهيل | مركز خير الدولي', 'أحدث برامج العلاج الطبيعي والتأهيل العصبي والحركي.'),

('30000000-0000-0000-0000-000000000003', 'ar', 'العلاج الطبيعي (الناتوروباثي) واليوغا', 'علاجات طبيعية ويوغا علاجية متوازنة لراحة الجسد وصفاء الذهن.', 'وسائل استشفاء طبيعية وجلسات يوغا موجهة لاستعادة التوازن الهرموني، وتحفيز الاسترخاء العميق، وتخفيف التوتر العصبي وتجديد طاقة الجسم.', '["جلسات يوغا استشفائية بإشراف مختصين", "تمارين التنفس العميق والبراناياما", "العلاج المائي والكمادات الطبيعية", "برامج الديتوكس والحميات الغذائية المنقية", "تقنيات إدارة الضغوط والتوتر"]'::jsonb, 'الناتوروباثي واليوغا العلاجية | مركز خير الدولي', 'برامج الناتوروباثي وجلسات اليوغا الاستشفائية.'),

('30000000-0000-0000-0000-000000000004', 'ar', 'عيادة نمط الحياة الصحي', 'رعاية وقائية وتعديل نمط الحياة لتعزيز العافية المستدامة.', 'توجيه طبي وقائي مخصص للتحكم في مرض السكري، وإنقاص الوزن بأسلوب صحي مستدام، وتنظيم العادات الغذائية والنوم الصحي لتعزيز الحيوية والنشاط.', '["برامج ضبط السكري بالأساليب الطبيعية", "برامج إنقاص الوزن الصحية والمستدامة", "الفحص الأيضي والقلبي الشامل", "استشارات التغذية المتخصصة", "تنظيم جودة النوم والإيقاع الحيوي"]'::jsonb, 'عيادة نمط الحياة الصحي | مركز خير الدولي', 'برامج نمط الحياة الصحي وإدارة السكري والوزن.'),

('30000000-0000-0000-0000-000000000005', 'ar', 'العيادة المتقدمة لأمراض الشرج والمستقيم', 'رعاية طبية تخصصية متقدمة ومريحة لحالات البواسير والناسور.', 'عناية فائقة وتدخلات علاجية دقيقة لأمراض البواسير والناسور والشق الشرجي، بدعم من غرفة عمليات مصغرة مجهزة وأسلوب خشاراسوترا التراثي الآمن والمعتمد.', '["علاج كشاراسوترا المتخصص للناسور", "علاجات حديثة ومريحة للبواسير", "علاج الشق الشرجي بدون جراحة معقدة", "إجراءات غرف العمليات المصغرة", "متابعة طبية دقيقة للتعافي السريع"]'::jsonb, 'عيادة أمراض الشرج والمستقيم | مركز خير الدولي', 'رعاية تخصصية للبواسير والناسور مع غرفة عمليات مصغرة.'),

('30000000-0000-0000-0000-000000000006', 'ar', 'العلاج الوظيفي', 'تمكين المرضى من استعادة استقلاليتهم في الأنشطة اليومية والعمل.', 'جلسات علاجية مركزة لمساعدة المرضى بعد السكتات الدماغية أو الإصابات على إتقان مهارات الحياة اليومية وتنسيق حركة اليدين والعودة لممارسة الحياة باستقلالية.', '["تدريب مهارات الحياة اليومية المستقلة", "إعادة تأهيل حركة اليد والمهارات الدقيقة", "علاج التكامل الحسي", "مواءمة بيئة العمل والمنزل", "إعادة التأهيل المعرفي والإدراكي"]'::jsonb, 'العلاج الوظيفي | مركز خير الدولي', 'جلسات علاج وظيفي لاستعادة الاستقلالية في الحياة اليومية.')
ON CONFLICT (department_id, locale) DO UPDATE SET name = EXCLUDED.name, short_description = EXCLUDED.short_description, full_description = EXCLUDED.full_description, treatments = EXCLUDED.treatments;

-- 6. DOCTORS & TRANSLATIONS (From Approved Mockup)
INSERT INTO public.doctors (id, slug, photo_url, experience_years, department_id, sort_order, is_published) VALUES
('40000000-0000-0000-0000-000000000001', 'dr-ahmed-k', '/images/branding/khair-emblem.png', 10, '30000000-0000-0000-0000-000000000001', 1, true),
('40000000-0000-0000-0000-000000000002', 'dr-nisha-p', '/images/branding/khair-emblem.png', 8, '30000000-0000-0000-0000-000000000002', 2, true),
('40000000-0000-0000-0000-000000000003', 'dr-farhan-m', '/images/branding/khair-emblem.png', 12, '30000000-0000-0000-0000-000000000002', 3, true)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, experience_years = EXCLUDED.experience_years, sort_order = EXCLUDED.sort_order;

-- Doctor Translations
INSERT INTO public.doctor_translations (doctor_id, locale, name, specialization, qualifications, biography) VALUES
('40000000-0000-0000-0000-000000000001', 'en', 'Dr. Ahmed K.', 'Ayurveda Specialist', 'BAMS, MD (Ayurveda)', 'Senior Ayurveda Physician with over a decade of clinical excellence in classical panchakarma therapies, neuro-muscular conditions, and customized herbal rehabilitative programmes rooted in authentic Kottakkal tradition.'),
('40000000-0000-0000-0000-000000000001', 'hi', 'डॉ. अहमद के.', 'आयुर्वेद विशेषज्ञ', 'BAMS, MD (आयुर्वेद)', 'कोट्टाक्कल परंपरा के अनुसार शास्त्रीय पंचकर्म और न्यूरो-मस्कुलर विकारों के उपचार में 10 से अधिक वर्षों का नैदानिक अनुभव।'),
('40000000-0000-0000-0000-000000000001', 'ar', 'د. أحمد ك.', 'أخصائي طب الأيورفيدا', 'BAMS, MD (Ayurveda)', 'طبيب أيورفيدا أول يتمتع بخبرة تزيد عن 10 سنوات في العلاجات الكلاسيكية وبرامج إعادة التأهيل بالأعشاب المتجذرة في تراث كوتاكال الأصيل.'),

('40000000-0000-0000-0000-000000000002', 'en', 'Dr. Nisha P.', 'Physiotherapy Consultant', 'BPT, MPT (Neurology)', 'Specialised consultant in neuro-rehabilitation, stroke recovery, and vestibular retraining, with extensive experience tailoring physical therapies for holistic patient mobility.'),
('40000000-0000-0000-0000-000000000002', 'hi', 'डॉ. निशा पी.', 'फिजियोथेरेपी सलाहकार', 'BPT, MPT (न्यूरोलॉजी)', 'न्यूरो-पुनर्वास, स्ट्रोक रिकवरी और मोबिलिटी थेरेपी में 8 से अधिक वर्षों का विशेषज्ञ अनुभव।'),
('40000000-0000-0000-0000-000000000002', 'ar', 'د. نيشا ب.', 'استشارية العلاج الطبيعي', 'BPT, MPT (Neurology)', 'استشارية متخصصة في إعادة التأهيل العصبي وعلاج حالات الجلطات واستعادة التوازن الوظيفي والحركي.'),

('40000000-0000-0000-0000-000000000003', 'en', 'Dr. Farhan M.', 'Rehabilitation Specialist', 'MD (PMR)', 'Physical Medicine and Rehabilitation specialist leading multi-disciplinary rehabilitation teams for stroke management, post-operative care, and functional recovery.'),
('40000000-0000-0000-0000-000000000003', 'hi', 'डॉ. फरहान एम.', 'पुनर्वास विशेषज्ञ', 'MD (PMR)', 'स्ट्रोक प्रबंधन और जटिल शल्य-चिकित्सा पश्चात पुनर्वास में 12 से अधिक वर्षों का प्रतिष्ठित अनुभव।'),
('40000000-0000-0000-0000-000000000003', 'ar', 'د. فرحان م.', 'أخصائي الطب الطبيعي وإعادة التأهيل', 'MD (PMR)', 'أخصائي طب طبيعي وتأهيل يتمتع بخبرة تزيد عن 12 عاماً في قيادة برامج التعافي الحركي الشامل وإدارة حالات السكتة الدماغية.')
ON CONFLICT (doctor_id, locale) DO UPDATE SET name = EXCLUDED.name, specialization = EXCLUDED.specialization, qualifications = EXCLUDED.qualifications, biography = EXCLUDED.biography;

-- 7. GALLERY CATEGORIES & TRANSLATIONS
INSERT INTO public.gallery_categories (id, slug, sort_order) VALUES
('50000000-0000-0000-0000-000000000001', 'facilities', 1),
('50000000-0000-0000-0000-000000000002', 'treatments', 2),
('50000000-0000-0000-0000-000000000003', 'activities', 3),
('50000000-0000-0000-0000-000000000004', 'centre-ambience', 4)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, sort_order = EXCLUDED.sort_order;

INSERT INTO public.gallery_category_translations (category_id, locale, name) VALUES
('50000000-0000-0000-0000-000000000001', 'en', 'Facilities'),
('50000000-0000-0000-0000-000000000001', 'hi', 'सुविधाएं'),
('50000000-0000-0000-0000-000000000001', 'ar', 'المرافق والعيادات'),

('50000000-0000-0000-0000-000000000002', 'en', 'Treatments'),
('50000000-0000-0000-0000-000000000002', 'hi', 'उपचार'),
('50000000-0000-0000-0000-000000000002', 'ar', 'جلسات العلاج'),

('50000000-0000-0000-0000-000000000003', 'en', 'Activities'),
('50000000-0000-0000-0000-000000000003', 'hi', 'गतिविधियां'),
('50000000-0000-0000-0000-000000000003', 'ar', 'الأنشطة واليوغا'),

('50000000-0000-0000-0000-000000000004', 'en', 'Centre Ambience'),
('50000000-0000-0000-0000-000000000004', 'hi', 'केंद्र का वातावरण'),
('50000000-0000-0000-0000-000000000004', 'ar', 'أجواء المركز الطبيعية')
ON CONFLICT (category_id, locale) DO UPDATE SET name = EXCLUDED.name;

-- 8. GALLERY IMAGES & TRANSLATIONS
INSERT INTO public.gallery_images (id, category_id, image_url, sort_order, is_published) VALUES
('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', '/images/gallery/facility-reception.jpg', 1, true),
('60000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000002', '/images/gallery/treatment-room.jpg', 2, true),
('60000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000003', '/images/gallery/activity-yoga.jpg', 3, true),
('60000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000004', '/images/gallery/centre-garden.jpg', 4, true),
('60000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000001', '/images/gallery/building-exterior.jpg', 5, true),
('60000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000002', '/images/gallery/shirodhara-treatment.jpg', 6, true)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, sort_order = EXCLUDED.sort_order;

INSERT INTO public.gallery_image_translations (image_id, locale, title, caption, alt_text) VALUES
('60000000-0000-0000-0000-000000000001', 'en', 'Reception & Welcome Lounge', 'Warm and elegant reception at KHAIR International.', 'KHAIR International Reception and Receptionist Desk'),
('60000000-0000-0000-0000-000000000001', 'hi', 'स्वागत लाउंज', 'खैर इंटरनेशनल का स्वागत कक्ष।', 'खैर इंटरनेशनल स्वागत लाउंज'),
('60000000-0000-0000-0000-000000000001', 'ar', 'صالة الاستقبال والترحيب', 'صالة الاستقبال الدافئة والأنيقة في مركز خير الدولي.', 'صالة استقبال مركز خير الدولي'),

('60000000-0000-0000-0000-000000000002', 'en', 'Rehabilitation & Treatment Room', 'State-of-the-art physiotherapy and therapeutic setup.', 'Physiotherapy treatment room and therapy tables'),
('60000000-0000-0000-0000-000000000002', 'hi', 'उपचार एवं पुनर्वास कक्ष', 'आधुनिक फिजियोथेरेपी सेटअप।', 'उपचार एवं फिजियोथेरेपी कक्ष'),
('60000000-0000-0000-0000-000000000002', 'ar', 'غرفة العلاج والتأهيل', 'تجهيزات العلاج الطبيعي والتأهيل الطبي الحديثة.', 'غرفة جلسات العلاج الطبيعي في مركز خير'),

('60000000-0000-0000-0000-000000000003', 'en', 'Yoga & Meditation Studio', 'Sunlit studio for therapeutic yoga and mindfulness.', 'Spacious wooden floor yoga studio with mats'),
('60000000-0000-0000-0000-000000000003', 'hi', 'योग एवं ध्यान कक्ष', 'उपचारात्मक योग और माइंडफुलनेस के लिए शांत कक्ष।', 'योग एवं ध्यान हॉल'),
('60000000-0000-0000-0000-000000000003', 'ar', 'قاعة اليوغا والتأمل', 'قاعة مجهزة ومضاءة بنور طبيعي لجلسات اليوغا العلاجية.', 'قاعة اليوغا والتأمل في مركز خير'),

('60000000-0000-0000-0000-000000000004', 'en', 'Healing Garden Walkway', 'Lush botanical garden path for patient walking and serenity.', 'Botanical walking trail and green surroundings'),
('60000000-0000-0000-0000-000000000004', 'hi', 'उपचारात्मक उद्यान', 'प्रकृति से घिरा शांत उपचारात्मक वॉकवे।', 'खैर का प्राकृतिक हरा-भरा उद्यान'),
('60000000-0000-0000-0000-000000000004', 'ar', 'الحديقة الاستشفائية الهادئة', 'مسار طبيعي أخضر ومظلل لرياضة المشي والاسترخاء.', 'الحديقة الطبيعية المحيطة بمركز خير')
ON CONFLICT (image_id, locale) DO UPDATE SET title = EXCLUDED.title, caption = EXCLUDED.caption, alt_text = EXCLUDED.alt_text;

-- 9. PAGES (ABOUT, CONTACT, PRIVACY, TERMS)
INSERT INTO public.pages (id, slug, is_published) VALUES
('70000000-0000-0000-0000-000000000001', 'about', true),
('70000000-0000-0000-0000-000000000002', 'contact', true),
('70000000-0000-0000-0000-000000000003', 'privacy-policy', true),
('70000000-0000-0000-0000-000000000004', 'terms-of-service', true)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug;

-- About Page Content
INSERT INTO public.page_translations (page_id, locale, title, subtitle, content, meta_title, meta_description) VALUES
('70000000-0000-0000-0000-000000000001', 'en', 'About KHAIR International', 'Kottakkal Heritage Ayurveda and Integrated Rehabilitation', '{
  "story": "KHAIR International was founded with a singular conviction: that true healing is achieved when time-honoured Ayurvedic wisdom and cutting-edge medical physical rehabilitation converge. Located in Kottakkal, Malappuram — the world-renowned heartland of authentic Ayurveda — our hospital provides a tranquil haven close to Calicut International Airport.",
  "mission": "To provide evidence-based, compassionate and dignified holistic healthcare that restores physical mobility, revitalizes inner balance, and empowers every patient to return to full, active wellbeing.",
  "vision": "To stand as an international benchmark for integrative hospital care, seamlessly bridging heritage Ayurveda with modern physical and occupational rehabilitation.",
  "values": [
    {"title": "Heritage & Authenticity", "desc": "Rooted in authentic Kottakkal Ayurvedic traditions and classical protocols."},
    {"title": "Scientific Rigour", "desc": "Integrating evidence-based neurological and orthopaedic physical rehabilitation."},
    {"title": "Patient-Centred Dignity", "desc": "Every individual receives personalized attention in an empathetic healing setting."},
    {"title": "Sustainable Wellness", "desc": "Guiding patients towards lifelong vitality, preventive health, and autonomy."}
  ],
  "facilities": [
    "Dedicated Neuro-Rehabilitation & Physiotherapy Suites",
    "Specialized Ano-Rectal Mini Operation Theatre",
    "Panchakarma & Classical Treatment Chambers",
    "Serene Yoga, Pranayama & Mindfulness Hall",
    "Ayurvedic Herbal Pharmacy & Consultation Suites",
    "Calm Healing Botanical Garden for Restorative Walking"
  ]
}'::jsonb, 'About Us | KHAIR International — Ayurvedic Rehabilitation Hospital', 'Learn about KHAIR International, Kottakkal heritage Ayurveda, and integrated medical rehabilitation.'),

('70000000-0000-0000-0000-000000000001', 'hi', 'खैर इंटरनेशनल के बारे में', 'कोट्टाक्कल विरासत आयुर्वेद एवं एकीकृत पुनर्वास', '{
  "story": "खैर इंटरनेशनल की स्थापना इस विश्वास के साथ की गई कि सच्चा उपचार तब संभव है जब सदियों पुराना आयुर्वेदिक ज्ञान और आधुनिक पुनर्वास विज्ञान एक साथ काम करें। कोट्टाक्कल, मलप्पुरम में स्थित हमारा केंद्र कालीकट अंतर्राष्ट्रीय हवाई अड्डे के निकट शांतिपूर्ण उपचारात्मक वातावरण प्रदान करता है।",
  "mission": "साक्ष्य-आधारित, संवेदनशील और गरिमापूर्ण स्वास्थ्य सेवा प्रदान करना जो शारीरिक गतिशीलता को बहाल करे और आंतरिक संतुलन को पुनर्जीवित करे।",
  "vision": "विरासत आयुर्वेद और आधुनिक पुनर्वास को जोड़ने वाले एकीकृत अस्पताल देखभाल के लिए एक अंतरराष्ट्रीय मानदंड बनना।",
  "values": [
    {"title": "विरासत और प्रामाणिकता", "desc": "प्रामाणिक कोट्टाक्कल परंपराओं और शास्त्रीय प्रोटोकॉल में निहित।"},
    {"title": "वैज्ञानिक दृष्टिकोण", "desc": "साक्ष्य-आधारित न्यूरोलॉजिकल और ऑर्थोपेडिक पुनर्वास।"},
    {"title": "रोगी-केंद्रित गरिमा", "desc": "सहानुभूतिपूर्ण उपचारात्मक वातावरण में व्यक्तिगत ध्यान।"},
    {"title": "स्थायी आरोग्य", "desc": "मरीजों को आजीवन जीवन शक्ति और निवारक स्वास्थ्य की ओर मार्गदर्शन।"}
  ],
  "facilities": [
    "समर्पित न्यूरो-पुनर्वास और फिजियोथेरेपी सुइट्स",
    "विशिष्ट एनो-रेक्टल मिनी ऑपरेशन थिएटर",
    "पंचकर्म और शास्त्रीय उपचार कक्ष",
    "शांत योग और ध्यान हॉल",
    "हर्बल फार्मेसी एवं परामर्श कक्ष",
    "शांत उपचारात्मक वनस्पति उद्यान"
  ]
}'::jsonb, 'हमारे बारे में | खैर इंटरनेशनल आयुर्वेदिक पुनर्वास अस्पताल', 'खैर इंटरनेशनल, कोट्टाक्कल विरासत आयुर्वेद और एकीकृत पुनर्वास के बारे में जानें।'),

('70000000-0000-0000-0000-000000000001', 'ar', 'عن مركز خير الدولي', 'تراث كوتاكال للأيورفيدا وإعادة التأهيل المتكامل', '{
  "story": "تأسس مركز خير الدولي انطلاقاً من إيمان راسخ بأن الشفاء الحقيقي يكتمل حين تتكامل حكمة الأيورفيدا الأصيلة مع الدقة العلمية لإعادة التأهيل الطبي الحديث. يقع مركزنا في كوتاكال، مالابورام — المهد العالمي لطب الأيورفيدا الأصيل — بالقرب من مطار كوزيكود (كاليكوت) الدولي في بيئة هادئة مهيأة للتعافي والاستجمام.",
  "mission": "تقديم رعاية صحية تكاملية مفعمة بالاهتمام الإنساني والكرامة، تعيد للمريض قدرته على الحركة والتوازن، وتمنحه حياة نشطة ومفعمة بالصحة.",
  "vision": "أن نكون مرجعاً عالمياً رائداً في الرعاية الصحية الاستشفائية التكاملية، نجسد جسراً حقيقياً بين عراقة الأيورفيدا وأحدث تقنيات التأهيل الطبي والوظيفي.",
  "values": [
    {"title": "الأصالة والتراث", "desc": "رعاية متجذرة في تقاليد كوتاكال الأصيلة وبروتوكولاتها العلاجية المجربة."},
    {"title": "الدقة العلمية", "desc": "دمج برامج التأهيل العصبي والحركي المبنية على الأدلة والنتائج الملموسة."},
    {"title": "احترام خصوصية المريض", "desc": "عناية فردية فائقة في بيئة راقية تحترم كرامة المريض وراحته."},
    {"title": "العافية المستدامة", "desc": "تزويد المريض بالإرشادات الوقائية لضمان استمرار الحيوية والصحة."}
  ],
  "facilities": [
    "أجنحة متطورة للعلاج الطبيعي والتأهيل العصبي الحركي",
    "غرفة عمليات مصغرة ومجهزة لجراحات الشرج والناسور التخصصية",
    "أجنحة بانشاكارما والعلاجات العشبية التقليدية",
    "قاعة هادئة ومضاءة لجلسات اليوغا وتمارين التنفس والاسترخاء",
    "صيدلية عشبية متكاملة وغرف استشارات طبية متخصصة",
    "حدائق استشفائية خضراء مهيأة للمشي واستنشاق الهواء النقي"
  ]
}'::jsonb, 'من نحن | مركز خير الدولي — مستشفى الأيورفيدا وإعادة التأهيل', 'تعرّف على مركز خير الدولي، تراث كوتاكال للأيورفيدا وإعادة التأهيل الطبي الشامل.')
ON CONFLICT (page_id, locale) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, content = EXCLUDED.content;

-- Contact Page Content
INSERT INTO public.page_translations (page_id, locale, title, subtitle, content, meta_title, meta_description) VALUES
('70000000-0000-0000-0000-000000000002', 'en', 'Contact & Location', 'We are here to assist your healing journey', '{
  "intro": "Reach out to our patient care coordinators to schedule consultations, enquire about specialised residential rehabilitation programmes, or arrange seamless transfers from Calicut International Airport.",
  "working_hours": "Monday – Saturday: 8:00 AM – 7:00 PM | Sunday: Inpatient & Emergency Care"
}'::jsonb, 'Contact Us | KHAIR International', 'Get in touch with KHAIR International in Kottakkal / Kondotty, Kerala.'),

('70000000-0000-0000-0000-000000000002', 'hi', 'संपर्क एवं स्थान', 'हम आपकी स्वास्थ्य यात्रा में सहायता के लिए उपस्थित हैं', '{
  "intro": "परामर्श अनुसूची करने या आवासीय पुनर्वास कार्यक्रमों की जानकारी प्राप्त करने के लिए हमारी टीम से संपर्क करें।",
  "working_hours": "सोमवार - शनिवार: सुबह 8:00 से शाम 7:00 तक | रविवार: इनपेशेंट देखभाल"
}'::jsonb, 'संपर्क करें | खैर इंटरनेशनल', 'खैर इंटरनेशनल कोट्टाक्कल / कोंडोट्टी, केरल से संपर्क करें।'),

('70000000-0000-0000-0000-000000000002', 'ar', 'اتصل بنا وموقع المركز', 'فريقنا في خدمتكم لمرافقتكم في رحلة العلاج والتعافي', '{
  "intro": "تواصل مع منسقي رعاية المرضى لحجز استشارة طبية، أو الاستفسار عن برامج الإقامة والتأهيل الشامل، أو ترتيب الاستقبال من مطار كوزيكود الدولي.",
  "working_hours": "من الإثنين إلى السبت: 8:00 صباحاً – 7:00 مساءً | الأحد: الرعاية الداخلية للحالات المقيمة"
}'::jsonb, 'اتصل بنا | مركز خير الدولي', 'تواصل مع مركز خير الدولي في كوتاكال / كوندوتي، مالابورام، كيرلا، الهند.')
ON CONFLICT (page_id, locale) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, content = EXCLUDED.content;

-- 10. SEO METADATA FOR CORE ROUTES
INSERT INTO public.seo_metadata (route_path, locale, title, description, og_title, og_description, og_image, robots) VALUES
('/', 'en', 'KHAIR International — Ayurveda, Physiotherapy & Holistic Wellbeing', 'A modern centre for Ayurveda, Physiotherapy and Holistic Rehabilitation in Kottakkal, Kerala. Time-honoured Kottakkal heritage meets evidence-based modern rehabilitation.', 'KHAIR International — Integrative Healthcare', 'A modern centre for Ayurveda, Physiotherapy and Holistic Rehabilitation.', '/images/branding/homepage-mockup.jpg', 'index, follow'),
('/', 'hi', 'खैर इंटरनेशनल — आयुर्वेद, फिजियोथेरेपी एवं समग्र स्वास्थ्य', 'कोट्टाक्कल, केरल में आयुर्वेद, फिजियोथेरेपी और समग्र पुनर्वास का एक आधुनिक केंद्र।', 'खैर इंटरनेशनल — समग्र स्वास्थ्य केंद्र', 'आयुर्वेद, फिजियोथेरेपी और पुनर्वास का आधुनिक केंद्र।', '/images/branding/homepage-mockup.jpg', 'index, follow'),
('/', 'ar', 'مركز خير الدولي — طب الأيورفيدا والعلاج الطبيعي والتأهيل الشامل', 'مركز طبي متكامل للأيورفيدا والعلاج الطبيعي وإعادة التأهيل في كوتاكال، كيرلا. تراث كوتاكال العريق يلتقي مع أحدث علوم التأهيل.', 'مركز خير الدولي — رعاية صحية تكاملية', 'مركز رائد للأيورفيدا والعلاج الطبيعي والتأهيل الطبي في كيرلا، الهند.', '/images/branding/homepage-mockup.jpg', 'index, follow'),

('/about', 'en', 'About Us | KHAIR International — Kottakkal Heritage Ayurveda', 'Discover KHAIR International: where traditional Kottakkal Ayurvedic wisdom converges with modern physical rehabilitation.', 'About KHAIR International', 'Integrative healthcare rooted in heritage and modern rehabilitation.', '/images/gallery/building-exterior.jpg', 'index, follow'),
('/departments', 'en', 'Specialized Healthcare Departments | KHAIR International', 'Explore our clinical departments: Ayurveda Treatments, Physiotherapy, Naturopathy, Lifestyle Clinic, Ano-Rectal Care, and Occupational Therapy.', 'Departments | KHAIR International', 'Specialized Ayurvedic and physical rehabilitation departments.', '/images/departments/ayurveda-herbs.jpg', 'index, follow'),
('/doctors', 'en', 'Medical Experts & Consultants | KHAIR International', 'Meet our team of experienced Ayurveda physicians, rehabilitation specialists, and physical therapy consultants at KHAIR International.', 'Doctors | KHAIR International', 'Meet our qualified clinical experts at KHAIR International.', '/images/branding/khair-emblem.png', 'index, follow'),
('/gallery', 'en', 'Facilities & Treatment Gallery | KHAIR International', 'View photos of our clinical facilities, physiotherapy units, therapy suites, and serene botanical gardens in Kottakkal, Kerala.', 'Gallery | KHAIR International', 'Explore the healing environment at KHAIR International.', '/images/gallery/building-exterior.jpg', 'index, follow'),
('/contact', 'en', 'Contact & Consultation | KHAIR International, Kerala', 'Book a consultation or reach our patient care desk at KHAIR International, Kottakkal / Kondotty, Kerala. Phone: +91 94473 60670.', 'Contact KHAIR International', 'Book appointments and contact our patient care team.', '/images/branding/khair-logo-full.png', 'index, follow')
ON CONFLICT (route_path, locale) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, og_title = EXCLUDED.og_title, og_description = EXCLUDED.og_description;

-- ============================================================================
-- END OF SETUP & SEED SCRIPT
-- ============================================================================

