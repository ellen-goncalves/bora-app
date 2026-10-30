/** Atividades realizadas presencialmente. Mantenha as opções centralizadas aqui. */
export const MODALITY_CATEGORIES = {
  'Esportes': ['Futebol', 'Futsal', 'Futebol society', 'Vôlei', 'Vôlei de praia', 'Basquete', 'Handebol', 'Tênis', 'Tênis de mesa', 'Beach tennis', 'Badminton', 'Peteca', 'Queimada', 'Rugby', 'Futevôlei', 'Altinha', 'Natação', 'Ciclismo', 'Corrida', 'Caminhada', 'Skate', 'Patins', 'Escalada', 'Artes marciais'],
  'Jogos de tabuleiro': ['Xadrez', 'Damas', 'Dominó', 'Catan', 'Ticket to Ride', 'War', 'Banco Imobiliário', 'Detetive', 'Carcassonne', 'Dixit', 'Azul', 'Splendor', '7 Wonders', 'Pandemic', 'Jenga', 'RPG de mesa', 'Go', 'Gamão', 'Ludo', 'Perfil'],
  'Jogos de cartas': ['Uno', 'Truco', 'Buraco', 'Canastra', 'Cacheta', 'Pife', 'Pôquer recreativo', 'Bridge', 'Copas', 'Sueca', 'Magic: The Gathering', 'Yu-Gi-Oh!', 'Pokémon TCG', 'Dobble', 'Exploding Kittens'],
  'Jogos de salão': ['Sinuca', 'Bilhar', 'Pebolim', 'Dardos', 'Boliche', 'Bocha', 'Air hockey', 'Totó'],
  'Dança e movimento': ['Forró', 'Samba de gafieira', 'Zouk', 'Salsa', 'Bachata', 'Dança de salão', 'FitDance', 'Capoeira', 'Yoga em grupo', 'Pilates em grupo'],
  'Ao ar livre': ['Trilha', 'Passeio de bicicleta', 'Caminhada em grupo', 'Corrida em grupo', 'Slackline', 'Caça ao tesouro', 'Piquenique com jogos', 'Orientação esportiva'],
} as const;
export type ModalityCategory = keyof typeof MODALITY_CATEGORIES;
export const ALL_MODALITIES: string[] = Object.values(MODALITY_CATEGORIES).flatMap(items => [...items]);
export function categoryForModality(modality: string): ModalityCategory | undefined {
  return (Object.keys(MODALITY_CATEGORIES) as ModalityCategory[]).find(category =>
    (MODALITY_CATEGORIES[category] as readonly string[]).includes(modality));
}
