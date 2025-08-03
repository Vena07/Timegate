
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

// Funkce pro zpracování POST požadavků (vložení nového záznamu)
export async function POST({ request, params }) {
  const { table } = params; // Získání názvu tabulky z parametru
  const { data } = await request.json(); // Získání dat z požadavku
  const tableSchema = schema[table]; // Získání schématu tabulky z importu

  if (!tableSchema) {
    return json({ error: 'Table not found' }, { status: 404 });
  }

  try {
    // Vytvoření nového záznamu
    const createdRecord = await db.insert(tableSchema).values(data);
    return json(createdRecord, { status: 201 });
  } catch (error) {
    console.error(error);
    return json({ error: 'Database error' }, { status: 500 });
  }
}

// Funkce pro zpracování PUT požadavků (aktualizace záznamu)
export async function PUT({ request, params }) {
  const { table } = params; // Získání názvu tabulky z parametru
  const { id, data } = await request.json(); // Získání id a dat pro aktualizaci
  const tableSchema = schema[table]; // Získání schématu tabulky z importu

  if (!tableSchema) {
    return json({ error: 'Table not found' }, { status: 404 });
  }

  try {
    // Aktualizace záznamu podle ID
    const updatedRecord = await db.update(tableSchema)
      .set(data)
      .where(eq(tableSchema.id, id));  // Použití eq pro porovnání id
    return json(updatedRecord, { status: 200 });
  } catch (error) {
    console.error(error);
    return json({ error: 'Database error' }, { status: 500 });
  }
}

// Funkce pro zpracování DELETE požadavků (mazání záznamu)
export async function DELETE({ request, params }) {
  const { table } = params; // Získání názvu tabulky z parametru
  const { id } = await request.json(); // Získání id pro mazání
  const tableSchema = schema[table]; // Získání schématu tabulky z importu

  if (!tableSchema) {
    return json({ error: 'Table not found' }, { status: 404 });
  }

  try {
    // Mazání záznamu podle ID
    await db.delete(tableSchema).where(eq(tableSchema.id, id));  // Použití eq pro porovnání id
    return json({ message: 'Record deleted' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return json({ error: 'Database error' }, { status: 500 });
  }
}
