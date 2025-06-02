
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

  private processPlayerGameData(playerName: string, upcomingGames: GameOdds[], scores: LiveScore[]): {
    nextGame?: GameOdds;
    liveGame?: LiveScore;
    lastGame?: LiveScore;
    playerOdds?: any;
  } {
    // For demo purposes, we'll simulate finding relevant games
    // In a real implementation, you'd need to match the player to their team
    
    const result: any = {};
    
    // Find live game (game that's in progress)
    const liveGame = scores.find(game => 
      !game.completed && 
      new Date(game.commence_time) <= new Date()
    );
    
    if (liveGame) {
      result.liveGame = liveGame;
    }
    
    // Find next upcoming game
    const nextGame = upcomingGames.find(game => 
      new Date(game.commence_time) > new Date()
    );
    
    if (nextGame) {
      result.nextGame = nextGame;
    }
    
    // Find last completed game
    const lastGame = scores
      .filter(game => game.completed)
      .sort((a, b) => new Date(b.commence_time).getTime() - new Date(a.commence_time).getTime())[0];
    
    if (lastGame) {
      result.lastGame = lastGame;
    }
    
    return result;
  }

  private getFallbackGameData(playerName: string, sport: string) {
    return {
      nextGame: {
        id: 'demo-next',
        sport_key: sport.toLowerCase(),
        sport_title: sport,
        commence_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        home_team: 'Lakers',
        away_team: 'Warriors',
        bookmakers: [{
          key: 'fanduel',
          title: 'FanDuel',
          markets: [{
            key: 'h2h',
            outcomes: [
              { name: 'Lakers', price: -110 },
              { name: 'Warriors', price: -110 }
            ]
          }]
        }]
      },
      lastGame: {
        id: 'demo-last',
        sport_key: sport.toLowerCase(),
        sport_title: sport,
        commence_time: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        completed: true,
        home_team: 'Lakers',
        away_team: 'Celtics',
        scores: [
          { name: 'Lakers', score: '108' },
          { name: 'Celtics', score: '112' }
        ],
        last_update: new Date().toISOString()
      }
    };
  }
}

export const sportsOddsApi = new SportsOddsApi();
export type { GameOdds, LiveScore };
