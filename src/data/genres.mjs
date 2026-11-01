/** @type {Record<string, string[]>} */
export const genreDetails = {
  'Action': ['Quick reflexes, big energy.', '01'],
  'Adventure': ['Take the scenic route.', '02'],
  'Arcade': ['Just one more round.', '03'],
  'Board & card': ['Pull up a chair.', '04'],
  'Party': ['Better together.', '05'],
  'Platformer': ['Find your next leap.', '06'],
  'Puzzle': ['A little food for thought.', '07'],
  'Racing & sports': ['Pick up the pace.', '08'],
  'Rhythm': ['Find your flow.', '09'],
  'Role-playing': ['Become someone new.', '10'],
  'Simulation & creative': ['Make a world your own.', '11'],
  'Strategy': ['Think a few moves ahead.', '12'],
};
export const slugify = name => name.toLowerCase().replaceAll('&', 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
