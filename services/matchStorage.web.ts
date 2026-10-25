import type { SportsMatch } from '../context/SportsContext';

const KEY = 'bora-matches-v1';
const ME = 'demo-me';

export async function loadMatches(): Promise<SportsMatch[] | null> {
  try {
    const value = window.localStorage.getItem(KEY);
    return value ? (JSON.parse(value) as SportsMatch[]) : null;
  } catch (error) {
    console.warn('Falha ao ler cache web', error);
    return null;
  }
}

export async function saveMatches(matches: SportsMatch[]): Promise<void> {
  try {
    const selected = matches.filter(m => m.organizerId === ME || m.requests.some(r => r.userId === ME && (r.status === 'pending' || r.status === 'accepted')));
    window.localStorage.setItem(KEY, JSON.stringify(selected));
  } catch (error) {
    console.warn('Falha ao salvar cache web', error);
  }
}
