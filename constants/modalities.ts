/** Modalidades exclusivamente presenciais. */
export const MODALITY_CATEGORIES = {
  'Esportes': ['Futebol', 'Futsal', 'Vôlei', 'Basquete', 'Tênis', 'Beach tennis', 'Caminhada', 'Corrida', 'Badminton', 'Handebol'],
  'Jogos de tabuleiro': ['Xadrez', 'Damas', 'Dominó', 'Banco Imobiliário', 'Catan', 'Ticket to Ride', 'War', 'RPG de mesa'],
  'Jogos de cartas': ['Uno', 'Truco', 'Buraco', 'Canastra', 'Poker recreativo', 'Magic: The Gathering', 'Yu-Gi-Oh!'],
} as const;
export type ModalityCategory = keyof typeof MODALITY_CATEGORIES;
export const ALL_MODALITIES: string[] = Object.values(MODALITY_CATEGORIES).flatMap(items => [...items]);
export function categoryForModality(modality: string): ModalityCategory | undefined {
  return (Object.keys(MODALITY_CATEGORIES) as ModalityCategory[]).find(category =>
    (MODALITY_CATEGORIES[category] as readonly string[]).includes(modality));
}
