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
import { nbaImageService } from './nbaImageService';

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
    console.log('Loading players from ESPN APIs...');

    // Add manual overrides first with enhanced image handling
    this.players = await Promise.all(MANUAL_PLAYER_OVERRIDES.map(async (player) => {
      let headshot = player.headshot;
      
      // For NBA players without headshots, try to get images
      if (player.sport === 'NBA' && !headshot) {
        headshot = await nbaImageService.getImageForPlayer(player.id, player.name);
      }

      return {
        ...player,
        headshot,
        searchTerms: this.createSearchTerms(player.name, player.firstName, player.lastName)
      };
    }));

    console.log(`Added ${MANUAL_PLAYER_OVERRIDES.length} manual player overrides`);
    
    // Count NBA players in manual overrides
    const nbaManualCount = MANUAL_PLAYER_OVERRIDES.filter(p => p.sport === 'NBA').length;
    console.log(`NBA manual overrides: ${nbaManualCount}`);

    // Direct athlete endpoints (primary method)
    const athleteEndpoints = [
      { sport: 'NBA' as const, url: 'https://site.web.api.espn.com/apis/site/v2/sports/basketball/nba/athletes' },
      { sport: 'NFL' as const, url: 'https://site.web.api.espn.com/apis/site/v2/sports/football/nfl/athletes' },
      { sport: 'NHL' as const, url: 'https://site.web.api.espn.com/apis/site/v2/sports/hockey/nhl/athletes' },
      { sport: 'MLB' as const, url: 'https://site.web.api.espn.com/apis/site/v2/sports/baseball/mlb/athletes' }
    ];

    // Try direct athlete endpoints first with enhanced NBA image support
    for (const endpoint of athleteEndpoints) {
      console.log(`Loading ${endpoint.sport} players from athlete endpoint...`);
      let sportPlayerCount = 0;

      try {
        const response = await fetch(endpoint.url);
        
        if (!response.ok) {
          console.warn(`Failed to load ${endpoint.sport} athletes from direct endpoint: ${response.status}, falling back to team rosters`);
          await this.loadSportFromTeamRosters(endpoint.sport);
          continue;
        }

        const data = await response.json();
        console.log(`${endpoint.sport} API response structure:`, {
          hasAthletes: !!data.athletes,
          athletesLength: data.athletes?.length || 0,
          sampleAthlete: data.athletes?.[0] || null
        });
        
        if (data.athletes && Array.isArray(data.athletes)) {
          for (const athlete of data.athletes) {
            if (athlete.displayName || athlete.fullName) {
              // Check if this player already exists in manual overrides
              const existingPlayer = this.players.find(p => 
                p.name.toLowerCase() === (athlete.displayName || athlete.fullName || '').toLowerCase() &&
                p.sport === endpoint.sport
              );
              
              if (!existingPlayer) {
                let headshot = athlete.headshot?.href || '';
                
                // For NBA players, enhance image handling
                if (endpoint.sport === 'NBA' && !headshot && athlete.id) {
                  headshot = await nbaImageService.getImageForPlayer(athlete.id, athlete.displayName || athlete.fullName || '');
                }

                this.players.push({
                  id: `${endpoint.sport}_${athlete.id}`,
                  name: athlete.displayName || athlete.fullName || '',
                  firstName: athlete.firstName || '',
                  lastName: athlete.lastName || '',
                  team: athlete.team?.displayName || athlete.team?.name || 'Unknown Team',
                  teamAbbr: athlete.team?.abbreviation || '',
                  position: this.normalizePosition(athlete.position?.displayName || athlete.position?.name || athlete.position?.abbreviation || 'N/A', endpoint.sport),
                  sport: endpoint.sport,
                  headshot,
                  searchTerms: this.createSearchTerms(
                    athlete.displayName || athlete.fullName || '', 
                    athlete.firstName || '', 
                    athlete.lastName || ''
                  )
                });
                sportPlayerCount++;
              }
            }
          }
        }
        
        console.log(`Loaded ${sportPlayerCount} ${endpoint.sport} players from athlete endpoint`);
        
        // Log image statistics for NBA
        if (endpoint.sport === 'NBA') {
          const nbaPlayersWithImages = this.players.filter(p => p.sport === 'NBA' && p.headshot).length;
          const totalNBAPlayers = this.players.filter(p => p.sport === 'NBA').length;
          console.log(`NBA players with images: ${nbaPlayersWithImages}/${totalNBAPlayers}`);
        }
      } catch (error) {
        console.error(`Error loading ${endpoint.sport} athletes from direct endpoint:`, error);
        console.log(`Falling back to team rosters for ${endpoint.sport}...`);
        await this.loadSportFromTeamRosters(endpoint.sport);
      }
    }

    // Additional NBA-specific API calls to ensure complete coverage
    if (this.getPlayersBySport('NBA').length < 400) {
      console.log('NBA player count seems low, trying additional NBA endpoints...');
      await this.loadAdditionalNBAPlayers();
    }

    this.isLoaded = true;
    const totalPlayers = this.players.length;
    const nbaPlayers = this.getPlayersBySport('NBA').length;
    const nflPlayers = this.getPlayersBySport('NFL').length;
    const mlbPlayers = this.getPlayersBySport('MLB').length;
    const nhlPlayers = this.getPlayersBySport('NHL').length;
    
    console.log(`Total players loaded: ${totalPlayers}`);
    console.log(`Sport breakdown - NBA: ${nbaPlayers}, NFL: ${nflPlayers}, MLB: ${mlbPlayers}, NHL: ${nhlPlayers}`);
    
    // Log image coverage for each sport
    const nbaWithImages = this.players.filter(p => p.sport === 'NBA' && p.headshot).length;
    const nflWithImages = this.players.filter(p => p.sport === 'NFL' && p.headshot).length;
    const mlbWithImages = this.players.filter(p => p.sport === 'MLB' && p.headshot).length;
    const nhlWithImages = this.players.filter(p => p.sport === 'NHL' && p.headshot).length;
    
    console.log(`Images available - NBA: ${nbaWithImages}/${nbaPlayers}, NFL: ${nflWithImages}/${nflPlayers}, MLB: ${mlbWithImages}/${mlbPlayers}, NHL: ${nhlWithImages}/${nhlPlayers}`);
    
    return this.players;
  }

  private async loadAdditionalNBAPlayers(): Promise<void> {
    console.log('Loading additional NBA players from team rosters...');
    let additionalNBACount = 0;

    try {
      // Get all NBA team IDs
      const teamsUrl = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams';
      const teamsResponse = await fetch(teamsUrl);
      
      if (!teamsResponse.ok) {
        console.warn(`Failed to load NBA teams: ${teamsResponse.status}`);
        return;
      }

      const teamsData = await teamsResponse.json();
      console.log('NBA teams API response:', teamsData);
      
      // Extract team IDs
      const teamIds: number[] = [];
      if (teamsData.sports?.[0]?.leagues?.[0]?.teams) {
        teamsData.sports[0].leagues[0].teams.forEach((teamObj: any) => {
          if (teamObj.team?.id) {
            teamIds.push(parseInt(teamObj.team.id));
          }
        });
      }

      console.log(`Found ${teamIds.length} NBA teams for additional roster loading`);

      // Fetch roster for each NBA team
      for (const teamId of teamIds.slice(0, 30)) { // Limit to 30 teams max
        try {
          const rosterUrl = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamId}/roster`;
          const rosterResponse = await fetch(rosterUrl);
          
          if (!rosterResponse.ok) {
            console.warn(`Failed to load NBA team ${teamId} roster: ${rosterResponse.status}`);
            continue;
          }

          const rosterData = await rosterResponse.json();
          
          // Handle nested structure: athletes[*].items[*]
          if (rosterData.athletes && Array.isArray(rosterData.athletes)) {
            rosterData.athletes.forEach((athleteGroup: any) => {
              if (athleteGroup.items && Array.isArray(athleteGroup.items)) {
                athleteGroup.items.forEach((athlete: any) => {
                  if (athlete.fullName || athlete.displayName) {
                    // Check if this player already exists
                    const existingPlayer = this.players.find(p => 
                      p.name.toLowerCase() === (athlete.fullName || athlete.displayName || '').toLowerCase() &&
                      p.sport === 'NBA'
                    );
                    
                    if (!existingPlayer) {
                      this.players.push({
                        id: `NBA_roster_${athlete.id}`,
                        name: athlete.fullName || athlete.displayName || '',
                        firstName: athlete.firstName || '',
                        lastName: athlete.lastName || '',
                        team: rosterData.team?.displayName || 'Unknown Team',
                        teamAbbr: rosterData.team?.abbreviation || '',
                        position: this.normalizePosition(athlete.position?.name || athlete.position?.abbreviation || 'N/A', 'NBA'),
                        sport: 'NBA',
                        headshot: athlete.headshot?.href || '',
                        searchTerms: this.createSearchTerms(
                          athlete.fullName || athlete.displayName || '', 
                          athlete.firstName || '', 
                          athlete.lastName || ''
                        )
                      });
                      additionalNBACount++;
                    }
                  }
                });
              }
            });
          }
        } catch (error) {
          console.warn(`Error loading NBA team ${teamId} roster:`, error);
        }
        
        // Small delay to respect ESPN's servers
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log(`Loaded ${additionalNBACount} additional NBA players from team rosters`);
    } catch (error) {
      console.error('Error loading additional NBA players:', error);
    }
  }

  private normalizePosition(position: string, sport: string): string {
    if (sport === 'NBA') {
      // Normalize NBA positions
      const pos = position.toUpperCase();
      if (pos.includes('POINT') || pos === 'PG') return 'PG';
      if (pos.includes('SHOOTING') || pos === 'SG') return 'SG';
      if (pos.includes('SMALL') || pos === 'SF') return 'SF';
      if (pos.includes('POWER') || pos === 'PF') return 'PF';
      if (pos.includes('CENTER') || pos === 'C') return 'C';
      if (pos.includes('GUARD') || pos === 'G') return 'G';
      if (pos.includes('FORWARD') || pos === 'F') return 'F';
    }
    return position;
  }

  private async loadSportFromTeamRosters(sport: 'NBA' | 'NFL' | 'MLB' | 'NHL'): Promise<void> {
    const sportConfigs = {
      'NBA': { sportPath: 'basketball/nba' },
      'NFL': { sportPath: 'football/nfl' },
      'MLB': { sportPath: 'baseball/mlb' },
      'NHL': { sportPath: 'hockey/nhl' }
    };

    const config = sportConfigs[sport];
    let sportPlayerCount = 0;

    try {
      // Get all team IDs for this sport
      const teamsUrl = `https://site.api.espn.com/apis/site/v2/sports/${config.sportPath}/teams`;
      const teamsResponse = await fetch(teamsUrl);
      
      if (!teamsResponse.ok) {
        console.warn(`Failed to load ${sport} teams: ${teamsResponse.status}`);
        return;
      }

      const teamsData = await teamsResponse.json();
      
      // Extract team IDs
      const teamIds: number[] = [];
      if (teamsData.sports?.[0]?.leagues?.[0]?.teams) {
        teamsData.sports[0].leagues[0].teams.forEach((teamObj: any) => {
          if (teamObj.team?.id) {
            teamIds.push(parseInt(teamObj.team.id));
          }
        });
      }

      console.log(`Found ${teamIds.length} ${sport} teams for roster fallback`);

      // Fetch roster for each team
      for (const teamId of teamIds) {
        try {
          const rosterUrl = `https://site.api.espn.com/apis/site/v2/sports/${config.sportPath}/teams/${teamId}/roster`;
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
                    // Check if this player already exists
                    const existingPlayer = this.players.find(p => 
                      p.name.toLowerCase() === (athlete.fullName || athlete.displayName || '').toLowerCase() &&
                      p.sport === sport
                    );
                    
                    if (!existingPlayer) {
                      this.players.push({
                        id: `${sport}_${athlete.id}`,
                        name: athlete.fullName || athlete.displayName || '',
                        firstName: athlete.firstName || '',
                        lastName: athlete.lastName || '',
                        team: rosterData.team?.displayName || 'Unknown Team',
                        teamAbbr: rosterData.team?.abbreviation || '',
                        position: this.normalizePosition(athlete.position?.name || athlete.position?.abbreviation || 'N/A', sport),
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
        }
        
        // Small delay to respect ESPN's servers
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      console.log(`Loaded ${sportPlayerCount} ${sport} players from team rosters (fallback)`);
    } catch (error) {
      console.error(`Error loading ${sport} team rosters:`, error);
    }
  }

  private createSearchTerms(displayName: string, firstName: string, lastName: string): string[] {
    const terms = [];
    
    if (displayName) terms.push(displayName.toLowerCase());
    
    if (firstName && lastName) {
      terms.push(`${firstName} ${lastName}`.toLowerCase());
      terms.push(lastName.toLowerCase());
      
      // Common nickname variations for NBA players
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
    
    // Sort by match score (higher = better match), with manual overrides getting slight boost
    return matches
      .sort((a, b) => {
        const scoreA = (a.matchScore || 0) + (a.id.includes('manual') ? 5 : 0);
        const scoreB = (b.matchScore || 0) + (b.id.includes('manual') ? 5 : 0);
        return scoreB - scoreA;
      })
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
    
    // Boost score for manual overrides (they're likely more accurate/current)
    if (player.id.startsWith('manual_')) {
      score += 10;
    }
    
    // Additional boost for NBA players to improve their search ranking
    if (player.sport === 'NBA') {
      score += 2;
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

  // Refresh player data (can be called periodically)
  async refreshPlayers(): Promise<ESPNPlayer[]> {
    this.isLoaded = false;
    this.loadingPromise = null;
    this.players = [];
    return this.loadAllPlayers();
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
    
    // MLB teams
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
    'San Diego Padres': 'padres',
    
    // NHL teams
    'Boston Bruins': 'bostonbruins',
    'Buffalo Sabres': 'sabres',
    'Detroit Red Wings': 'detroitredwings',
    'Florida Panthers': 'floridapanthers',
    'Montreal Canadiens': 'habs',
    'Ottawa Senators': 'ottawasenators',
    'Tampa Bay Lightning': 'tampabaylightning',
    'Toronto Maple Leafs': 'leafs',
    'Carolina Hurricanes': 'canes',
    'Columbus Blue Jackets': 'bluejackets',
    'New Jersey Devils': 'devils',
    'New York Islanders': 'newyorkislanders',
    'New York Rangers': 'rangers',
    'Philadelphia Flyers': 'flyers',
    'Pittsburgh Penguins': 'penguins',
    'Washington Capitals': 'caps',
    'Chicago Blackhawks': 'hawks',
    'Colorado Avalanche': 'coloradoavalanche',
    'Dallas Stars': 'dallasstars',
    'Minnesota Wild': 'wildhockey',
    'Nashville Predators': 'predators',
    'St. Louis Blues': 'stlouisblues',
    'Winnipeg Jets': 'winnipegjets',
    'Anaheim Ducks': 'anaheimducks',
    'Arizona Coyotes': 'coyotes',
    'Calgary Flames': 'calgaryflames',
    'Edmonton Oilers': 'edmontonoilers',
    'Los Angeles Kings': 'losangeleskings',
    'San Jose Sharks': 'sanjosesharks',
    'Seattle Kraken': 'seattlekraken',
    'Vancouver Canucks': 'canucks',
    'Vegas Golden Knights': 'goldenknights'
  };
  
  return teamSubreddits[teamName] || null;
}
