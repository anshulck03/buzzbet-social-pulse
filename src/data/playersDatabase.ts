
export interface Player {
  name: string;
  team: string;
  position: string;
  sport: 'NBA' | 'NFL' | 'MLB';
  teamSubreddit?: string;
}

export const PLAYERS_DATABASE: Player[] = [
  // NBA Players
  { name: 'LeBron James', team: 'Los Angeles Lakers', position: 'SF', sport: 'NBA', teamSubreddit: 'lakers' },
  { name: 'Stephen Curry', team: 'Golden State Warriors', position: 'PG', sport: 'NBA', teamSubreddit: 'warriors' },
  { name: 'Kevin Durant', team: 'Phoenix Suns', position: 'SF', sport: 'NBA', teamSubreddit: 'suns' },
  { name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', position: 'PF', sport: 'NBA', teamSubreddit: 'mkebucks' },
  { name: 'Luka Doncic', team: 'Dallas Mavericks', position: 'PG', sport: 'NBA', teamSubreddit: 'mavericks' },
  { name: 'Jayson Tatum', team: 'Boston Celtics', position: 'SF', sport: 'NBA', teamSubreddit: 'bostonceltics' },
  { name: 'Nikola Jokic', team: 'Denver Nuggets', position: 'C', sport: 'NBA', teamSubreddit: 'denvernuggets' },
  { name: 'Joel Embiid', team: 'Philadelphia 76ers', position: 'C', sport: 'NBA', teamSubreddit: 'sixers' },
  { name: 'Kawhi Leonard', team: 'LA Clippers', position: 'SF', sport: 'NBA', teamSubreddit: 'laclippers' },
  { name: 'Paul George', team: 'LA Clippers', position: 'SF', sport: 'NBA', teamSubreddit: 'laclippers' },
  
  // NFL Players
  { name: 'Josh Allen', team: 'Buffalo Bills', position: 'QB', sport: 'NFL', teamSubreddit: 'buffalobills' },
  { name: 'Patrick Mahomes', team: 'Kansas City Chiefs', position: 'QB', sport: 'NFL', teamSubreddit: 'kansascitychiefs' },
  { name: 'Lamar Jackson', team: 'Baltimore Ravens', position: 'QB', sport: 'NFL', teamSubreddit: 'ravens' },
  { name: 'Aaron Rodgers', team: 'New York Jets', position: 'QB', sport: 'NFL', teamSubreddit: 'nyjets' },
  { name: 'Dak Prescott', team: 'Dallas Cowboys', position: 'QB', sport: 'NFL', teamSubreddit: 'cowboys' },
  { name: 'Tua Tagovailoa', team: 'Miami Dolphins', position: 'QB', sport: 'NFL', teamSubreddit: 'miamidolphins' },
  { name: 'Joe Burrow', team: 'Cincinnati Bengals', position: 'QB', sport: 'NFL', teamSubreddit: 'bengals' },
  { name: 'Justin Herbert', team: 'Los Angeles Chargers', position: 'QB', sport: 'NFL', teamSubreddit: 'chargers' },
  { name: 'Geno Smith', team: 'Seattle Seahawks', position: 'QB', sport: 'NFL', teamSubreddit: 'seahawks' },
  { name: 'Christian McCaffrey', team: 'San Francisco 49ers', position: 'RB', sport: 'NFL', teamSubreddit: '49ers' },
  
  // MLB Players
  { name: 'Mike Trout', team: 'Los Angeles Angels', position: 'OF', sport: 'MLB', teamSubreddit: 'angelsbaseball' },
  { name: 'Mookie Betts', team: 'Los Angeles Dodgers', position: 'OF', sport: 'MLB', teamSubreddit: 'dodgers' },
  { name: 'Aaron Judge', team: 'New York Yankees', position: 'OF', sport: 'MLB', teamSubreddit: 'nyyankees' },
  { name: 'Ronald Acuña Jr.', team: 'Atlanta Braves', position: 'OF', sport: 'MLB', teamSubreddit: 'braves' },
  { name: 'Juan Soto', team: 'New York Yankees', position: 'OF', sport: 'MLB', teamSubreddit: 'nyyankees' },
  { name: 'Fernando Tatis Jr.', team: 'San Diego Padres', position: 'SS', sport: 'MLB', teamSubreddit: 'padres' },
  { name: 'Vladimir Guerrero Jr.', team: 'Toronto Blue Jays', position: '1B', sport: 'MLB', teamSubreddit: 'torontobluejays' },
  { name: 'Shohei Ohtani', team: 'Los Angeles Dodgers', position: 'DH/P', sport: 'MLB', teamSubreddit: 'dodgers' },
  { name: 'Francisco Lindor', team: 'New York Mets', position: 'SS', sport: 'MLB', teamSubreddit: 'newyorkmets' },
  { name: 'Freddie Freeman', team: 'Los Angeles Dodgers', position: '1B', sport: 'MLB', teamSubreddit: 'dodgers' }
];

export function searchPlayers(query: string): Player[] {
  if (query.length < 2) return [];
  
  const searchTerm = query.toLowerCase();
  return PLAYERS_DATABASE.filter(player =>
    player.name.toLowerCase().includes(searchTerm) ||
    player.team.toLowerCase().includes(searchTerm)
  ).slice(0, 8); // Limit to 8 suggestions
}

export function getPlayerByName(name: string): Player | undefined {
  return PLAYERS_DATABASE.find(player => 
    player.name.toLowerCase() === name.toLowerCase()
  );
}
