import { db } from '$lib/server/db';
import { event, lineup } from '$lib/server/db/schema';
import { eq, asc, gte } from 'drizzle-orm';
import { json } from '@sveltejs/kit';

export async function GET() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Načíst pouze nadcházející eventy řazené od nejbližšího
  const events = await db
    .select()
    .from(event)
    .where(gte(event.date, today))
    .orderBy(asc(event.date));

  // Načíst lineup pro každý event
  const allLineups = await db.select().from(lineup);
  const enrichedEvents = events.map(e => ({
    ...e,
    lineup: allLineups.filter(l => l.event_id === e.id)
  }));

  return json(enrichedEvents);
}

export async function POST({ request }) {
  const { data, type } = await request.json();

  // Přidání záznamu do lineup
  if (type === 'add_lineup') {
    const [inserted] = await db.insert(lineup).values(data).returning();
    return json(inserted);
  }

  // Vytvoření eventu
  const [inserted] = await db.insert(event).values(data).returning();
  return json(inserted);
}

export async function PUT({ request }) {
  const { id, data, type } = await request.json();

  if (type === 'update_lineup') {
    // Úprava konkrétního řádku lineup
    const [updatedLineup] = await db
      .update(lineup)
      .set(data)
      .where(eq(lineup.id, id))
      .returning();
    return json(updatedLineup);
  } else {
    // Úprava samotného eventu
    const [updatedEvent] = await db
      .update(event)
      .set(data)
      .where(eq(event.id, id))
      .returning();
    return json(updatedEvent);
  }
}

export async function DELETE({ request }) {
  const { id, type } = await request.json();

  // Mazání z lineup
  if (type === 'delete_lineup') {
    await db.delete(lineup).where(eq(lineup.id, id));
    return json({ success: true });
  }

  // Mazání eventu
  await db.delete(event).where(eq(event.id, id));
  return json({ success: true });
}
