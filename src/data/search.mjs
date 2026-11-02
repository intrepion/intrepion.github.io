import {slugify} from './genres.mjs';
import {groupInspirations} from './inspirations.mjs';
export function makeSearchIndex(games, genres) {
 const playable = games.filter(game => game.play);
 return [
  ...genres.map(name => ({type:'Genre', title:name, detail:'Browse genre', href:`/genres/${slugify(name)}/`, search:name})),
  ...groupInspirations(games).map(group => ({type:'Inspiration', title:group.name, detail:`${group.games.length} ${group.games.length === 1 ? 'experiment' : 'experiments'}`, href:`/inspirations/${group.slug}/`, search:group.name})),
  ...playable.map(game => ({type:'Game', title:game.title, detail:`${game.edition} · Inspired by ${game.inspiration}`, href:`/games/${game.id}/`, search:`${game.title} ${game.edition}`})),
 ];
}
export function matchesSearch(text, query) {
 const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
 return words.length > 0 && words.every(word => text.toLocaleLowerCase().includes(word));
}
