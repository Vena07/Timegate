import { db } from '$lib/server/db';
import { sections } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';

export async function GET() {
  const all = await db.select().from(sections);  // přidáno řazení
  return json(all);
}

export async function POST({ request }) {
  const { data } = await request.json();
  const inserted = await db.insert(sections).values(data).returning();
  return json(inserted[0]);
}
