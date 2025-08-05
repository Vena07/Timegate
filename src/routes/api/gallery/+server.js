import { db } from '$lib/server/db';
import { gallery, sections } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import { desc } from 'drizzle-orm';


export async function GET() {
  const result = await db
    .select({
      id: gallery.id,
      image_url: gallery.image_url,
      section_id: gallery.section_id,
      section_title: sections.title_cz
    })
    .from(gallery)
    .leftJoin(sections, eq(gallery.section_id, sections.id))
    .orderBy(desc(gallery.id));  // ← přidáno, řadí podle id sestupně (nejnovější nahoře)

  return json(result);
}

export async function POST({ request }) {
  const { data } = await request.json();
  const inserted = await db.insert(gallery).values(data).returning();
  return json(inserted[0]);
}
