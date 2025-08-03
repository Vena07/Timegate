import { db } from '$lib/server/db';
import { lineup } from '$lib/server/db/schema';

export async function GET() {
  try {
    const data = await db.select().from(lineup);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Chyba při načítání lineup:', error);
    return new Response(JSON.stringify({ error: 'Chyba při načítání lineup' }), { status: 500 });
  }
}
