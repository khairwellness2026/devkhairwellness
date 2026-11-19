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
        const { id, slug, featured_image, icon, is_published, locale, name, short_description, full_description, treatments, hero_banner_url, hero_mobile_banner_url } = payload;

        // Store banner images in gallery_images text array
        const gallery_images: string[] = [];
        if (hero_banner_url) gallery_images.push(`hero:${hero_banner_url}`);
        if (hero_mobile_banner_url) gallery_images.push(`mobile:${hero_mobile_banner_url}`);

        // Check if id is an existing valid UUID
        const isUUID = Boolean(id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));

        let deptId = id;
        if (isUUID) {
          const { data: deptData, error: dErr } = await supabase
            .from('departments')
            .upsert(
              { id, slug, featured_image, icon, is_published, gallery_images },
              { onConflict: 'id' }
            )
            .select('id')
            .single();

          if (dErr) {
            console.error('Department update error:', dErr);
            throw new Error(dErr.message);
          }
          deptId = deptData?.id || id;
        } else {
          // New department
          const { data: deptData, error: dErr } = await supabase
            .from('departments')
            .insert({ slug, featured_image, icon, is_published, gallery_images })
            .select('id')
            .single();

          if (dErr) {
            console.error('Department insert error:', dErr);
            throw new Error(dErr.message);
          }
          deptId = deptData?.id;
        }

        if (deptId && locale) {
          const { error: tErr } = await supabase.from('department_translations').upsert(
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

          if (tErr) {
            console.error('Department translation error:', tErr);
            throw new Error(tErr.message);
          }
        }

        return NextResponse.json({ success: true, message: 'Department updated', id: deptId });
      }

      case 'page': {
        const { slug, featured_image, is_published, locale, title, subtitle, content } = payload;

        // 1. Find or insert page record by slug (pages only has id, slug, is_published)
        let pageId: string | undefined;
        const { data: existingPage, error: findErr } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', slug)
          .maybeSingle();

        if (findErr) {
          console.error('Error finding page:', findErr);
        }

        if (existingPage?.id) {
          pageId = existingPage.id;
          if (typeof is_published === 'boolean') {
            await supabase.from('pages').update({ is_published }).eq('id', pageId);
          }
        } else {
          const { data: newPage, error: insertErr } = await supabase
            .from('pages')
            .insert({ slug, is_published: is_published ?? true })
            .select('id')
            .single();

          if (insertErr) {
            console.error('Error inserting page:', insertErr);
            return NextResponse.json({ error: insertErr.message }, { status: 500 });
          }
          pageId = newPage?.id;
        }

        if (pageId && locale) {
          // Merge featured_image into content JSONB
          const existingContent = (typeof content === 'object' && content !== null) ? content : {};
          const mergedContent = {
            ...existingContent,
            ...(featured_image !== undefined ? { featured_image } : {}),
          };

          const { error: transErr } = await supabase.from('page_translations').upsert(
            {
              page_id: pageId,
              locale,
              title,
              subtitle,
              content: mergedContent,
            },
            { onConflict: 'page_id,locale' }
          );

          if (transErr) {
            console.error('Error updating page translation:', transErr);
            return NextResponse.json({ error: transErr.message }, { status: 500 });
          }

          // If featured_image is provided, propagate to other translations of this page so all locales share it
          if (featured_image) {
            const { data: otherTrans } = await supabase
              .from('page_translations')
              .select('id, locale, content')
              .eq('page_id', pageId)
              .neq('locale', locale);

            if (otherTrans && otherTrans.length > 0) {
              for (const ot of otherTrans) {
                const otContent = (typeof ot.content === 'object' && ot.content !== null) ? ot.content : {};
                await supabase
                  .from('page_translations')
                  .update({ content: { ...otContent, featured_image } })
                  .eq('id', ot.id);
              }
            }
          }
        }

        return NextResponse.json({ success: true, message: 'Page updated', id: pageId });
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
