
export interface Player {
  name: string;
  team: string;
  position: string;
  sport: 'NBA' | 'NFL' | 'MLB' | 'NHL';
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
  { name: 'Anthony Davis', team: 'Los Angeles Lakers', position: 'PF', sport: 'NBA', teamSubreddit: 'lakers' },
  { name: 'Shai Gilgeous-Alexander', team: 'Oklahoma City Thunder', position: 'PG', sport: 'NBA', teamSubreddit: 'thunder' },
  { name: 'Anthony Edwards', team: 'Minnesota Timberwolves', position: 'SG', sport: 'NBA', teamSubreddit: 'timberwolves' },
  { name: 'Donovan Mitchell', team: 'Cleveland Cavaliers', position: 'SG', sport: 'NBA', teamSubreddit: 'clevelandcavs' },
  { name: 'Damian Lillard', team: 'Milwaukee Bucks', position: 'PG', sport: 'NBA', teamSubreddit: 'mkebucks' },
  { name: 'Ja Morant', team: 'Memphis Grizzlies', position: 'PG', sport: 'NBA', teamSubreddit: 'memphisgrizzlies' },
  { name: 'Victor Wembanyama', team: 'San Antonio Spurs', position: 'C', sport: 'NBA', teamSubreddit: 'nbaspurs' },
  { name: 'Jaylen Brown', team: 'Boston Celtics', position: 'SG', sport: 'NBA', teamSubreddit: 'bostonceltics' },
  { name: 'Devin Booker', team: 'Phoenix Suns', position: 'SG', sport: 'NBA', teamSubreddit: 'suns' },
  { name: 'Jimmy Butler', team: 'Miami Heat', position: 'SF', sport: 'NBA', teamSubreddit: 'heat' },
  { name: 'Trae Young', team: 'Atlanta Hawks', position: 'PG', sport: 'NBA', teamSubreddit: 'atlantahawks' },
  { name: 'Jalen Brunson', team: 'New York Knicks', position: 'PG', sport: 'NBA', teamSubreddit: 'nyknicks' },
  { name: 'Zion Williamson', team: 'New Orleans Pelicans', position: 'PF', sport: 'NBA', teamSubreddit: 'nolapelicans' },
  { name: 'Tyrese Haliburton', team: 'Indiana Pacers', position: 'PG', sport: 'NBA', teamSubreddit: 'pacers' },
  { name: 'Darius Garland', team: 'Cleveland Cavaliers', position: 'PG', sport: 'NBA', teamSubreddit: 'clevelandcavs' },
  { name: 'De'Aaron Fox', team: 'Sacramento Kings', position: 'PG', sport: 'NBA', teamSubreddit: 'kings' },
  { name: 'Bam Adebayo', team: 'Miami Heat', position: 'C', sport: 'NBA', teamSubreddit: 'heat' },
  { name: 'Tyrese Maxey', team: 'Philadelphia 76ers', position: 'PG', sport: 'NBA', teamSubreddit: 'sixers' },
  { name: 'Karl-Anthony Towns', team: 'Minnesota Timberwolves', position: 'C', sport: 'NBA', teamSubreddit: 'timberwolves' },
  { name: 'LaMelo Ball', team: 'Charlotte Hornets', position: 'PG', sport: 'NBA', teamSubreddit: 'charlottehornets' },
  
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
  { name: 'Travis Kelce', team: 'Kansas City Chiefs', position: 'TE', sport: 'NFL', teamSubreddit: 'kansascitychiefs' },
  { name: 'Tyreek Hill', team: 'Miami Dolphins', position: 'WR', sport: 'NFL', teamSubreddit: 'miamidolphins' },
  { name: 'Justin Jefferson', team: 'Minnesota Vikings', position: 'WR', sport: 'NFL', teamSubreddit: 'minnesotavikings' },
  { name: 'CeeDee Lamb', team: 'Dallas Cowboys', position: 'WR', sport: 'NFL', teamSubreddit: 'cowboys' },
  { name: 'Ja'Marr Chase', team: 'Cincinnati Bengals', position: 'WR', sport: 'NFL', teamSubreddit: 'bengals' },
  { name: 'Brock Purdy', team: 'San Francisco 49ers', position: 'QB', sport: 'NFL', teamSubreddit: '49ers' },
  { name: 'Jalen Hurts', team: 'Philadelphia Eagles', position: 'QB', sport: 'NFL', teamSubreddit: 'eagles' },
  { name: 'Myles Garrett', team: 'Cleveland Browns', position: 'DE', sport: 'NFL', teamSubreddit: 'browns' },
  { name: 'T.J. Watt', team: 'Pittsburgh Steelers', position: 'OLB', sport: 'NFL', teamSubreddit: 'steelers' },
  { name: 'Baker Mayfield', team: 'Tampa Bay Buccaneers', position: 'QB', sport: 'NFL', teamSubreddit: 'buccaneers' },
  { name: 'Derrick Henry', team: 'Baltimore Ravens', position: 'RB', sport: 'NFL', teamSubreddit: 'ravens' },
  { name: 'Saquon Barkley', team: 'Philadelphia Eagles', position: 'RB', sport: 'NFL', teamSubreddit: 'eagles' },
  { name: 'Nick Chubb', team: 'Cleveland Browns', position: 'RB', sport: 'NFL', teamSubreddit: 'browns' },
  { name: 'Micah Parsons', team: 'Dallas Cowboys', position: 'LB', sport: 'NFL', teamSubreddit: 'cowboys' },
  { name: 'George Kittle', team: 'San Francisco 49ers', position: 'TE', sport: 'NFL', teamSubreddit: '49ers' },
  { name: 'Cooper Kupp', team: 'Los Angeles Rams', position: 'WR', sport: 'NFL', teamSubreddit: 'losangelesrams' },
  { name: 'Davante Adams', team: 'Las Vegas Raiders', position: 'WR', sport: 'NFL', teamSubreddit: 'raiders' },
  { name: 'Stefon Diggs', team: 'Houston Texans', position: 'WR', sport: 'NFL', teamSubreddit: 'texans' },
  { name: 'Aaron Donald', team: 'Los Angeles Rams', position: 'DT', sport: 'NFL', teamSubreddit: 'losangelesrams' },
  { name: 'C.J. Stroud', team: 'Houston Texans', position: 'QB', sport: 'NFL', teamSubreddit: 'texans' },
  
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
  { name: 'Freddie Freeman', team: 'Los Angeles Dodgers', position: '1B', sport: 'MLB', teamSubreddit: 'dodgers' },
  { name: 'Bryce Harper', team: 'Philadelphia Phillies', position: '1B', sport: 'MLB', teamSubreddit: 'phillies' },
  { name: 'Trea Turner', team: 'Philadelphia Phillies', position: 'SS', sport: 'MLB', teamSubreddit: 'phillies' },
  { name: 'Yordan Alvarez', team: 'Houston Astros', position: 'DH', sport: 'MLB', teamSubreddit: 'astros' },
  { name: 'Bobby Witt Jr.', team: 'Kansas City Royals', position: 'SS', sport: 'MLB', teamSubreddit: 'kcroyals' },
  { name: 'Gunnar Henderson', team: 'Baltimore Orioles', position: 'SS', sport: 'MLB', teamSubreddit: 'orioles' },
  { name: 'José Ramírez', team: 'Cleveland Guardians', position: '3B', sport: 'MLB', teamSubreddit: 'clevelandguardians' },
  { name: 'Corbin Burnes', team: 'Baltimore Orioles', position: 'P', sport: 'MLB', teamSubreddit: 'orioles' },
  { name: 'Gerrit Cole', team: 'New York Yankees', position: 'P', sport: 'MLB', teamSubreddit: 'nyyankees' },
  { name: 'Spencer Strider', team: 'Atlanta Braves', position: 'P', sport: 'MLB', teamSubreddit: 'braves' },
  { name: 'Zack Wheeler', team: 'Philadelphia Phillies', position: 'P', sport: 'MLB', teamSubreddit: 'phillies' },
  { name: 'Matt Olson', team: 'Atlanta Braves', position: '1B', sport: 'MLB', teamSubreddit: 'braves' },
  { name: 'Kyle Tucker', team: 'Houston Astros', position: 'OF', sport: 'MLB', teamSubreddit: 'astros' },
  { name: 'Julio Rodríguez', team: 'Seattle Mariners', position: 'OF', sport: 'MLB', teamSubreddit: 'mariners' },
  { name: 'José Altuve', team: 'Houston Astros', position: '2B', sport: 'MLB', teamSubreddit: 'astros' },
  { name: 'Corey Seager', team: 'Texas Rangers', position: 'SS', sport: 'MLB', teamSubreddit: 'texasrangers' },
  { name: 'Pete Alonso', team: 'New York Mets', position: '1B', sport: 'MLB', teamSubreddit: 'newyorkmets' },
  { name: 'Austin Riley', team: 'Atlanta Braves', position: '3B', sport: 'MLB', teamSubreddit: 'braves' },
  { name: 'Rafael Devers', team: 'Boston Red Sox', position: '3B', sport: 'MLB', teamSubreddit: 'redsox' },
  { name: 'Marcus Semien', team: 'Texas Rangers', position: '2B', sport: 'MLB', teamSubreddit: 'texasrangers' },
  { name: 'Manny Machado', team: 'San Diego Padres', position: '3B', sport: 'MLB', teamSubreddit: 'padres' },
  
  // NHL Players
  { name: 'Connor McDavid', team: 'Edmonton Oilers', position: 'C', sport: 'NHL', teamSubreddit: 'edmontonoilers' },
  { name: 'Nathan MacKinnon', team: 'Colorado Avalanche', position: 'C', sport: 'NHL', teamSubreddit: 'coloradoavalanche' },
  { name: 'Leon Draisaitl', team: 'Edmonton Oilers', position: 'C', sport: 'NHL', teamSubreddit: 'edmontonoilers' },
  { name: 'Auston Matthews', team: 'Toronto Maple Leafs', position: 'C', sport: 'NHL', teamSubreddit: 'leafs' },
  { name: 'Nikita Kucherov', team: 'Tampa Bay Lightning', position: 'RW', sport: 'NHL', teamSubreddit: 'tampabaylightning' },
  { name: 'David Pastrnak', team: 'Boston Bruins', position: 'RW', sport: 'NHL', teamSubreddit: 'bostonbruins' },
  { name: 'Cale Makar', team: 'Colorado Avalanche', position: 'D', sport: 'NHL', teamSubreddit: 'coloradoavalanche' },
  { name: 'Artemi Panarin', team: 'New York Rangers', position: 'LW', sport: 'NHL', teamSubreddit: 'rangers' },
  { name: 'Matthew Tkachuk', team: 'Florida Panthers', position: 'LW', sport: 'NHL', teamSubreddit: 'floridapanthers' },
  { name: 'Sidney Crosby', team: 'Pittsburgh Penguins', position: 'C', sport: 'NHL', teamSubreddit: 'penguins' },
  { name: 'Alexander Ovechkin', team: 'Washington Capitals', position: 'LW', sport: 'NHL', teamSubreddit: 'caps' },
  { name: 'Jack Hughes', team: 'New Jersey Devils', position: 'C', sport: 'NHL', teamSubreddit: 'devils' },
  { name: 'Kirill Kaprizov', team: 'Minnesota Wild', position: 'LW', sport: 'NHL', teamSubreddit: 'wildhockey' },
  { name: 'Mikko Rantanen', team: 'Colorado Avalanche', position: 'RW', sport: 'NHL', teamSubreddit: 'coloradoavalanche' },
  { name: 'Brady Tkachuk', team: 'Ottawa Senators', position: 'LW', sport: 'NHL', teamSubreddit: 'ottawasenators' },
  { name: 'Igor Shesterkin', team: 'New York Rangers', position: 'G', sport: 'NHL', teamSubreddit: 'rangers' },
  { name: 'Victor Hedman', team: 'Tampa Bay Lightning', position: 'D', sport: 'NHL', teamSubreddit: 'tampabaylightning' },
  { name: 'Mitch Marner', team: 'Toronto Maple Leafs', position: 'RW', sport: 'NHL', teamSubreddit: 'leafs' },
  { name: 'Adam Fox', team: 'New York Rangers', position: 'D', sport: 'NHL', teamSubreddit: 'rangers' },
  { name: 'Steven Stamkos', team: 'Tampa Bay Lightning', position: 'C', sport: 'NHL', teamSubreddit: 'tampabaylightning' },
  { name: 'Roman Josi', team: 'Nashville Predators', position: 'D', sport: 'NHL', teamSubreddit: 'predators' },
  { name: 'Tim Stützle', team: 'Ottawa Senators', position: 'C', sport: 'NHL', teamSubreddit: 'ottawasenators' },
  { name: 'Aleksander Barkov', team: 'Florida Panthers', position: 'C', sport: 'NHL', teamSubreddit: 'floridapanthers' },
  { name: 'Elias Pettersson', team: 'Vancouver Canucks', position: 'C', sport: 'NHL', teamSubreddit: 'canucks' },
  { name: 'Brayden Point', team: 'Tampa Bay Lightning', position: 'C', sport: 'NHL', teamSubreddit: 'tampabaylightning' },
  { name: 'Quinn Hughes', team: 'Vancouver Canucks', position: 'D', sport: 'NHL', teamSubreddit: 'canucks' },
  { name: 'Mika Zibanejad', team: 'New York Rangers', position: 'C', sport: 'NHL', teamSubreddit: 'rangers' },
  { name: 'William Nylander', team: 'Toronto Maple Leafs', position: 'RW', sport: 'NHL', teamSubreddit: 'leafs' },
  { name: 'Brad Marchand', team: 'Boston Bruins', position: 'LW', sport: 'NHL', teamSubreddit: 'bostonbruins' },
  { name: 'Andrei Vasilevskiy', team: 'Tampa Bay Lightning', position: 'G', sport: 'NHL', teamSubreddit: 'tampabaylightning' }
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
