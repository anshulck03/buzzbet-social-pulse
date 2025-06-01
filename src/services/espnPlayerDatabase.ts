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
    console.log('Loading comprehensive player database from ESPN APIs...');

    // Start with manual overrides
    this.players = await Promise.all(MANUAL_PLAYER_OVERRIDES.map(async (player) => {
      let headshot = player.headshot;
      
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

    // Load players from all sports using multiple API endpoints
    const sports = [
      { name: 'NBA', path: 'basketball/nba' },
      { name: 'NFL', path: 'football/nfl' },
      { name: 'MLB', path: 'baseball/mlb' },
      { name: 'NHL', path: 'hockey/nhl' }
    ];

    for (const sport of sports) {
      console.log(`Loading ${sport.name} players...`);
      await this.loadSportPlayers(sport.name as 'NBA' | 'NFL' | 'MLB' | 'NHL', sport.path);
    }

    this.isLoaded = true;
    const totalPlayers = this.players.length;
    const sportCounts = sports.map(sport => ({
      sport: sport.name,
      count: this.getPlayersBySport(sport.name).length
    }));
    
    console.log(`Total players loaded: ${totalPlayers}`);
    sportCounts.forEach(({ sport, count }) => {
      console.log(`${sport}: ${count} players`);
    });
    
    return this.players;
  }

  private async loadSportPlayers(sport: 'NBA' | 'NFL' | 'MLB' | 'NHL', sportPath: string): Promise<void> {
    let sportPlayerCount = 0;

    try {
      // Method 1: Try direct athlete endpoint
      const athleteUrl = `https://site.web.api.espn.com/apis/site/v2/sports/${sportPath}/athletes?limit=1000`;
      console.log(`Trying direct athlete endpoint for ${sport}: ${athleteUrl}`);
      
      try {
        const athleteResponse = await fetch(athleteUrl);
        if (athleteResponse.ok) {
          const athleteData = await athleteResponse.json();
          if (athleteData.athletes && Array.isArray(athleteData.athletes)) {
            for (const athlete of athleteData.athletes) {
              if (this.addPlayerFromAthleteData(athlete, sport)) {
                sportPlayerCount++;
              }
            }
            console.log(`Loaded ${sportPlayerCount} ${sport} players from direct athlete endpoint`);
            return; // Success, skip team rosters
          }
        }
      } catch (error) {
        console.warn(`Direct athlete endpoint failed for ${sport}:`, error);
      }

      // Method 2: Load from team rosters (fallback)
      console.log(`Loading ${sport} players from team rosters...`);
      sportPlayerCount = await this.loadFromTeamRosters(sport, sportPath);
      console.log(`Loaded ${sportPlayerCount} ${sport} players from team rosters`);

    } catch (error) {
      console.error(`Error loading ${sport} players:`, error);
      
      // Method 3: Hardcode some popular players as last resort
      await this.loadPopularPlayersForSport(sport);
    }
  }

  private addPlayerFromAthleteData(athlete: any, sport: 'NBA' | 'NFL' | 'MLB' | 'NHL'): boolean {
    const name = athlete.displayName || athlete.fullName || athlete.name;
    if (!name) return false;

    // Check if player already exists
    const existingPlayer = this.players.find(p => 
      p.name.toLowerCase() === name.toLowerCase() && p.sport === sport
    );
    if (existingPlayer) return false;

    let headshot = athlete.headshot?.href || '';
    
    // For NBA players, try to get better images
    if (sport === 'NBA' && !headshot && athlete.id) {
      // We'll handle this async later if needed
    }

    this.players.push({
      id: `${sport}_${athlete.id || Date.now()}`,
      name,
      firstName: athlete.firstName || '',
      lastName: athlete.lastName || '',
      team: athlete.team?.displayName || athlete.team?.name || 'Unknown Team',
      teamAbbr: athlete.team?.abbreviation || '',
      position: this.normalizePosition(athlete.position?.displayName || athlete.position?.name || athlete.position?.abbreviation || 'N/A', sport),
      sport,
      headshot,
      searchTerms: this.createSearchTerms(name, athlete.firstName || '', athlete.lastName || '')
    });

    return true;
  }

  private async loadFromTeamRosters(sport: 'NBA' | 'NFL' | 'MLB' | 'NHL', sportPath: string): Promise<number> {
    let sportPlayerCount = 0;

    try {
      // Get teams
      const teamsUrl = `https://site.api.espn.com/apis/site/v2/sports/${sportPath}/teams`;
      const teamsResponse = await fetch(teamsUrl);
      
      if (!teamsResponse.ok) {
        console.warn(`Failed to load ${sport} teams: ${teamsResponse.status}`);
        return sportPlayerCount;
      }

      const teamsData = await teamsResponse.json();
      const teamIds: number[] = [];
      
      if (teamsData.sports?.[0]?.leagues?.[0]?.teams) {
        teamsData.sports[0].leagues[0].teams.forEach((teamObj: any) => {
          if (teamObj.team?.id) {
            teamIds.push(parseInt(teamObj.team.id));
          }
        });
      }

      console.log(`Found ${teamIds.length} ${sport} teams`);

      // Load roster for each team
      for (const teamId of teamIds) {
        try {
          const rosterUrl = `https://site.api.espn.com/apis/site/v2/sports/${sportPath}/teams/${teamId}/roster`;
          const rosterResponse = await fetch(rosterUrl);
          
          if (!rosterResponse.ok) continue;

          const rosterData = await rosterResponse.json();
          
          if (rosterData.athletes && Array.isArray(rosterData.athletes)) {
            rosterData.athletes.forEach((athleteGroup: any) => {
              if (athleteGroup.items && Array.isArray(athleteGroup.items)) {
                athleteGroup.items.forEach((athlete: any) => {
                  const name = athlete.fullName || athlete.displayName;
                  if (!name) return;

                  // Check if player already exists
                  const existingPlayer = this.players.find(p => 
                    p.name.toLowerCase() === name.toLowerCase() && p.sport === sport
                  );
                  if (existingPlayer) return;

                  this.players.push({
                    id: `${sport}_roster_${athlete.id || Date.now()}`,
                    name,
                    firstName: athlete.firstName || '',
                    lastName: athlete.lastName || '',
                    team: rosterData.team?.displayName || 'Unknown Team',
                    teamAbbr: rosterData.team?.abbreviation || '',
                    position: this.normalizePosition(athlete.position?.name || athlete.position?.abbreviation || 'N/A', sport),
                    sport,
                    headshot: athlete.headshot?.href || '',
                    searchTerms: this.createSearchTerms(name, athlete.firstName || '', athlete.lastName || '')
                  });
                  sportPlayerCount++;
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
    } catch (error) {
      console.error(`Error loading ${sport} team rosters:`, error);
    }

    return sportPlayerCount;
  }

  private async loadPopularPlayersForSport(sport: 'NBA' | 'NFL' | 'MLB' | 'NHL'): Promise<void> {
    const popularPlayers = {
      NBA: [
        { name: 'LeBron James', team: 'Los Angeles Lakers', position: 'SF' },
        { name: 'Stephen Curry', team: 'Golden State Warriors', position: 'PG' },
        { name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', position: 'PF' },
        { name: 'Luka Dončić', team: 'Dallas Mavericks', position: 'PG' },
        { name: 'Joel Embiid', team: 'Philadelphia 76ers', position: 'C' },
        { name: 'Nikola Jokic', team: 'Denver Nuggets', position: 'C' },
        { name: 'Jayson Tatum', team: 'Boston Celtics', position: 'SF' },
        { name: 'Kevin Durant', team: 'Phoenix Suns', position: 'SF' },
        { name: 'Anthony Davis', team: 'Los Angeles Lakers', position: 'PF' },
        { name: 'Kawhi Leonard', team: 'LA Clippers', position: 'SF' },
        { name: 'Jimmy Butler', team: 'Miami Heat', position: 'SF' },
        { name: 'Damian Lillard', team: 'Milwaukee Bucks', position: 'PG' },
        { name: 'Anthony Edwards', team: 'Minnesota Timberwolves', position: 'SG' },
        { name: 'Victor Wembanyama', team: 'San Antonio Spurs', position: 'C' },
        { name: 'Shai Gilgeous-Alexander', team: 'Oklahoma City Thunder', position: 'PG' }
      ],
      NFL: [
        { name: 'Patrick Mahomes', team: 'Kansas City Chiefs', position: 'QB' },
        { name: 'Josh Allen', team: 'Buffalo Bills', position: 'QB' },
        { name: 'Lamar Jackson', team: 'Baltimore Ravens', position: 'QB' },
        { name: 'Joe Burrow', team: 'Cincinnati Bengals', position: 'QB' },
        { name: 'Aaron Rodgers', team: 'New York Jets', position: 'QB' },
        { name: 'Justin Herbert', team: 'Los Angeles Chargers', position: 'QB' },
        { name: 'Dak Prescott', team: 'Dallas Cowboys', position: 'QB' },
        { name: 'Tua Tagovailoa', team: 'Miami Dolphins', position: 'QB' },
        { name: 'Christian McCaffrey', team: 'San Francisco 49ers', position: 'RB' },
        { name: 'Travis Kelce', team: 'Kansas City Chiefs', position: 'TE' },
        { name: 'Tyreek Hill', team: 'Miami Dolphins', position: 'WR' },
        { name: 'Cooper Kupp', team: 'Los Angeles Rams', position: 'WR' },
        { name: 'Aaron Donald', team: 'Los Angeles Rams', position: 'DT' },
        { name: 'T.J. Watt', team: 'Pittsburgh Steelers', position: 'LB' },
        { name: 'Myles Garrett', team: 'Cleveland Browns', position: 'DE' }
      ],
      MLB: [
        { name: 'Mike Trout', team: 'Los Angeles Angels', position: 'OF' },
        { name: 'Shohei Ohtani', team: 'Los Angeles Dodgers', position: 'DH/P' },
        { name: 'Aaron Judge', team: 'New York Yankees', position: 'OF' },
        { name: 'Mookie Betts', team: 'Los Angeles Dodgers', position: 'OF' },
        { name: 'Ronald Acuña Jr.', team: 'Atlanta Braves', position: 'OF' },
        { name: 'Juan Soto', team: 'New York Yankees', position: 'OF' },
        { name: 'Fernando Tatis Jr.', team: 'San Diego Padres', position: 'SS' },
        { name: 'Vladimir Guerrero Jr.', team: 'Toronto Blue Jays', position: '1B' },
        { name: 'Francisco Lindor', team: 'New York Mets', position: 'SS' },
        { name: 'Freddie Freeman', team: 'Los Angeles Dodgers', position: '1B' },
        { name: 'Manny Machado', team: 'San Diego Padres', position: '3B' },
        { name: 'Pete Alonso', team: 'New York Mets', position: '1B' },
        { name: 'Jose Altuve', team: 'Houston Astros', position: '2B' },
        { name: 'Yordan Alvarez', team: 'Houston Astros', position: 'DH' },
        { name: 'Kyle Tucker', team: 'Houston Astros', position: 'OF' }
      ],
      NHL: [
        { name: 'Connor McDavid', team: 'Edmonton Oilers', position: 'C' },
        { name: 'Leon Draisaitl', team: 'Edmonton Oilers', position: 'C' },
        { name: 'Nathan MacKinnon', team: 'Colorado Avalanche', position: 'C' },
        { name: 'Auston Matthews', team: 'Toronto Maple Leafs', position: 'C' },
        { name: 'Erik Karlsson', team: 'Pittsburgh Penguins', position: 'D' },
        { name: 'Nikita Kucherov', team: 'Tampa Bay Lightning', position: 'RW' },
        { name: 'David Pastrnak', team: 'Boston Bruins', position: 'RW' },
        { name: 'Igor Shesterkin', team: 'New York Rangers', position: 'G' },
        { name: 'Cale Makar', team: 'Colorado Avalanche', position: 'D' },
        { name: 'Victor Hedman', team: 'Tampa Bay Lightning', position: 'D' },
        { name: 'Sidney Crosby', team: 'Pittsburgh Penguins', position: 'C' },
        { name: 'Alexander Ovechkin', team: 'Washington Capitals', position: 'LW' },
        { name: 'Kirill Kaprizov', team: 'Minnesota Wild', position: 'LW' },
        { name: 'Matthew Tkachuk', team: 'Florida Panthers', position: 'LW' },
        { name: 'Jack Hughes', team: 'New Jersey Devils', position: 'C' }
      ]
    };

    const players = popularPlayers[sport] || [];
    console.log(`Adding ${players.length} popular ${sport} players as fallback`);
    
    players.forEach((player, index) => {
      // Check if player already exists
      const existingPlayer = this.players.find(p => 
        p.name.toLowerCase() === player.name.toLowerCase() && p.sport === sport
      );
      if (!existingPlayer) {
        this.players.push({
          id: `${sport}_popular_${index}`,
          name: player.name,
          firstName: player.name.split(' ')[0],
          lastName: player.name.split(' ').slice(1).join(' '),
          team: player.team,
          teamAbbr: '',
          position: player.position,
          sport,
          headshot: '',
          searchTerms: this.createSearchTerms(player.name, player.name.split(' ')[0], player.name.split(' ').slice(1).join(' '))
        });
      }
    });
  }

  private normalizePosition(position: string, sport: string): string {
    if (sport === 'NBA') {
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

  private createSearchTerms(displayName: string, firstName: string, lastName: string): string[] {
    const terms = [];
    
    if (displayName) terms.push(displayName.toLowerCase());
    
    if (firstName && lastName) {
      terms.push(`${firstName} ${lastName}`.toLowerCase());
      terms.push(lastName.toLowerCase());
      
      // Common nickname variations
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
        score += 100;
      } else if (term.startsWith(searchTerm)) {
        score += 50;
      } else if (term.includes(searchTerm)) {
        score += 25;
      }
    }
    
    if (player.id.startsWith('manual_')) {
      score += 10;
    }
    
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
