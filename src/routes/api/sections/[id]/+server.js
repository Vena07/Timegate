import { db } from '$lib/server/db';
import { sections, gallery } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE({ params }) {
  const { id } = params;
  if (!id) return new Response('Missing id', { status: 400 });

  // Smazat obrázky v sekci (aby nezůstaly "orphaned")
  await db.delete(gallery).where(eq(gallery.section_id, Number(id)));

  // Smazat sekci
  await db.delete(sections).where(eq(sections.id, Number(id)));

  return new Response('OK');
}
