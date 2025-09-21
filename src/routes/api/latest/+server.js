import { db } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import { asc, desc, gte } from 'drizzle-orm';
import { schema } from '$lib/server/db/schema';

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Vybere 3 nejbližší nadcházející eventy
    const upcomingEvents = await db
      .select()
      .from(schema.event)
      .where(gte(schema.event.date, today))
      .orderBy(asc(schema.event.date)) // od nejbližšího data
      .limit(3);

    const latestNews = await db
      .select()
      .from(schema.news)
      .orderBy(desc(schema.news.created_at))
      .limit(3);

    const latestGallery = await db
      .select()
      .from(schema.gallery)
      .orderBy(desc(schema.gallery.id))
      .limit(3);

    const latestArtist = await db
      .select()
      .from(schema.artist)
      .orderBy(desc(schema.artist.id))
      .limit(3);

    const latestSoundTrack = await db
      .select()
      .from(schema.sound_track)
      .orderBy(desc(schema.sound_track.id))
      .limit(3);

    return json({
      event: upcomingEvents,
      news: latestNews,
      gallery: latestGallery,
      artist: latestArtist,
      sound_track: latestSoundTrack
    });
  } catch (error) {
    console.error('Chyba při načítání nejnovějších dat:', error);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
