
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
    const sportAPIs = [
      { sport: 'NBA' as const, url: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/athletes' },
      { sport: 'NFL' as const, url: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/athletes' },
      { sport: 'MLB' as const, url: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/athletes' },
      { sport: 'NHL' as const, url: 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/athletes' }
    ];

    console.log('Loading players from ESPN...');

    for (const { sport, url } of sportAPIs) {
      try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.athletes) {
          data.athletes.forEach((athlete: any) => {
            this.players.push({
              id: `${sport}_${athlete.id}`,
              name: athlete.displayName,
              firstName: athlete.firstName || '',
              lastName: athlete.lastName || '',
              team: athlete.team?.displayName || 'Free Agent',
              teamAbbr: athlete.team?.abbreviation || '',
              position: athlete.position?.abbreviation || 'N/A',
              sport: sport,
              headshot: athlete.headshot?.href || '',
              searchTerms: this.createSearchTerms(athlete.displayName, athlete.firstName, athlete.lastName)
            });
          });
          
          console.log(`Loaded ${data.athletes.length} ${sport} players`);
        }
      } catch (error) {
        console.error(`Failed to load ${sport} players:`, error);
        // Continue with other sports even if one fails
      }
      
      // Small delay to be respectful
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.isLoaded = true;
    console.log(`Total players loaded: ${this.players.length}`);
    return this.players;
  }

  private createSearchTerms(displayName: string, firstName: string, lastName: string): string[] {
    const terms = [displayName.toLowerCase()];
    
    if (firstName && lastName) {
      terms.push(`${firstName} ${lastName}`.toLowerCase());
      terms.push(lastName.toLowerCase()); // Just last name
    }
    
    // Add common nickname patterns
    if (firstName) {
      // Anthony -> Ant, Anthony -> Tony
      if (firstName === 'Anthony') {
        terms.push(`ant ${lastName}`.toLowerCase());
        terms.push(`tony ${lastName}`.toLowerCase());
      }
      // Christopher -> Chris
      if (firstName === 'Christopher') {
        terms.push(`chris ${lastName}`.toLowerCase());
      }
      // Alexander -> Alex
      if (firstName === 'Alexander') {
        terms.push(`alex ${lastName}`.toLowerCase());
      }
    }
    
    return terms;
  }

  searchPlayers(query: string, limit = 8): ESPNPlayer[] {
    if (!query || query.length < 2) return [];
    
    const searchTerm = query.toLowerCase().trim();
    const matches: ESPNPlayer[] = [];
    
    for (const player of this.players) {
      // Check if any search term includes the query
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
