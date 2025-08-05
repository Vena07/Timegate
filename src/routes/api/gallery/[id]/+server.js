import { db } from '$lib/server/db';
import { gallery } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE({ params }) {
  const { id } = params;
  if (!id) return new Response('Missing id', { status: 400 });

  await db.delete(gallery).where(eq(gallery.id, Number(id)));
  return new Response('OK');
}
