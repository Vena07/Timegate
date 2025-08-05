import { db } from '$lib/server/db';
import { event } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';


export async function GET() {
  try {
    const data = await db.select().from(event).orderBy(desc(event.id));
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Chyba při načítání event:', error);
    return new Response(JSON.stringify({ error: 'Chyba při načítání event' }), { status: 500 });
  }
}
