import { NextRequest, NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase/service-role';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = getServiceRoleClient() || (await createServerSupabaseClient());
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client unavailable' }, { status: 500 });
    }

    const body = await req.json();
    const { type, payload } = body;

    switch (type) {
      case 'homepage_section': {
        const { section_key, image_url, mobile_image_url, is_visible, locale, title, subtitle, description, cta_label, cta_link } = payload;

        // Build metadata object (stores extra fields without schema changes)
        const metadata = { mobile_image_url: mobile_image_url || null };

        // 1. Update main section table
        const { data: sectionData, error: sErr } = await supabase
          .from('homepage_sections')
          .update({ image_url, is_visible, metadata })
          .eq('section_key', section_key)
          .select('id')
          .single();

        if (sErr && !sectionData) {
          // If section row doesn't exist yet, insert it
          const { data: newSec } = await supabase
            .from('homepage_sections')
            .upsert({ section_key, image_url, is_visible, metadata }, { onConflict: 'section_key' })
            .select('id')
            .single();
          
          if (newSec?.id && locale) {
            await supabase.from('homepage_section_translations').upsert(
              { section_id: newSec.id, locale, title, subtitle, description, cta_label, cta_link },
              { onConflict: 'section_id,locale' }
            );
          }
        } else if (sectionData?.id && locale) {
          // Update translations
          await supabase.from('homepage_section_translations').upsert(
            { section_id: sectionData.id, locale, title, subtitle, description, cta_label, cta_link },
            { onConflict: 'section_id,locale' }
          );
        }

        return NextResponse.json({ success: true, message: 'Homepage section updated' });
      }

      case 'department': {
        const { id, slug, featured_image, icon, is_published, locale, name, short_description, full_description, treatments } = payload;

        // 1. Upsert department
        const { data: deptData, error: dErr } = await supabase
          .from('departments')
          .upsert(
            { id: id || undefined, slug, featured_image, icon, is_published },
            { onConflict: 'slug' }
          )
          .select('id')
          .single();

        const deptId = deptData?.id || id;
        if (deptId && locale) {
          await supabase.from('department_translations').upsert(
            {
              department_id: deptId,
              locale,
              name,
              short_description,
              full_description,
              treatments: Array.isArray(treatments) ? treatments : [],
            },
            { onConflict: 'department_id,locale' }
          );
        }

        return NextResponse.json({ success: true, message: 'Department updated', id: deptId });
      }

      case 'page': {
        const { slug, featured_image, is_published, locale, title, subtitle, content } = payload;

        const { data: pageData } = await supabase
          .from('pages')
          .upsert({ slug, featured_image, is_published }, { onConflict: 'slug' })
          .select('id')
          .single();

        if (pageData?.id && locale) {
          await supabase.from('page_translations').upsert(
            { page_id: pageData.id, locale, title, subtitle, content },
            { onConflict: 'page_id,locale' }
          );
        }

        return NextResponse.json({ success: true, message: 'Page updated' });
      }

      case 'gallery_image': {
        const { id, category_id, image_url, sort_order, is_published, locale, title, caption, alt_text } = payload;

        const { data: imgData } = await supabase
          .from('gallery_images')
          .upsert(
            { id: id || undefined, category_id: category_id || null, image_url, sort_order: sort_order || 1, is_published },
            { onConflict: 'id' }
          )
          .select('id')
          .single();

        const imgId = imgData?.id || id;
        if (imgId && locale) {
          await supabase.from('gallery_image_translations').upsert(
            { gallery_image_id: imgId, locale, title, caption, alt_text: alt_text || title },
            { onConflict: 'gallery_image_id,locale' }
          );
        }

        return NextResponse.json({ success: true, message: 'Gallery image updated', id: imgId });
      }

      case 'doctor': {
        const { id, slug, photo_url, experience_years, department_id, is_published, locale, name, specialization, qualifications, biography } = payload;

        const { data: docData } = await supabase
          .from('doctors')
          .upsert(
            { id: id || undefined, slug, photo_url, experience_years, department_id: department_id || null, is_published },
            { onConflict: 'slug' }
          )
          .select('id')
          .single();

        const docId = docData?.id || id;
        if (docId && locale) {
          await supabase.from('doctor_translations').upsert(
            {
              doctor_id: docId,
              locale,
              name,
              specialization,
              qualifications,
              biography,
            },
            { onConflict: 'doctor_id,locale' }
          );
        }

        return NextResponse.json({ success: true, message: 'Doctor updated', id: docId });
      }

      default:
        return NextResponse.json({ error: 'Unknown content type' }, { status: 400 });
    }
  } catch (err: any) {
    console.error('Content update error:', err);
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 500 });
  }
}
