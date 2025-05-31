export interface ESPNPlayer {
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
  matchScore?: number;
}

import { MANUAL_PLAYER_OVERRIDES, ManualPlayer } from '@/data/manualPlayerOverrides';

class FreePlayerDatabase {
  private players: ESPNPlayer[] = [];
  private isLoaded = false;
  private loadingPromise: Promise<ESPNPlayer[]> | null = null;

  async loadAllPlayers(): Promise<ESPNPlayer[]> {
    if (this.isLoaded) return this.players;
    if (this.loadingPromise) return this.loadingPromise;

    this.loadingPromise = this.fetchAllPlayers();
    return this.loadingPromise;
  }

  private async fetchAllPlayers(): Promise<ESPNPlayer[]> {
    const sportConfigs = [
      { sport: 'NBA' as const, sportPath: 'basketball/nba' },
      { sport: 'NFL' as const, sportPath: 'football/nfl' },
      { sport: 'MLB' as const, sportPath: 'baseball/mlb' },
      { sport: 'NHL' as const, sportPath: 'hockey/nhl' }
    ];

    console.log('Loading players from ESPN team rosters...');

    // Add manual overrides first
    this.players = MANUAL_PLAYER_OVERRIDES.map(player => ({
      ...player,
      searchTerms: this.createSearchTerms(player.name, player.firstName, player.lastName)
    }));

    console.log(`Added ${MANUAL_PLAYER_OVERRIDES.length} manual player overrides`);

    for (const { sport, sportPath } of sportConfigs) {
      console.log(`Loading ${sport} players...`);
      let sportPlayerCount = 0;

      try {
        // First, get all team IDs for this sport
        const teamsUrl = `https://site.api.espn.com/apis/site/v2/sports/${sportPath}/teams`;
        const teamsResponse = await fetch(teamsUrl);
        
        if (!teamsResponse.ok) {
          console.warn(`Failed to load ${sport} teams: ${teamsResponse.status}`);
          continue;
        }

        const teamsData = await teamsResponse.json();
        
        // Extract team IDs from sports[0].leagues[0].teams[*].team.id
        const teamIds: number[] = [];
        if (teamsData.sports?.[0]?.leagues?.[0]?.teams) {
          teamsData.sports[0].leagues[0].teams.forEach((teamObj: any) => {
            if (teamObj.team?.id) {
              teamIds.push(parseInt(teamObj.team.id));
            }
          });
        }

        console.log(`Found ${teamIds.length} ${sport} teams`);

        // Now fetch roster for each team
        for (const teamId of teamIds) {
          try {
            const rosterUrl = `https://site.api.espn.com/apis/site/v2/sports/${sportPath}/teams/${teamId}/roster`;
            const rosterResponse = await fetch(rosterUrl);
            
            if (!rosterResponse.ok) {
              console.warn(`Failed to load ${sport} team ${teamId} roster: ${rosterResponse.status}`);
              continue;
            }

            const rosterData = await rosterResponse.json();
            
            // Handle nested structure: athletes[*].items[*]
            if (rosterData.athletes && Array.isArray(rosterData.athletes)) {
              rosterData.athletes.forEach((athleteGroup: any) => {
                if (athleteGroup.items && Array.isArray(athleteGroup.items)) {
                  athleteGroup.items.forEach((athlete: any) => {
                    if (athlete.fullName || athlete.displayName) {
                      // Check if this player already exists in manual overrides
                      const existingPlayer = this.players.find(p => 
                        p.name.toLowerCase() === (athlete.fullName || athlete.displayName || '').toLowerCase() &&
                        p.team.toLowerCase().includes(rosterData.team?.displayName?.toLowerCase() || '')
                      );
                      
                      if (!existingPlayer) {
                        this.players.push({
                          id: `${sport}_${athlete.id}`,
                          name: athlete.fullName || athlete.displayName || '',
                          firstName: athlete.firstName || '',
                          lastName: athlete.lastName || '',
                          team: rosterData.team?.displayName || 'Unknown Team',
                          teamAbbr: rosterData.team?.abbreviation || '',
                          position: athlete.position?.name || athlete.position?.abbreviation || 'N/A',
                          sport: sport,
                          headshot: athlete.headshot?.href || '',
                          searchTerms: this.createSearchTerms(
                            athlete.fullName || athlete.displayName || '', 
                            athlete.firstName || '', 
                            athlete.lastName || ''
                          )
                        });
                        sportPlayerCount++;
                      }
                    }
                  });
                }
              });
            }
          } catch (error) {
            console.warn(`Error loading ${sport} team ${teamId} roster:`, error);
            // Continue with next team
          }
          
          // Small delay to be respectful to ESPN's servers
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.log(`Loaded ${sportPlayerCount} ${sport} players from ${teamIds.length} teams`);
      } catch (error) {
        console.error(`Error loading ${sport} teams:`, error);
        // Continue with next sport
      }
    }

    this.isLoaded = true;
    console.log(`Total players loaded: ${this.players.length} (including ${MANUAL_PLAYER_OVERRIDES.length} manual overrides)`);
    return this.players;
  }

  private createSearchTerms(displayName: string, firstName: string, lastName: string): string[] {
    const terms = [];
    
    if (displayName) terms.push(displayName.toLowerCase());
    
    if (firstName && lastName) {
      terms.push(`${firstName} ${lastName}`.toLowerCase());
      terms.push(lastName.toLowerCase());
      
      if (firstName === 'Anthony') {
        terms.push(`ant ${lastName}`.toLowerCase());
        terms.push(`tony ${lastName}`.toLowerCase());
      }
      if (firstName === 'Christopher') {
        terms.push(`chris ${lastName}`.toLowerCase());
      }
      if (firstName === 'Alexander') {
        terms.push(`alex ${lastName}`.toLowerCase());
      }
      if (firstName === 'Michael') {
        terms.push(`mike ${lastName}`.toLowerCase());
      }
      if (firstName === 'William') {
        terms.push(`bill ${lastName}`.toLowerCase());
        terms.push(`will ${lastName}`.toLowerCase());
      }
      if (firstName === 'Robert') {
        terms.push(`rob ${lastName}`.toLowerCase());
        terms.push(`bob ${lastName}`.toLowerCase());
      }
      if (firstName === 'Richard') {
        terms.push(`rick ${lastName}`.toLowerCase());
        terms.push(`dick ${lastName}`.toLowerCase());
      }
      if (firstName === 'James') {
        terms.push(`jim ${lastName}`.toLowerCase());
        terms.push(`jimmy ${lastName}`.toLowerCase());
      }
    }
    
    return [...new Set(terms)]; // Remove duplicates
  }

  searchPlayers(query: string, limit = 8): ESPNPlayer[] {
    if (!query || query.length < 2) return [];
    
    const searchTerm = query.toLowerCase().trim();
    const matches: ESPNPlayer[] = [];
    
    for (const player of this.players) {
      const score = this.calculateMatchScore(player, searchTerm);
      if (score > 0) {
        matches.push({ ...player, matchScore: score });
      }
    }
    
    // Sort by match score (higher = better match)
    return matches
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
      .slice(0, limit);
  }

  private calculateMatchScore(player: ESPNPlayer, searchTerm: string): number {
    let score = 0;
    
    for (const term of player.searchTerms) {
      if (term === searchTerm) {
        score += 100; // Exact match
      } else if (term.startsWith(searchTerm)) {
        score += 50; // Starts with query
      } else if (term.includes(searchTerm)) {
        score += 25; // Contains query
      }
    }
    
    return score;
  }

  getPlayersBySport(sport: string): ESPNPlayer[] {
    return this.players.filter(player => player.sport === sport);
  }

  isReady(): boolean {
    return this.isLoaded;
  }

  getPlayerCount(): number {
    return this.players.length;
  }
}

// Singleton instance
export const espnPlayerDB = new FreePlayerDatabase();

// Helper function to get team-specific subreddits
export function getTeamSubreddit(teamName: string, sport: string): string | null {
  const teamSubreddits: Record<string, string> = {
    // NBA teams
    'Los Angeles Lakers': 'lakers',
    'Golden State Warriors': 'warriors',
    'Boston Celtics': 'bostonceltics',
    'Miami Heat': 'heat',
    'Chicago Bulls': 'chicagobulls',
    'New York Knicks': 'nyknicks',
    'Brooklyn Nets': 'gonets',
    'Philadelphia 76ers': 'sixers',
    'Milwaukee Bucks': 'mkebucks',
    'Toronto Raptors': 'torontoraptors',
    'Atlanta Hawks': 'atlantahawks',
    'Charlotte Hornets': 'charlottehornets',
    'Orlando Magic': 'orlandomagic',
    'Washington Wizards': 'washingtonwizards',
    'Indiana Pacers': 'pacers',
    'Detroit Pistons': 'detroitpistons',
    'Cleveland Cavaliers': 'clevelandcavs',
    'Denver Nuggets': 'denvernuggets',
    'Minnesota Timberwolves': 'timberwolves',
    'Oklahoma City Thunder': 'thunder',
    'Portland Trail Blazers': 'ripcity',
    'Utah Jazz': 'utahjazz',
    'Phoenix Suns': 'suns',
    'Sacramento Kings': 'kings',
    'Los Angeles Clippers': 'laclippers',
    'Memphis Grizzlies': 'memphisgrizzlies',
    'New Orleans Pelicans': 'nolapelicans',
    'San Antonio Spurs': 'nbaspurs',
    'Dallas Mavericks': 'mavericks',
    'Houston Rockets': 'rockets',
    
    // NFL teams
    'Buffalo Bills': 'buffalobills',
    'Miami Dolphins': 'miamidolphins',
    'New England Patriots': 'patriots',
    'New York Jets': 'nyjets',
    'Baltimore Ravens': 'ravens',
    'Cincinnati Bengals': 'bengals',
    'Cleveland Browns': 'browns',
    'Pittsburgh Steelers': 'steelers',
    'Houston Texans': 'texans',
    'Indianapolis Colts': 'colts',
    'Jacksonville Jaguars': 'jaguars',
    'Tennessee Titans': 'tennesseetitans',
    'Denver Broncos': 'denverbroncos',
    'Kansas City Chiefs': 'kansascitychiefs',
    'Las Vegas Raiders': 'raiders',
    'Los Angeles Chargers': 'chargers',
    'Dallas Cowboys': 'cowboys',
    'New York Giants': 'nygiants',
    'Philadelphia Eagles': 'eagles',
    'Washington Commanders': 'commanders',
    'Chicago Bears': 'chibears',
    'Detroit Lions': 'detroitlions',
    'Green Bay Packers': 'greenbaypackers',
    'Minnesota Vikings': 'minnesotavikings',
    'Atlanta Falcons': 'falcons',
    'Carolina Panthers': 'panthers',
    'New Orleans Saints': 'saints',
    'Tampa Bay Buccaneers': 'buccaneers',
    'Arizona Cardinals': 'azcardinals',
    'Los Angeles Rams': 'losangelesrams',
    'San Francisco 49ers': '49ers',
    'Seattle Seahawks': 'seahawks',
    
    // MLB teams (major ones)
    'New York Yankees': 'nyyankees',
    'Boston Red Sox': 'redsox',
    'Los Angeles Dodgers': 'dodgers',
    'San Francisco Giants': 'sfgiants',
    'Chicago Cubs': 'chicubs',
    'St. Louis Cardinals': 'cardinals',
    'Atlanta Braves': 'braves',
    'Philadelphia Phillies': 'phillies',
    'Houston Astros': 'astros',
    'Toronto Blue Jays': 'torontobluejays',
    'Seattle Mariners': 'mariners',
    'Texas Rangers': 'texasrangers',
    'Minnesota Twins': 'minnesotatwins',
    'Cleveland Guardians': 'clevelandguardians',
    'Detroit Tigers': 'motorcitykitties',
    'Kansas City Royals': 'kcroyals',
    'Los Angeles Angels': 'angelsbaseball',
    'Oakland Athletics': 'oaklandathletics',
    'Tampa Bay Rays': 'tampabayrays',
    'Baltimore Orioles': 'orioles',
    'New York Mets': 'newyorkmets',
    'Washington Nationals': 'nationals',
    'Miami Marlins': 'letsgofish',
    'Milwaukee Brewers': 'brewers',
    'Cincinnati Reds': 'reds',
    'Pittsburgh Pirates': 'buccos',
    'Chicago White Sox': 'whitesox',
    'Colorado Rockies': 'coloradorockies',
    'Arizona Diamondbacks': 'azdiamondbacks',
    'San Diego Padres': 'padres'
  };
  
  return teamSubreddits[teamName] || null;
}
