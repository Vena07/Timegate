
// src/routes/api/[table]/+server.js

import { db } from '$lib/server/db'; // Tvůj klient s Drizzle ORM
import * as schema from '$lib/server/db/schema'; // Import všech tabulek
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

// Funkce pro zpracování GET požadavků
export async function GET({ params }) {
  const { table } = params; // Získání názvu tabulky z parametru
  const tableSchema = schema[table]; // Získání schématu tabulky z importu
  
  if (!tableSchema) {
    return json({ error: 'Table not found' }, { status: 404 });
  }

  try {
    // Načtení všech záznamů z tabulky
    const records = await db.select().from(tableSchema);
    return json(records, { status: 200 });
  } catch (error) {
    console.error(error);
    return json({ error: 'Database error' }, { status: 500 });
  }
}
