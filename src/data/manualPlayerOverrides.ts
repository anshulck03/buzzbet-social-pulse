export interface ManualPlayer {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  team: string;
  teamAbbr: string;
  position: string;
  sport: 'NBA' | 'NFL' | 'MLB' | 'NHL';
  headshot: string;
  searchTerms: string[];
}

// Import NBA player overrides (only keep a few key ones, rest will come from CSV)
const NBA_PLAYER_OVERRIDES: ManualPlayer[] = [
  // Keep only the most important NBA players with special nicknames
  { id: 'NBA_manual_lebron_james', name: 'LeBron James', firstName: 'LeBron', lastName: 'James', team: 'Los Angeles Lakers', teamAbbr: 'LAL', position: 'SF', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/1966.png', searchTerms: ['lebron james', 'lebron', 'king james', 'the king'] },
  { id: 'NBA_manual_stephen_curry', name: 'Stephen Curry', firstName: 'Stephen', lastName: 'Curry', team: 'Golden State Warriors', teamAbbr: 'GSW', position: 'PG', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/3975.png', searchTerms: ['stephen curry', 'steph curry', 'curry', 'chef curry'] },
  { id: 'NBA_manual_giannis_antetokounmpo', name: 'Giannis Antetokounmpo', firstName: 'Giannis', lastName: 'Antetokounmpo', team: 'Milwaukee Bucks', teamAbbr: 'MIL', position: 'PF', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/3032977.png', searchTerms: ['giannis antetokounmpo', 'giannis', 'greek freak'] },
  { id: 'NBA_manual_victor_wembanyama', name: 'Victor Wembanyama', firstName: 'Victor', lastName: 'Wembanyama', team: 'San Antonio Spurs', teamAbbr: 'SAS', position: 'C', sport: 'NBA', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/4685623.png', searchTerms: ['victor wembanyama', 'wembanyama', 'wemby'] }
];

// Import CSV NBA players
import { CSV_NBA_PLAYERS } from './csvNbaPlayers';

// NFL player overrides (keeping existing ones for now)
const NFL_PLAYER_OVERRIDES: ManualPlayer[] = [
  // Key NFL players
  { id: 'NFL_manual_josh_allen', name: 'Josh Allen', firstName: 'Josh', lastName: 'Allen', team: 'Buffalo Bills', teamAbbr: 'BUF', position: 'QB', sport: 'NFL', headshot: '', searchTerms: ['josh allen', 'allen'] },
  { id: 'NFL_manual_patrick_mahomes', name: 'Patrick Mahomes', firstName: 'Patrick', lastName: 'Mahomes', team: 'Kansas City Chiefs', teamAbbr: 'KC', position: 'QB', sport: 'NFL', headshot: '', searchTerms: ['patrick mahomes', 'mahomes'] },
  { id: 'NFL_manual_lamar_jackson', name: 'Lamar Jackson', firstName: 'Lamar', lastName: 'Jackson', team: 'Baltimore Ravens', teamAbbr: 'BAL', position: 'QB', sport: 'NFL', headshot: '', searchTerms: ['lamar jackson', 'jackson'] },
  { id: 'NFL_manual_aaron_rodgers', name: 'Aaron Rodgers', firstName: 'Aaron', lastName: 'Rodgers', team: 'New York Jets', teamAbbr: 'NYJ', position: 'QB', sport: 'NFL', headshot: '', searchTerms: ['aaron rodgers', 'rodgers'] }
];

// Combine all manual player overrides
export const MANUAL_PLAYER_OVERRIDES: ManualPlayer[] = [
  ...NBA_PLAYER_OVERRIDES,
  ...CSV_NBA_PLAYERS,
  ...NFL_PLAYER_OVERRIDES
];
