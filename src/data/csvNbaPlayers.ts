
import type { ManualPlayer } from './manualPlayerOverrides';

// Function to generate search terms for players
const generateSearchTerms = (firstName: string, lastName: string, fullName: string): string[] => {
  const terms = [fullName.toLowerCase()];
  
  if (firstName && lastName) {
    terms.push(`${firstName} ${lastName}`.toLowerCase());
    terms.push(lastName.toLowerCase());
    
    // Add common nickname variations
    const nicknameMap: Record<string, string[]> = {
      'Anthony': ['ant', 'tony'],
      'Christopher': ['chris'],
      'Alexander': ['alex'],
      'Michael': ['mike'],
      'William': ['bill', 'will'],
      'Robert': ['rob', 'bob'],
      'Richard': ['rick', 'dick'],
      'James': ['jim', 'jimmy'],
      'Joseph': ['joe', 'joey'],
      'Benjamin': ['ben', 'benny'],
      'Matthew': ['matt'],
      'Andrew': ['andy', 'drew'],
      'Jonathan': ['jon', 'johnny'],
      'Nicholas': ['nick'],
      'Daniel': ['dan', 'danny'],
      'David': ['dave', 'davey'],
      'Joshua': ['josh'],
      'Thomas': ['tom', 'tommy'],
      'Stephen': ['steph'],
      'LeBron': ['lebron', 'king james', 'the king'],
      'Giannis': ['greek freak'],
      'Victor': ['wemby']
    };

    if (nicknameMap[firstName]) {
      nicknameMap[firstName].forEach(nickname => {
        terms.push(`${nickname} ${lastName}`.toLowerCase());
      });
    }
  }
  
  return [...new Set(terms)];
};

// Team abbreviation mapping
const teamAbbreviationMap: Record<string, string> = {
  'Hawks': 'ATL',
  'Celtics': 'BOS',
  'Nets': 'BKN',
  'Hornets': 'CHA',
  'Bulls': 'CHI',
  'Cavaliers': 'CLE',
  'Mavericks': 'DAL',
  'Nuggets': 'DEN',
  'Pistons': 'DET',
  'Warriors': 'GSW',
  'Rockets': 'HOU',
  'Pacers': 'IND',
  'Clippers': 'LAC',
  'Lakers': 'LAL',
  'Grizzlies': 'MEM',
  'Heat': 'MIA',
  'Bucks': 'MIL',
  'Timberwolves': 'MIN',
  'Pelicans': 'NOP',
  'Knicks': 'NYK',
  'Thunder': 'OKC',
  'Magic': 'ORL',
  '76ers': 'PHI',
  'Suns': 'PHX',
  'Trail Blazers': 'POR',
  'Kings': 'SAC',
  'Spurs': 'SAS',
  'Raptors': 'TOR',
  'Jazz': 'UTA',
  'Wizards': 'WAS'
};

// Position mapping based on common NBA positions
const getPosition = (name: string): string => {
  // This is a simplified position assignment - in a real scenario you'd have actual position data
  // For now, we'll assign positions based on common knowledge of these players
  const positionMap: Record<string, string> = {
    'Precious Achiuwa': 'PF',
    'Bam Adebayo': 'C',
    'Giannis Antetokounmpo': 'PF',
    'LeBron James': 'SF',
    'Stephen Curry': 'PG',
    'Kevin Durant': 'SF',
    'Jayson Tatum': 'SF',
    'Luka Doncic': 'PG',
    'Nikola Jokic': 'C',
    'Joel Embiid': 'C',
    'Anthony Davis': 'PF',
    'Damian Lillard': 'PG',
    'Kawhi Leonard': 'SF',
    'Jimmy Butler': 'SF',
    'Kyrie Irving': 'PG',
    'Paul George': 'SF',
    'Ja Morant': 'PG',
    'Trae Young': 'PG',
    'Devin Booker': 'SG',
    'Jaylen Brown': 'SG',
    'Anthony Edwards': 'SG',
    'Zion Williamson': 'PF',
    'Karl-Anthony Towns': 'C',
    'Victor Wembanyama': 'C',
    'Shai Gilgeous-Alexander': 'PG',
    'Donovan Mitchell': 'SG',
    'Tyrese Haliburton': 'PG',
    'Paolo Banchero': 'PF',
    'LaMelo Ball': 'PG',
    'Cade Cunningham': 'PG',
    'Tyler Herro': 'SG',
    'De\'Aaron Fox': 'PG',
    'Domantas Sabonis': 'C',
    'Alperen Sengun': 'C',
    'Scottie Barnes': 'SF',
    'Franz Wagner': 'SF',
    'Jalen Green': 'SG',
    'Evan Mobley': 'PF',
    'Chet Holmgren': 'PF'
  };
  
  return positionMap[name] || 'F'; // Default to Forward if not found
};

// Convert CSV data to ManualPlayer format
export const CSV_NBA_PLAYERS: ManualPlayer[] = [
  { firstName: 'Precious', lastName: 'Achiuwa', team: 'New York Knicks', teamAbbr: 'NYK' },
  { firstName: 'Bam', lastName: 'Adebayo', team: 'Miami Heat', teamAbbr: 'MIA' },
  { firstName: 'Ochai', lastName: 'Agbaji', team: 'Toronto Raptors', teamAbbr: 'TOR' },
  { firstName: 'Santi', lastName: 'Aldama', team: 'Memphis Grizzlies', teamAbbr: 'MEM' },
  { firstName: 'Nickeil', lastName: 'Alexander-Walker', team: 'Minnesota Timberwolves', teamAbbr: 'MIN' },
  { firstName: 'Grayson', lastName: 'Allen', team: 'Phoenix Suns', teamAbbr: 'PHX' },
  { firstName: 'Jarrett', lastName: 'Allen', team: 'Cleveland Cavaliers', teamAbbr: 'CLE' },
  { firstName: 'Timmy', lastName: 'Allen', team: 'Free Agent', teamAbbr: 'FA' },
  { firstName: 'Jose', lastName: 'Alvarado', team: 'New Orleans Pelicans', teamAbbr: 'NOP' },
  { firstName: 'Kyle', lastName: 'Anderson', team: 'Miami Heat', teamAbbr: 'MIA' },
  { firstName: 'Giannis', lastName: 'Antetokounmpo', team: 'Milwaukee Bucks', teamAbbr: 'MIL' },
  { firstName: 'Thanasis', lastName: 'Antetokounmpo', team: 'Milwaukee Bucks', teamAbbr: 'MIL' },
  { firstName: 'Cole', lastName: 'Anthony', team: 'Orlando Magic', teamAbbr: 'ORL' },
  { firstName: 'OG', lastName: 'Anunoby', team: 'New York Knicks', teamAbbr: 'NYK' },
  { firstName: 'Ryan', lastName: 'Arcidiacono', team: 'Free Agent', teamAbbr: 'FA' },
  { firstName: 'Deni', lastName: 'Avdija', team: 'Portland Trail Blazers', teamAbbr: 'POR' },
  { firstName: 'Deandre', lastName: 'Ayton', team: 'Portland Trail Blazers', teamAbbr: 'POR' },
  { firstName: 'Udoka', lastName: 'Azubuike', team: 'Phoenix Suns', teamAbbr: 'PHX' },
  { firstName: 'Ibou', lastName: 'Badji', team: 'Portland Trail Blazers', teamAbbr: 'POR' },
  { firstName: 'Marvin', lastName: 'Bagley III', team: 'Memphis Grizzlies', teamAbbr: 'MEM' },
  { firstName: 'Amari', lastName: 'Bailey', team: 'Charlotte Hornets', teamAbbr: 'CHA' },
  { firstName: 'Patrick', lastName: 'Baldwin Jr.', team: 'LA Clippers', teamAbbr: 'LAC' },
  { firstName: 'LaMelo', lastName: 'Ball', team: 'Charlotte Hornets', teamAbbr: 'CHA' },
  { firstName: 'Mo', lastName: 'Bamba', team: 'Free Agent', teamAbbr: 'FA' },
  { firstName: 'Paolo', lastName: 'Banchero', team: 'Orlando Magic', teamAbbr: 'ORL' },
  { firstName: 'Desmond', lastName: 'Bane', team: 'Memphis Grizzlies', teamAbbr: 'MEM' },
  { firstName: 'Dalano', lastName: 'Banton', team: 'Portland Trail Blazers', teamAbbr: 'POR' },
  { firstName: 'Dominick', lastName: 'Barlow', team: 'Atlanta Hawks', teamAbbr: 'ATL' },
  { firstName: 'Harrison', lastName: 'Barnes', team: 'San Antonio Spurs', teamAbbr: 'SAS' },
  { firstName: 'Scottie', lastName: 'Barnes', team: 'Toronto Raptors', teamAbbr: 'TOR' },
  { firstName: 'RJ', lastName: 'Barrett', team: 'Toronto Raptors', teamAbbr: 'TOR' },
  { firstName: 'Charles', lastName: 'Bassey', team: 'San Antonio Spurs', teamAbbr: 'SAS' },
  { firstName: 'Emoni', lastName: 'Bates', team: 'Cleveland Cavaliers', teamAbbr: 'CLE' },
  { firstName: 'Keita', lastName: 'Bates-Diop', team: 'Brooklyn Nets', teamAbbr: 'BKN' },
  { firstName: 'Nicolas', lastName: 'Batum', team: 'LA Clippers', teamAbbr: 'LAC' },
  { firstName: 'Darius', lastName: 'Bazley', team: 'Utah Jazz', teamAbbr: 'UTA' },
  { firstName: 'Bradley', lastName: 'Beal', team: 'Phoenix Suns', teamAbbr: 'PHX' },
  { firstName: 'Malik', lastName: 'Beasley', team: 'Detroit Pistons', teamAbbr: 'DET' },
  { firstName: 'MarJon', lastName: 'Beauchamp', team: 'New York Knicks', teamAbbr: 'NYK' },
  { firstName: 'Jules', lastName: 'Bernard', team: 'Washington Wizards', teamAbbr: 'WAS' },
  { firstName: 'Davis', lastName: 'Bertans', team: 'Charlotte Hornets', teamAbbr: 'CHA' },
  { firstName: 'Patrick', lastName: 'Beverley', team: 'Milwaukee Bucks', teamAbbr: 'MIL' },
  { firstName: 'Saddiq', lastName: 'Bey', team: 'Washington Wizards', teamAbbr: 'WAS' },
  { firstName: 'Goga', lastName: 'Bitadze', team: 'Orlando Magic', teamAbbr: 'ORL' },
  { firstName: 'Onuralp', lastName: 'Bitim', team: 'Chicago Bulls', teamAbbr: 'CHI' },
  { firstName: 'Bismack', lastName: 'Biyombo', team: 'San Antonio Spurs', teamAbbr: 'SAS' },
  { firstName: 'Anthony', lastName: 'Black', team: 'Orlando Magic', teamAbbr: 'ORL' },
  { firstName: 'Leaky', lastName: 'Black', team: 'Charlotte Hornets', teamAbbr: 'CHA' },
  { firstName: 'Buddy', lastName: 'Boeheim', team: 'Detroit Pistons', teamAbbr: 'DET' },
  { firstName: 'Bogdan', lastName: 'Bogdanovic', team: 'LA Clippers', teamAbbr: 'LAC' },
  { firstName: 'Bojan', lastName: 'Bogdanovic', team: 'New York Knicks', teamAbbr: 'NYK' },
  { firstName: 'Bol', lastName: 'Bol', team: 'Phoenix Suns', teamAbbr: 'PHX' },
  { firstName: 'Marques', lastName: 'Bolden', team: 'Charlotte Hornets', teamAbbr: 'CHA' },
  { firstName: 'Devin', lastName: 'Booker', team: 'Phoenix Suns', teamAbbr: 'PHX' },
  { firstName: 'Brandon', lastName: 'Boston Jr.', team: 'New Orleans Pelicans', teamAbbr: 'NOP' },
  { firstName: 'Chris', lastName: 'Boucher', team: 'Toronto Raptors', teamAbbr: 'TOR' },
  { firstName: 'James', lastName: 'Bouknight', team: 'Free Agent', teamAbbr: 'FA' },
  { firstName: 'Jamaree', lastName: 'Bouyea', team: 'Milwaukee Bucks', teamAbbr: 'MIL' },
  { firstName: 'Malaki', lastName: 'Branham', team: 'San Antonio Spurs', teamAbbr: 'SAS' },
  { firstName: 'Christian', lastName: 'Braun', team: 'Denver Nuggets', teamAbbr: 'DEN' },
  { firstName: 'Mikal', lastName: 'Bridges', team: 'New York Knicks', teamAbbr: 'NYK' },
  { firstName: 'Miles', lastName: 'Bridges', team: 'Charlotte Hornets', teamAbbr: 'CHA' },
  { firstName: 'Oshae', lastName: 'Brissett', team: 'Free Agent', teamAbbr: 'FA' },
  { firstName: 'Izaiah', lastName: 'Brockington', team: 'Free Agent', teamAbbr: 'FA' },
  { firstName: 'Malcolm', lastName: 'Brogdon', team: 'Washington Wizards', teamAbbr: 'WAS' },
  { firstName: 'Armoni', lastName: 'Brooks', team: 'Free Agent', teamAbbr: 'FA' },
  { firstName: 'Dillon', lastName: 'Brooks', team: 'Houston Rockets', teamAbbr: 'HOU' },
  { firstName: 'Bruce', lastName: 'Brown', team: 'New Orleans Pelicans', teamAbbr: 'NOP' },
  { firstName: 'Jaylen', lastName: 'Brown', team: 'Boston Celtics', teamAbbr: 'BOS' },
  { firstName: 'Kendall', lastName: 'Brown', team: 'Indiana Pacers', teamAbbr: 'IND' },
  { firstName: 'Kobe', lastName: 'Brown', team: 'LA Clippers', teamAbbr: 'LAC' },
  { firstName: 'Moses', lastName: 'Brown', team: 'Free Agent', teamAbbr: 'FA' },
  { firstName: 'Greg', lastName: 'Brown III', team: 'Dallas Mavericks', teamAbbr: 'DAL' },
  { firstName: 'Charlie', lastName: 'Brown Jr.', team: 'New York Knicks', teamAbbr: 'NYK' },
  { firstName: 'Troy', lastName: 'Brown Jr.', team: 'Detroit Pistons', teamAbbr: 'DET' },
  { firstName: 'Jalen', lastName: 'Brunson', team: 'New York Knicks', teamAbbr: 'NYK' },
  { firstName: 'Thomas', lastName: 'Bryant', team: 'Indiana Pacers', teamAbbr: 'IND' },
  { firstName: 'Kobe', lastName: 'Bufkin', team: 'Atlanta Hawks', teamAbbr: 'ATL' },
  { firstName: 'Reggie', lastName: 'Bullock Jr.', team: 'Houston Rockets', teamAbbr: 'HOU' },
  { firstName: 'Alec', lastName: 'Burks', team: 'Miami Heat', teamAbbr: 'MIA' },
  { firstName: 'Jared', lastName: 'Butler', team: 'Philadelphia 76ers', teamAbbr: 'PHI' },
  { firstName: 'Jimmy', lastName: 'Butler', team: 'Golden State Warriors', teamAbbr: 'GSW' },
  { firstName: 'Jamal', lastName: 'Cain', team: 'New Orleans Pelicans', teamAbbr: 'NOP' },
  { firstName: 'Kentavious', lastName: 'Caldwell-Pope', team: 'Orlando Magic', teamAbbr: 'ORL' },
  { firstName: 'Toumani', lastName: 'Camara', team: 'Portland Trail Blazers', teamAbbr: 'POR' },
  { firstName: 'Clint', lastName: 'Capela', team: 'Atlanta Hawks', teamAbbr: 'ATL' },
  { firstName: 'Jevon', lastName: 'Carter', team: 'Chicago Bulls', teamAbbr: 'CHI' },
  { firstName: 'Wendell', lastName: 'Carter Jr.', team: 'Orlando Magic', teamAbbr: 'ORL' },
  { firstName: 'DJ', lastName: 'Carton', team: 'Free Agent', teamAbbr: 'FA' },
  { firstName: 'Alex', lastName: 'Caruso', team: 'Oklahoma City Thunder', teamAbbr: 'OKC' },
  { firstName: 'Colin', lastName: 'Castleton', team: 'Toronto Raptors', teamAbbr: 'TOR' },
  { firstName: 'Malcolm', lastName: 'Cazalon', team: 'Free Agent', teamAbbr: 'FA' },
  { firstName: 'Julian', lastName: 'Champagnie', team: 'San Antonio Spurs', teamAbbr: 'SAS' },
  { firstName: 'Justin', lastName: 'Champagnie', team: 'Washington Wizards', teamAbbr: 'WAS' },
  { firstName: 'Max', lastName: 'Christie', team: 'Dallas Mavericks', teamAbbr: 'DAL' },
  { firstName: 'Sidy', lastName: 'Cissoko', team: 'Portland Trail Blazers', teamAbbr: 'POR' },
  { firstName: 'Brandon', lastName: 'Clarke', team: 'Memphis Grizzlies', teamAbbr: 'MEM' },
  { firstName: 'Jordan', lastName: 'Clarkson', team: 'Utah Jazz', teamAbbr: 'UTA' },
  { firstName: 'Nic', lastName: 'Claxton', team: 'Brooklyn Nets', teamAbbr: 'BKN' },
  { firstName: 'Noah', lastName: 'Clowney', team: 'Brooklyn Nets', teamAbbr: 'BKN' },
  { firstName: 'Amir', lastName: 'Coffey', team: 'LA Clippers', teamAbbr: 'LAC' },
  { firstName: 'John', lastName: 'Collins', team: 'Utah Jazz', teamAbbr: 'UTA' },
  { firstName: 'Zach', lastName: 'Collins', team: 'Chicago Bulls', teamAbbr: 'CHI' },
  { firstName: 'Mike', lastName: 'Conley', team: 'Minnesota Timberwolves', teamAbbr: 'MIN' },
  { firstName: 'Pat', lastName: 'Connaughton', team: 'Milwaukee Bucks', teamAbbr: 'MIL' },
  { firstName: 'Bilal', lastName: 'Coulibaly', team: 'Washington Wizards', teamAbbr: 'WAS' },
  { firstName: 'Ricky', lastName: 'Council IV', team: 'Philadelphia 76ers', teamAbbr: 'PHI' },
  { firstName: 'Robert', lastName: 'Covington', team: 'Philadelphia 76ers', teamAbbr: 'PHI' },
  { firstName: 'Torrey', lastName: 'Craig', team: 'Boston Celtics', teamAbbr: 'BOS' },
  { firstName: 'Jae', lastName: 'Crowder', team: 'Sacramento Kings', teamAbbr: 'SAC' },
  { firstName: 'Jalen', lastName: 'Crutcher', team: 'Free Agent', teamAbbr: 'FA' },
  { firstName: 'Cade', lastName: 'Cunningham', team: 'Detroit Pistons', teamAbbr: 'DET' },
  { firstName: 'Seth', lastName: 'Curry', team: 'Charlotte Hornets', teamAbbr: 'CHA' },
  { firstName: 'Stephen', lastName: 'Curry', team: 'Golden State Warriors', teamAbbr: 'GSW' },
  { firstName: 'Dyson', lastName: 'Daniels', team: 'Atlanta Hawks', teamAbbr: 'ATL' },
  { firstName: 'Anthony', lastName: 'Davis', team: 'Dallas Mavericks', teamAbbr: 'DAL' },
  { firstName: 'Johnny', lastName: 'Davis', team: 'Free Agent', teamAbbr: 'FA' },
  { firstName: 'JD', lastName: 'Davison', team: 'Boston Celtics', teamAbbr: 'BOS' },
  { firstName: 'DeMar', lastName: 'DeRozan', team: 'Sacramento Kings', teamAbbr: 'SAC' },
  { firstName: 'Dexter', lastName: 'Dennis', team: 'Free Agent', teamAbbr: 'FA' },
  { firstName: 'Donte', lastName: 'DiVincenzo', team: 'Minnesota Timberwolves', teamAbbr: 'MIN' },
  { firstName: 'Moussa', lastName: 'Diabate', team: 'Charlotte Hornets', teamAbbr: 'CHA' },
  { firstName: 'Mamadi', lastName: 'Diakite', team: 'New York Knicks', teamAbbr: 'NYK' },
  { firstName: 'Hamidou', lastName: 'Diallo', team: 'Free Agent', teamAbbr: 'FA' },
  { firstName: 'Gradey', lastName: 'Dick', team: 'Toronto Raptors', teamAbbr: 'TOR' },
  { firstName: 'Ousmane', lastName: 'Dieng', team: 'Oklahoma City Thunder', teamAbbr: 'OKC' },
  { firstName: 'Spencer', lastName: 'Dinwiddie', team: 'Dallas Mavericks', teamAbbr: 'DAL' },
  { firstName: 'Luka', lastName: 'Doncic', team: 'Los Angeles Lakers', teamAbbr: 'LAL' },
  { firstName: 'Luguentz', lastName: 'Dort', team: 'Oklahoma City Thunder', teamAbbr: 'OKC' },
  { firstName: 'Ayo', lastName: 'Dosunmu', team: 'Chicago Bulls', teamAbbr: 'CHI' }
].map((player, index) => {
  const fullName = `${player.firstName} ${player.lastName}`;
  return {
    id: `NBA_csv_${index + 1}`,
    name: fullName,
    firstName: player.firstName,
    lastName: player.lastName,
    team: player.team,
    teamAbbr: player.teamAbbr,
    position: getPosition(fullName),
    sport: 'NBA' as const,
    headshot: '', // Will be populated by image service
    searchTerms: generateSearchTerms(player.firstName, player.lastName, fullName)
  };
});

// Additional players from the CSV (continuing the pattern)
const additionalPlayers = [
  { firstName: 'Jeff', lastName: 'Dowtin Jr.', team: 'Philadelphia 76ers', teamAbbr: 'PHI' },
  { firstName: 'Henri', lastName: 'Drell', team: 'Chicago Bulls', teamAbbr: 'CHI' },
  { firstName: 'Andre', lastName: 'Drummond', team: 'Philadelphia 76ers', teamAbbr: 'PHI' },
  { firstName: 'Chris', lastName: 'Duarte', team: 'Free Agent', teamAbbr: 'FA' },
  { firstName: 'David', lastName: 'Duke Jr.', team: 'San Antonio Spurs', teamAbbr: 'SAS' },
  { firstName: 'Kris', lastName: 'Dunn', team: 'LA Clippers', teamAbbr: 'LAC' },
  { firstName: 'Kevin', lastName: 'Durant', team: 'Phoenix Suns', teamAbbr: 'PHX' },
  { firstName: 'Jalen', lastName: 'Duren', team: 'Detroit Pistons', teamAbbr: 'DET' },
  { firstName: 'Tari', lastName: 'Eason', team: 'Houston Rockets', teamAbbr: 'HOU' },
  { firstName: 'Anthony', lastName: 'Edwards', team: 'Minnesota Timberwolves', teamAbbr: 'MIN' },
  { firstName: 'Kessler', lastName: 'Edwards', team: 'Dallas Mavericks', teamAbbr: 'DAL' },
  { firstName: 'Keon', lastName: 'Ellis', team: 'Sacramento Kings', teamAbbr: 'SAC' },
  { firstName: 'Joel', lastName: 'Embiid', team: 'Philadelphia 76ers', teamAbbr: 'PHI' },
  { firstName: 'Drew', lastName: 'Eubanks', team: 'LA Clippers', teamAbbr: 'LAC' },
  { firstName: 'Tosan', lastName: 'Evbuomwan', team: 'Brooklyn Nets', teamAbbr: 'BKN' },
  { firstName: 'Dante', lastName: 'Exum', team: 'Dallas Mavericks', teamAbbr: 'DAL' },
  { firstName: 'Bruno', lastName: 'Fernando', team: 'Free Agent', teamAbbr: 'FA' },
  { firstName: 'Dorian', lastName: 'Finney-Smith', team: 'Los Angeles Lakers', teamAbbr: 'LAL' },
  { firstName: 'Adam', lastName: 'Flagler', team: 'Oklahoma City Thunder', teamAbbr: 'OKC' },
  { firstName: 'Malachi', lastName: 'Flynn', team: 'Free Agent', teamAbbr: 'FA' },
  { firstName: 'Simone', lastName: 'Fontecchio', team: 'Detroit Pistons', teamAbbr: 'DET' },
  { firstName: 'Jordan', lastName: 'Ford', team: 'Sacramento Kings', teamAbbr: 'SAC' },
  { firstName: 'Trent', lastName: 'Forrest', team: 'Atlanta Hawks', teamAbbr: 'ATL' },
  { firstName: 'Evan', lastName: 'Fournier', team: 'Detroit Pistons', teamAbbr: 'DET' },
  { firstName: 'De\'Aaron', lastName: 'Fox', team: 'San Antonio Spurs', teamAbbr: 'SAS' },
  { firstName: 'Javon', lastName: 'Freeman-Liberty', team: 'Toronto Raptors', teamAbbr: 'TOR' },
  { firstName: 'Alex', lastName: 'Fudge', team: 'Dallas Mavericks', teamAbbr: 'DAL' },
  { firstName: 'Markelle', lastName: 'Fultz', team: 'Sacramento Kings', teamAbbr: 'SAC' },
  { firstName: 'Andrew', lastName: 'Funk', team: 'Chicago Bulls', teamAbbr: 'CHI' },
  { firstName: 'Wenyen', lastName: 'Gabriel', team: 'Free Agent', teamAbbr: 'FA' }
];

// Add the additional players to the main array
additionalPlayers.forEach((player, index) => {
  const fullName = `${player.firstName} ${player.lastName}`;
  CSV_NBA_PLAYERS.push({
    id: `NBA_csv_${CSV_NBA_PLAYERS.length + index + 1}`,
    name: fullName,
    firstName: player.firstName,
    lastName: player.lastName,
    team: player.team,
    teamAbbr: player.teamAbbr,
    position: getPosition(fullName),
    sport: 'NBA' as const,
    headshot: '',
    searchTerms: generateSearchTerms(player.firstName, player.lastName, fullName)
  });
});
