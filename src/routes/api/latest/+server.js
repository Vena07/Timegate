import { db } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import { desc } from 'drizzle-orm';
import { schema } from '$lib/server/db/schema';

export async function GET() {
  try {
    const latestEvent = await db
      .select()
      .from(schema.event)
      .orderBy(desc(schema.event.date))
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
      event: latestEvent,
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
