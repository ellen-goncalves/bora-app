import * as SQLite from 'expo-sqlite';
import type { SportsMatch } from '../context/SportsContext';

const ME = 'demo-me';
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function database(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) dbPromise = SQLite.openDatabaseAsync('bora.db');
  const db = await dbPromise;
  await db.execAsync('CREATE TABLE IF NOT EXISTS cache (key TEXT PRIMARY KEY, value TEXT NOT NULL)');
  return db;
}

export async function loadMatches(): Promise<SportsMatch[] | null> {
  try {
    const db = await database();
    const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM cache WHERE key = ?', 'matches');
    return row ? (JSON.parse(row.value) as SportsMatch[]) : null;
  } catch (error) {
    console.warn('Falha ao ler cache mobile', error);
    return null;
  }
}

export async function saveMatches(matches: SportsMatch[]): Promise<void> {
  try {
    const selected = matches.filter(m => m.organizerId === ME || m.requests.some(r => r.userId === ME && (r.status === 'pending' || r.status === 'accepted')));
    const db = await database();
    await db.runAsync('INSERT OR REPLACE INTO cache (key, value) VALUES (?, ?)', 'matches', JSON.stringify(selected));
  } catch (error) {
    console.warn('Falha ao salvar cache mobile', error);
  }
}
