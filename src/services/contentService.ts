import { cache } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  SiteSettings,
  NavigationItem,
  Page,
  HomepageSection,
  Department,
  Doctor,
  GalleryCategory,
  GalleryImage,
  SeoMetadata,
  SocialLink,
  Locale,
} from '@/types';

// Fast singleton client for server components
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceOrAnonKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let cachedClient: any = null;

function getSupabase() {
  if (!cachedClient && supabaseUrl && serviceOrAnonKey) {
    cachedClient = createClient(supabaseUrl, serviceOrAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return cachedClient;
}

export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();
    if (error || !data) return null;
    return data as SiteSettings;
  } catch (err) {
    console.error('Error fetching site_settings:', err);
    return null;
  }
});

export const getNavigation = cache(async (locale: Locale): Promise<NavigationItem[]> => {
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('navigation_items')
      .select(`
        id,
        path,
        sort_order,
        is_published,
        navigation_translations ( locale, label )
      `)
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error || !data) return [];

    return data.map((item: any) => {
      const trans =
        item.navigation_translations?.find((t: any) => t.locale === locale) ||
        item.navigation_translations?.find((t: any) => t.locale === 'en');
      return {
        id: item.id,
        path: item.path,
        sort_order: item.sort_order,
        is_published: item.is_published,
        label: trans?.label || item.path,
      };
    });
  } catch (err) {
    console.error('Error fetching navigation:', err);
    return [];
  }
});

export const getHomepageSections = cache(
  async (locale: Locale): Promise<Record<string, HomepageSection>> => {
    const supabase = getSupabase();
    if (!supabase) return {};

    try {
      const { data, error } = await supabase
        .from('homepage_sections')
        .select(`
          id,
          section_key,
          is_visible,
          sort_order,
          image_url,
          metadata,
          homepage_section_translations ( locale, title, subtitle, description, cta_label, cta_link, content )
        `)
        .eq('is_visible', true)
        .order('sort_order', { ascending: true });

      if (error || !data) return {};

      const result: Record<string, HomepageSection> = {};
      for (const item of data) {
        const trans =
          item.homepage_section_translations?.find((t: any) => t.locale === locale) ||
          item.homepage_section_translations?.find((t: any) => t.locale === 'en');
        result[item.section_key] = {
          id: item.id,
          section_key: item.section_key,
          is_visible: item.is_visible,
          sort_order: item.sort_order,
          image_url: item.image_url,
          mobile_image_url: item.metadata?.mobile_image_url || undefined,
          metadata: item.metadata,
          title: trans?.title || '',
          subtitle: trans?.subtitle || '',
          description: trans?.description || '',
          cta_label: trans?.cta_label || '',
          cta_link: trans?.cta_link || '',
          content: trans?.content || {},
        };
      }
      return result;
    } catch (err) {
      console.error('Error fetching homepage_sections:', err);
      return {};
    }
  }
);

export const getDepartments = cache(async (locale: Locale): Promise<Department[]> => {
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('departments')
      .select(`
        id,
        slug,
        icon,
        featured_image,
        gallery_images,
        sort_order,
        is_published,
        department_translations ( locale, name, short_description, full_description, treatments, meta_title, meta_description )
      `)
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error || !data) return [];

    return data.map((dept: any) => {
      const trans =
        dept.department_translations?.find((t: any) => t.locale === locale) ||
        dept.department_translations?.find((t: any) => t.locale === 'en');

      let hero_banner_url: string | undefined = undefined;
      let hero_mobile_banner_url: string | undefined = undefined;
      if (Array.isArray(dept.gallery_images)) {
        for (const item of dept.gallery_images) {
          if (typeof item === 'string') {
            if (item.startsWith('hero:')) hero_banner_url = item.slice(5);
            else if (item.startsWith('mobile:')) hero_mobile_banner_url = item.slice(7);
          }
        }
        if (!hero_banner_url && dept.gallery_images[0] && !dept.gallery_images[0].startsWith('mobile:')) {
          hero_banner_url = dept.gallery_images[0];
        }
        if (!hero_mobile_banner_url && dept.gallery_images[1] && !dept.gallery_images[1].startsWith('hero:')) {
          hero_mobile_banner_url = dept.gallery_images[1];
        }
      }

      return {
        id: dept.id,
        slug: dept.slug,
        icon: dept.icon,
        featured_image: dept.featured_image,
        gallery_images: dept.gallery_images,
        sort_order: dept.sort_order,
        is_published: dept.is_published,
        name: trans?.name || dept.slug,
        short_description: trans?.short_description || '',
        full_description: trans?.full_description || '',
        treatments: Array.isArray(trans?.treatments) ? trans.treatments : [],
        meta_title: trans?.meta_title,
        meta_description: trans?.meta_description,
        hero_banner_url,
        hero_mobile_banner_url,
      };
    });
  } catch (err) {
    console.error('Error fetching departments:', err);
    return [];
  }
});

export const getDepartmentBySlug = cache(
  async (slug: string, locale: Locale): Promise<Department | null> => {
    const supabase = getSupabase();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('departments')
        .select(`
          id,
          slug,
          icon,
          featured_image,
          gallery_images,
          sort_order,
          is_published,
          department_translations ( locale, name, short_description, full_description, treatments, meta_title, meta_description )
        `)
        .eq('slug', slug)
        .eq('is_published', true)
        .limit(1)
        .single();

      if (error || !data) return null;

      const trans =
        data.department_translations?.find((t: any) => t.locale === locale) ||
        data.department_translations?.find((t: any) => t.locale === 'en');

      let hero_banner_url: string | undefined = undefined;
      let hero_mobile_banner_url: string | undefined = undefined;
      if (Array.isArray(data.gallery_images)) {
        for (const item of data.gallery_images) {
          if (typeof item === 'string') {
            if (item.startsWith('hero:')) hero_banner_url = item.slice(5);
            else if (item.startsWith('mobile:')) hero_mobile_banner_url = item.slice(7);
          }
        }
        if (!hero_banner_url && data.gallery_images[0] && !data.gallery_images[0].startsWith('mobile:')) {
          hero_banner_url = data.gallery_images[0];
        }
        if (!hero_mobile_banner_url && data.gallery_images[1] && !data.gallery_images[1].startsWith('hero:')) {
          hero_mobile_banner_url = data.gallery_images[1];
        }
      }

      return {
        id: data.id,
        slug: data.slug,
        icon: data.icon,
        featured_image: data.featured_image,
        gallery_images: data.gallery_images,
        sort_order: data.sort_order,
        is_published: data.is_published,
        name: trans?.name || data.slug,
        short_description: trans?.short_description || '',
        full_description: trans?.full_description || '',
        treatments: Array.isArray(trans?.treatments) ? trans.treatments : [],
        meta_title: trans?.meta_title,
        meta_description: trans?.meta_description,
        hero_banner_url,
        hero_mobile_banner_url,
      };
    } catch (err) {
      console.error(`Error fetching department by slug ${slug}:`, err);
      return null;
    }
  }
);

export const getDoctors = cache(async (locale: Locale): Promise<Doctor[]> => {
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('doctors')
      .select(`
        id,
        slug,
        photo_url,
        experience_years,
        sort_order,
        is_published,
        department_id,
        departments ( slug, department_translations ( locale, name ) ),
        doctor_translations ( locale, name, specialization, qualifications, biography )
      `)
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error || !data) return [];

    return data.map((doc: any) => {
      const trans =
        doc.doctor_translations?.find((t: any) => t.locale === locale) ||
        doc.doctor_translations?.find((t: any) => t.locale === 'en');
      const deptTrans =
        doc.departments?.department_translations?.find((t: any) => t.locale === locale) ||
        doc.departments?.department_translations?.find((t: any) => t.locale === 'en');

      return {
        id: doc.id,
        slug: doc.slug,
        photo_url: doc.photo_url,
        experience_years: doc.experience_years,
        department_id: doc.department_id,
        department_name: deptTrans?.name || '',
        sort_order: doc.sort_order,
        is_published: doc.is_published,
        name: trans?.name || doc.slug,
        specialization: trans?.specialization || '',
        qualifications: trans?.qualifications || '',
        biography: trans?.biography || '',
      };
    });
  } catch (err) {
    console.error('Error fetching doctors:', err);
    return [];
  }
});

export const getDoctorBySlug = cache(
  async (slug: string, locale: Locale): Promise<Doctor | null> => {
    const supabase = getSupabase();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          id,
          slug,
          photo_url,
          experience_years,
          sort_order,
          is_published,
          department_id,
          departments ( slug, department_translations ( locale, name ) ),
          doctor_translations ( locale, name, specialization, qualifications, biography )
        `)
        .eq('slug', slug)
        .eq('is_published', true)
        .limit(1)
        .single();

      if (error || !data) return null;

      const trans =
        data.doctor_translations?.find((t: any) => t.locale === locale) ||
        data.doctor_translations?.find((t: any) => t.locale === 'en');
      const deptObj: any = Array.isArray(data.departments) ? data.departments[0] : data.departments;
      const deptTrans =
        deptObj?.department_translations?.find((t: any) => t.locale === locale) ||
        deptObj?.department_translations?.find((t: any) => t.locale === 'en');

      return {
        id: data.id,
        slug: data.slug,
        photo_url: data.photo_url,
        experience_years: data.experience_years,
        department_id: data.department_id,
        department_name: deptTrans?.name || '',
        sort_order: data.sort_order,
        is_published: data.is_published,
        name: trans?.name || data.slug,
        specialization: trans?.specialization || '',
        qualifications: trans?.qualifications || '',
        biography: trans?.biography || '',
      };
    } catch (err) {
      console.error(`Error fetching doctor by slug ${slug}:`, err);
      return null;
    }
  }
);

export const getGalleryCategories = cache(async (locale: Locale): Promise<GalleryCategory[]> => {
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('gallery_categories')
      .select(`
        id,
        slug,
        sort_order,
        gallery_category_translations ( locale, name )
      `)
      .order('sort_order', { ascending: true });

    if (error || !data) return [];

    return data.map((cat: any) => {
      const trans =
        cat.gallery_category_translations?.find((t: any) => t.locale === locale) ||
        cat.gallery_category_translations?.find((t: any) => t.locale === 'en');
      return {
        id: cat.id,
        slug: cat.slug,
        sort_order: cat.sort_order,
        name: trans?.name || cat.slug,
      };
    });
  } catch (err) {
    console.error('Error fetching gallery_categories:', err);
    return [];
  }
});

export const getGalleryImages = cache(
  async (locale: Locale, categorySlug?: string): Promise<GalleryImage[]> => {
    const supabase = getSupabase();
    if (!supabase) return [];

    try {
      const query = supabase
        .from('gallery_images')
        .select(`
          id,
          category_id,
          image_url,
          cloudinary_public_id,
          width,
          height,
          sort_order,
          is_published,
          gallery_categories ( slug, gallery_category_translations ( locale, name ) ),
          gallery_image_translations ( locale, title, caption, alt_text )
        `)
        .eq('is_published', true)
        .order('sort_order', { ascending: true });

      const { data, error } = await query;
      if (error || !data) return [];

      const mapped = data.map((img: any) => {
        const trans =
          img.gallery_image_translations?.find((t: any) => t.locale === locale) ||
          img.gallery_image_translations?.find((t: any) => t.locale === 'en');
        const catTrans =
          img.gallery_categories?.gallery_category_translations?.find((t: any) => t.locale === locale) ||
          img.gallery_categories?.gallery_category_translations?.find((t: any) => t.locale === 'en');

        return {
          id: img.id,
          category_id: img.category_id,
          category_slug: img.gallery_categories?.slug,
          category_name: catTrans?.name,
          image_url: img.image_url,
          cloudinary_public_id: img.cloudinary_public_id,
          width: img.width,
          height: img.height,
          sort_order: img.sort_order,
          is_published: img.is_published,
          title: trans?.title || 'Gallery Item',
          caption: trans?.caption || '',
          alt_text: trans?.alt_text || 'KHAIR Healthcare',
        };
      });

      if (categorySlug && categorySlug !== 'all') {
        return mapped.filter((item: any) => item.category_slug === categorySlug);
      }

      return mapped;
    } catch (err) {
      console.error('Error fetching gallery images:', err);
      return [];
    }
  }
);

export const getPageContent = cache(async (slug: string, locale: Locale): Promise<Page | null> => {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('pages')
      .select(`
        id,
        slug,
        is_published,
        page_translations ( locale, title, subtitle, content, meta_title, meta_description )
      `)
      .eq('slug', slug)
      .eq('is_published', true)
      .limit(1)
      .single();

    if (error || !data) return null;

    const trans =
      data.page_translations?.find((t: any) => t.locale === locale) ||
      data.page_translations?.find((t: any) => t.locale === 'en') ||
      data.page_translations?.[0];

    const featured_image =
      trans?.content?.featured_image ||
      data.page_translations?.find((t: any) => t.locale === 'en')?.content?.featured_image ||
      data.page_translations?.find((t: any) => t?.content?.featured_image)?.content?.featured_image ||
      '';

    return {
      id: data.id,
      slug: data.slug,
      featured_image,
      title: trans?.title || '',
      subtitle: trans?.subtitle || '',
      content: trans?.content || {},
      meta_title: trans?.meta_title,
      meta_description: trans?.meta_description,
    };
  } catch (err) {
    console.error(`Error fetching page ${slug}:`, err);
    return null;
  }
});

export const getSeoMetadata = cache(
  async (path: string, locale: Locale): Promise<SeoMetadata | null> => {
    const supabase = getSupabase();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('seo_metadata')
        .select('*')
        .eq('route_path', path)
        .eq('locale', locale)
        .limit(1)
        .single();

      if (error || !data) {
        // Fallback to English seo record
        const { data: enData } = await supabase
          .from('seo_metadata')
          .select('*')
          .eq('route_path', path)
          .eq('locale', 'en')
          .limit(1)
          .single();
        return enData as SeoMetadata;
      }

      return data as SeoMetadata;
    } catch {
      return null;
    }
  }
);

export const getSocialLinks = cache(async (): Promise<SocialLink[]> => {
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error || !data) return [];
    return data as SocialLink[];
  } catch {
    return [];
  }
});
