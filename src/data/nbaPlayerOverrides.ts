
import type { ManualPlayer } from './manualPlayerOverrides';

export const NBA_PLAYER_OVERRIDES: ManualPlayer[] = [
  // Los Angeles Lakers
  { id: 'NBA_manual_lebron_james', name: 'LeBron James', firstName: 'LeBron', lastName: 'James', team: 'Los Angeles Lakers', teamAbbr: 'LAL', position: 'SF', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/1966.png', searchTerms: ['lebron james', 'lebron', 'king james', 'the king'] },
  { id: 'NBA_manual_anthony_davis', name: 'Anthony Davis', firstName: 'Anthony', lastName: 'Davis', team: 'Los Angeles Lakers', teamAbbr: 'LAL', position: 'PF', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/6583.png', searchTerms: ['anthony davis', 'ad', 'davis'] },
  { id: 'NBA_manual_austin_reaves', name: 'Austin Reaves', firstName: 'Austin', lastName: 'Reaves', team: 'Los Angeles Lakers', teamAbbr: 'LAL', position: 'SG', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/4397136.png', searchTerms: ['austin reaves', 'reaves'] },
  
  // Golden State Warriors
  { id: 'NBA_manual_stephen_curry', name: 'Stephen Curry', firstName: 'Stephen', lastName: 'Curry', team: 'Golden State Warriors', teamAbbr: 'GSW', position: 'PG', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/3975.png', searchTerms: ['stephen curry', 'steph curry', 'curry', 'chef curry'] },
  { id: 'NBA_manual_klay_thompson', name: 'Klay Thompson', firstName: 'Klay', lastName: 'Thompson', team: 'Dallas Mavericks', teamAbbr: 'DAL', position: 'SG', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/6475.png', searchTerms: ['klay thompson', 'thompson'] },
  { id: 'NBA_manual_draymond_green', name: 'Draymond Green', firstName: 'Draymond', lastName: 'Green', team: 'Golden State Warriors', teamAbbr: 'GSW', position: 'PF', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/6589.png', searchTerms: ['draymond green', 'draymond', 'green'] },
  
  // Boston Celtics
  { id: 'NBA_manual_jayson_tatum', name: 'Jayson Tatum', firstName: 'Jayson', lastName: 'Tatum', team: 'Boston Celtics', teamAbbr: 'BOS', position: 'SF', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/4066261.png', searchTerms: ['jayson tatum', 'tatum'] },
  { id: 'NBA_manual_jaylen_brown', name: 'Jaylen Brown', firstName: 'Jaylen', lastName: 'Brown', team: 'Boston Celtics', teamAbbr: 'BOS', position: 'SG', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/4065648.png', searchTerms: ['jaylen brown', 'brown'] },
  
  // Milwaukee Bucks
  { id: 'NBA_manual_giannis_antetokounmpo', name: 'Giannis Antetokounmpo', firstName: 'Giannis', lastName: 'Antetokounmpo', team: 'Milwaukee Bucks', teamAbbr: 'MIL', position: 'PF', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/3032977.png', searchTerms: ['giannis antetokounmpo', 'giannis', 'greek freak'] },
  { id: 'NBA_manual_damian_lillard', name: 'Damian Lillard', firstName: 'Damian', lastName: 'Lillard', team: 'Milwaukee Bucks', teamAbbr: 'MIL', position: 'PG', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/6606.png', searchTerms: ['damian lillard', 'dame lillard', 'dame'] },
  
  // Phoenix Suns
  { id: 'NBA_manual_kevin_durant', name: 'Kevin Durant', firstName: 'Kevin', lastName: 'Durant', team: 'Phoenix Suns', teamAbbr: 'PHX', position: 'SF', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/3202.png', searchTerms: ['kevin durant', 'kd', 'durant'] },
  { id: 'NBA_manual_devin_booker', name: 'Devin Booker', firstName: 'Devin', lastName: 'Booker', team: 'Phoenix Suns', teamAbbr: 'PHX', position: 'SG', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/3917376.png', searchTerms: ['devin booker', 'booker'] },
  
  // Dallas Mavericks
  { id: 'NBA_manual_luka_doncic', name: 'Luka Dončić', firstName: 'Luka', lastName: 'Dončić', team: 'Dallas Mavericks', teamAbbr: 'DAL', position: 'PG', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/4066648.png', searchTerms: ['luka doncic', 'luka', 'doncic'] },
  { id: 'NBA_manual_kyrie_irving', name: 'Kyrie Irving', firstName: 'Kyrie', lastName: 'Irving', team: 'Dallas Mavericks', teamAbbr: 'DAL', position: 'PG', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/6442.png', searchTerms: ['kyrie irving', 'kyrie', 'irving'] },
  
  // Denver Nuggets
  { id: 'NBA_manual_nikola_jokic', name: 'Nikola Jokić', firstName: 'Nikola', lastName: 'Jokić', team: 'Denver Nuggets', teamAbbr: 'DEN', position: 'C', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/3112335.png', searchTerms: ['nikola jokic', 'jokic', 'joker'] },
  { id: 'NBA_manual_jamal_murray', name: 'Jamal Murray', firstName: 'Jamal', lastName: 'Murray', team: 'Denver Nuggets', teamAbbr: 'DEN', position: 'PG', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/4065662.png', searchTerms: ['jamal murray', 'murray'] },
  
  // Philadelphia 76ers
  { id: 'NBA_manual_joel_embiid', name: 'Joel Embiid', firstName: 'Joel', lastName: 'Embiid', team: 'Philadelphia 76ers', teamAbbr: 'PHI', position: 'C', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/3059318.png', searchTerms: ['joel embiid', 'embiid'] },
  { id: 'NBA_manual_tyrese_maxey', name: 'Tyrese Maxey', firstName: 'Tyrese', lastName: 'Maxey', team: 'Philadelphia 76ers', teamAbbr: 'PHI', position: 'PG', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/4432166.png', searchTerms: ['tyrese maxey', 'maxey'] },
  
  // Miami Heat
  { id: 'NBA_manual_jimmy_butler', name: 'Jimmy Butler', firstName: 'Jimmy', lastName: 'Butler', team: 'Miami Heat', teamAbbr: 'MIA', position: 'SF', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/6430.png', searchTerms: ['jimmy butler', 'butler'] },
  { id: 'NBA_manual_bam_adebayo', name: 'Bam Adebayo', firstName: 'Bam', lastName: 'Adebayo', team: 'Miami Heat', teamAbbr: 'MIA', position: 'C', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/4066756.png', searchTerms: ['bam adebayo', 'adebayo', 'bam'] },
  
  // Atlanta Hawks
  { id: 'NBA_manual_trae_young', name: 'Trae Young', firstName: 'Trae', lastName: 'Young', team: 'Atlanta Hawks', teamAbbr: 'ATL', position: 'PG', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/4278073.png', searchTerms: ['trae young', 'young', 'trae'] },
  
  // Memphis Grizzlies
  { id: 'NBA_manual_ja_morant', name: 'Ja Morant', firstName: 'Ja', lastName: 'Morant', team: 'Memphis Grizzlies', teamAbbr: 'MEM', position: 'PG', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/4279888.png', searchTerms: ['ja morant', 'morant', 'ja'] },
  
  // New Orleans Pelicans
  { id: 'NBA_manual_zion_williamson', name: 'Zion Williamson', firstName: 'Zion', lastName: 'Williamson', team: 'New Orleans Pelicans', teamAbbr: 'NOP', position: 'PF', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/4396993.png', searchTerms: ['zion williamson', 'zion', 'williamson'] },
  
  // Cleveland Cavaliers
  { id: 'NBA_manual_donovan_mitchell', name: 'Donovan Mitchell', firstName: 'Donovan', lastName: 'Mitchell', team: 'Cleveland Cavaliers', teamAbbr: 'CLE', position: 'SG', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/4066421.png', searchTerms: ['donovan mitchell', 'mitchell'] },
  
  // Minnesota Timberwolves
  { id: 'NBA_manual_anthony_edwards', name: 'Anthony Edwards', firstName: 'Anthony', lastName: 'Edwards', team: 'Minnesota Timberwolves', teamAbbr: 'MIN', position: 'SG', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/4432577.png', searchTerms: ['anthony edwards', 'ant edwards', 'edwards'] },
  { id: 'NBA_manual_karl_anthony_towns', name: 'Karl-Anthony Towns', firstName: 'Karl-Anthony', lastName: 'Towns', team: 'New York Knicks', teamAbbr: 'NYK', position: 'C', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/4066259.png', searchTerms: ['karl-anthony towns', 'kat', 'towns'] },
  
  // San Antonio Spurs
  { id: 'NBA_manual_victor_wembanyama', name: 'Victor Wembanyama', firstName: 'Victor', lastName: 'Wembanyama', team: 'San Antonio Spurs', teamAbbr: 'SAS', position: 'C', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/4685623.png', searchTerms: ['victor wembanyama', 'wembanyama', 'wemby'] },
  
  // LA Clippers
  { id: 'NBA_manual_kawhi_leonard', name: 'Kawhi Leonard', firstName: 'Kawhi', lastName: 'Leonard', team: 'LA Clippers', teamAbbr: 'LAC', position: 'SF', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/6450.png', searchTerms: ['kawhi leonard', 'kawhi', 'leonard'] },
  { id: 'NBA_manual_paul_george', name: 'Paul George', firstName: 'Paul', lastName: 'George', team: 'Philadelphia 76ers', teamAbbr: 'PHI', position: 'SF', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/4251.png', searchTerms: ['paul george', 'pg13', 'george'] },
  
  // New York Knicks
  { id: 'NBA_manual_jalen_brunson', name: 'Jalen Brunson', firstName: 'Jalen', lastName: 'Brunson', team: 'New York Knicks', teamAbbr: 'NYK', position: 'PG', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/4278097.png', searchTerms: ['jalen brunson', 'brunson'] },
  
  // Oklahoma City Thunder
  { id: 'NBA_manual_shai_gilgeous_alexander', name: 'Shai Gilgeous-Alexander', firstName: 'Shai', lastName: 'Gilgeous-Alexander', team: 'Oklahoma City Thunder', teamAbbr: 'OKC', position: 'PG', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/4278068.png', searchTerms: ['shai gilgeous-alexander', 'shai', 'sga'] },
  
  // Utah Jazz
  { id: 'NBA_manual_rudy_gobert', name: 'Rudy Gobert', firstName: 'Rudy', lastName: 'Gobert', team: 'Minnesota Timberwolves', teamAbbr: 'MIN', position: 'C', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/3032976.png', searchTerms: ['rudy gobert', 'gobert'] }
];
