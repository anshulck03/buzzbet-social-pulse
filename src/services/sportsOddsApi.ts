
interface GameOdds {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Array<{
    key: string;
    title: string;
    markets: Array<{
      key: string;
      outcomes: Array<{
        name: string;
        price: number;
        point?: number;
      }>;
    }>;
  }>;
  scores?: Array<{
    name: string;
    score: string;
  }>;
}

interface LiveScore {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  completed: boolean;
  home_team: string;
  away_team: string;
  scores: Array<{
    name: string;
    score: string;
  }>;
  last_update: string;
}

class SportsOddsApi {
  private apiKey = 'bc97075688msh160931b3c5ebb01p1aaa3cjsna86cbf04387d';
  private baseUrl = 'https://odds-api1.p.rapidapi.com';

  private async makeRequest(endpoint: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': this.apiKey,
        'X-RapidAPI-Host': 'odds-api1.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  }

  async getPlayerGameInfo(playerName: string, sport: string = 'NBA'): Promise<{
    nextGame?: GameOdds;
    liveGame?: LiveScore;
    lastGame?: LiveScore;
    playerOdds?: any;
  }> {
    try {
      console.log(`Fetching game info for ${playerName} in ${sport}`);
      
      // Map sport to API sport key
      const sportKey = this.getSportKey(sport);
      
      // Get upcoming games
      const upcomingGames = await this.makeRequest(`/odds?sport=${sportKey}&region=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso`);
      
      // Get live/recent scores
      const scores = await this.makeRequest(`/scores?sport=${sportKey}&daysFrom=3`);
      
      return this.processPlayerGameData(playerName, upcomingGames, scores);
      
    } catch (error) {
      console.error('Error fetching sports odds data:', error);
      return this.getFallbackGameData(playerName, sport);
    }
  }

  private getSportKey(sport: string): string {
    const sportMap: Record<string, string> = {
      'NBA': 'basketball_nba',
      'NFL': 'americanfootball_nfl',
      'NHL': 'icehockey_nhl',
      'MLB': 'baseball_mlb'
    };
    return sportMap[sport] || 'basketball_nba';
  }

  private getPlayerTeam(playerName: string, playerData?: any): string | null {
    // First try to get team from player data
    if (playerData?.team) {
      return playerData.team;
    }
    
    // If no player data, try to extract team from team abbreviation
    if (playerData?.teamAbbr) {
      const teamMap: Record<string, string> = {
        // NBA teams
        'LAL': 'Lakers', 'GSW': 'Warriors', 'BOS': 'Celtics', 'MIA': 'Heat',
        'NYK': 'Knicks', 'CHI': 'Bulls', 'SA': 'Spurs', 'PHX': 'Suns',
        // NHL teams  
        'EDM': 'Oilers', 'TOR': 'Maple Leafs', 'VGK': 'Golden Knights',
        'TB': 'Lightning', 'COL': 'Avalanche', 'CAR': 'Hurricanes',
        // NFL teams
        'KC': 'Chiefs', 'BUF': 'Bills', 'SF': '49ers', 'DAL': 'Cowboys',
        // MLB teams
        'LAD': 'Dodgers', 'NYY': 'Yankees', 'HOU': 'Astros', 'ATL': 'Braves'
      };
      return teamMap[playerData.teamAbbr] || null;
    }
    
    return null;
  }

  private normalizeTeamName(teamName: string): string {
    // Remove common prefixes and normalize team names for matching
    return teamName
      .replace(/^(Los Angeles|New York|San Francisco|Golden State|Tampa Bay)/, '')
      .replace(/Lakers|Warriors|Knicks|Rangers|Giants|49ers|Lightning/g, (match) => match)
      .trim()
      .toLowerCase();
  }

  private isTeamMatch(gameTeam: string, playerTeam: string): boolean {
    if (!playerTeam) return false;
    
    const normalizedGameTeam = this.normalizeTeamName(gameTeam);
    const normalizedPlayerTeam = this.normalizeTeamName(playerTeam);
    
    // Direct match
    if (normalizedGameTeam === normalizedPlayerTeam) return true;
    
    // Check if either team name contains the other
    if (normalizedGameTeam.includes(normalizedPlayerTeam) || 
        normalizedPlayerTeam.includes(normalizedGameTeam)) return true;
    
    // Special cases for common team name variations
    const teamVariations: Record<string, string[]> = {
      'lakers': ['lal', 'los angeles lakers'],
      'warriors': ['gsw', 'golden state warriors'],
      'oilers': ['edm', 'edmonton oilers'],
      'maple leafs': ['tor', 'toronto maple leafs'],
      'chiefs': ['kc', 'kansas city chiefs']
    };
    
    for (const [key, variations] of Object.entries(teamVariations)) {
      if ((key === normalizedPlayerTeam || variations.includes(normalizedPlayerTeam)) &&
          (key === normalizedGameTeam || variations.includes(normalizedGameTeam))) {
        return true;
      }
    }
    
    return false;
  }

  private processPlayerGameData(playerName: string, upcomingGames: GameOdds[], scores: LiveScore[], playerData?: any): {
    nextGame?: GameOdds;
    liveGame?: LiveScore;
    lastGame?: LiveScore;
    playerOdds?: any;
  } {
    const playerTeam = this.getPlayerTeam(playerName, playerData);
    console.log(`Processing games for ${playerName}, team: ${playerTeam}`);
    
    const result: any = {};
    
    if (playerTeam) {
      // Find live game for player's team
      const liveGame = scores.find(game => 
        !game.completed && 
        new Date(game.commence_time) <= new Date() &&
        (this.isTeamMatch(game.home_team, playerTeam) || this.isTeamMatch(game.away_team, playerTeam))
      );
      
      if (liveGame) {
        result.liveGame = liveGame;
        console.log(`Found live game: ${liveGame.away_team} @ ${liveGame.home_team}`);
      }
      
      // Find next upcoming game for player's team
      const nextGame = upcomingGames.find(game => 
        new Date(game.commence_time) > new Date() &&
        (this.isTeamMatch(game.home_team, playerTeam) || this.isTeamMatch(game.away_team, playerTeam))
      );
      
      if (nextGame) {
        result.nextGame = nextGame;
        console.log(`Found next game: ${nextGame.away_team} @ ${nextGame.home_team}`);
      }
      
      // Find last completed game for player's team
      const lastGame = scores
        .filter(game => 
          game.completed &&
          (this.isTeamMatch(game.home_team, playerTeam) || this.isTeamMatch(game.away_team, playerTeam))
        )
        .sort((a, b) => new Date(b.commence_time).getTime() - new Date(a.commence_time).getTime())[0];
      
      if (lastGame) {
        result.lastGame = lastGame;
        console.log(`Found last game: ${lastGame.away_team} @ ${lastGame.home_team}`);
      }
    }
    
    return result;
  }

  private getFallbackGameData(playerName: string, sport: string, playerData?: any) {
    const playerTeam = this.getPlayerTeam(playerName, playerData) || 'Team';
    
    return {
      nextGame: {
        id: 'demo-next',
        sport_key: sport.toLowerCase(),
        sport_title: sport,
        commence_time: new Date(Date.now() + 86400000).toISOString(),
        home_team: 'Opponent',
        away_team: playerTeam,
        bookmakers: [{
          key: 'fanduel',
          title: 'FanDuel',
          markets: [{
            key: 'h2h',
            outcomes: [
              { name: playerTeam, price: -110 },
              { name: 'Opponent', price: -110 }
            ]
          }]
        }]
      },
      lastGame: {
        id: 'demo-last',
        sport_key: sport.toLowerCase(),
        sport_title: sport,
        commence_time: new Date(Date.now() - 86400000).toISOString(),
        completed: true,
        home_team: 'Opponent',
        away_team: playerTeam,
        scores: [
          { name: playerTeam, score: '108' },
          { name: 'Opponent', score: '112' }
        ],
        last_update: new Date().toISOString()
      }
    };
  }
}

export const sportsOddsApi = new SportsOddsApi();
export type { GameOdds, LiveScore };
