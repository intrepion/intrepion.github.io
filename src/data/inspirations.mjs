import { slugify } from './genres.mjs';
// Combine only known names for the same original game.
export const aliases = {
  'Diablo 2 Lord Of Destruction': 'Diablo II: Lord of Destruction', 'Diablo II Lord Of Destruction': 'Diablo II: Lord of Destruction',
  'Final Fantasy 10': 'Final Fantasy X',
  'The Legend Of Zelda Breath Of The Wild': 'The Legend of Zelda: Breath of the Wild', 'Legend Of Zelda Breath Of The Wild': 'The Legend of Zelda: Breath of the Wild', 'Breath Of The Wild': 'The Legend of Zelda: Breath of the Wild', 'The Legend Of Zelda Breath Of The While': 'The Legend of Zelda: Breath of the Wild',
  'Oregon Trail': 'The Oregon Trail',
};
export const canonicalInspiration = name => aliases[name] || name;
export const inspirationSlug = name => slugify(canonicalInspiration(name).normalize('NFKD').replace(/[\u0300-\u036f]/g, ''));
export function groupInspirations(games) {
  const groups = new Map();
  for (const game of games.filter(game => game.play)) {
    const name = canonicalInspiration(game.inspiration);
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push(game);
  }
  return [...groups].map(([name, games]) => ({name, slug: inspirationSlug(name), games})).sort((a,b) => a.name.localeCompare(b.name));
}
