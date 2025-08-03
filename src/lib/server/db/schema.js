import { date } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
  id: integer('id', { mode: 'autoIncrement' }).primaryKey(),
  email: text('email').notNull(),
  nickname: text('nickname').notNull(),
  jmeno: text('jmeno').notNull(),
  prijmeni: text('prijmeni').notNull(),
  datum_nar: date('datum_nar').notNull(),
  password_hash: text('password_hash').notNull(),
  token: text('token'),
  token_expires: text('token_expires'),
  is_email_verified: integer('is_email_verified').notNull(),
  is_online: integer('is_online').notNull(),
  created_at: text('created_at').notNull(),
  update_at: text('update_at').notNull(),
  profile_image: text('profile_image').notNull(),
});

export const artist = sqliteTable('artist', {
  id: integer('id', { mode: 'autoIncrement' }).primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(), // RAVE/SOUND
  photo_url: text('photo_url').notNull(),
  bio_cz: text('bio_cz').notNull(),
  bio_en: text('bio_en').notNull(),
  instagram_url: text('instagram_url'),
});

export const event = sqliteTable('event', {
  id: integer('id', { mode: 'autoIncrement' }).primaryKey(),
  title_cz: text('title_cz').notNull(),
  title_en: text('title_en'),
  date: text('date').notNull(),
  location: text('location').notNull(),
  location_url: text('location_url').notNull(),
  poster_url: text('poster_url'),
  description_cz: text('description_cz'),
  description_en: text('description_en'),
  ticket_url: text('ticket_url'),
});

export const lineup = sqliteTable('lineup', {
  id: integer('id', { mode: 'autoIncrement' }).primaryKey(),
  event_id: integer('event_id').notNull(),
  artist_name: text('artist_name').notNull(),
  genre: text('genre'),
  time_range: text('time_range'),
});

export const sound_track = sqliteTable('sound_track', {
  id: integer('id', { mode: 'autoIncrement' }).primaryKey(),
  title: text('title').notNull(),
  soundcloud_url: text('soundcloud_url').notNull(),
});

export const gallery = sqliteTable('gallery', {
  id: integer('id', { mode: 'autoIncrement' }).primaryKey(),
  image_url: text('image_url').notNull(),
});


export const news = sqliteTable('news', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title_cz: text('title_cz').notNull(),
  title_en: text('title_en').notNull(),
  description_cz: text('description_cz').notNull(),
  description_en: text('description_en').notNull(),
  photo_url: text('photo_url').notNull(),
  created_at: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
});

export const schema = {
  user,
  artist,
  event,
  lineup,
  sound_track,
  gallery,
  news
};
