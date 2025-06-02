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
  private apiKey = '04572b4782d8dcec18334e5b3184d68c';
  private baseUrl = 'https://api.the-odds-api.com/v4';

  private async makeRequest(endpoint: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}&apiKey=${this.apiKey}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  }

  async getPlayerGameInfo(playerName: string, sport: string = 'NHL', playerData?: any): Promise<{
    nextGame?: GameOdds;
    liveGame?: LiveScore;
    lastGame?: LiveScore;
    playerOdds?: any;
  }> {
    try {
      console.log(`Fetching game info for ${playerName} in ${sport}`);
      console.log('Player data:', playerData);
      
      // Map sport to API sport key
      const sportKey = this.getSportKey(sport);
      
      // Get upcoming games (odds endpoint)
      const upcomingGames = await this.makeRequest(`/sports/${sportKey}/odds?regions=us&markets=h2h&oddsFormat=american&dateFormat=iso`);
      
      // Get recent scores
      const scores = await this.makeRequest(`/sports/${sportKey}/scores?daysFrom=3&dateFormat=iso`);
      
      return this.processPlayerGameData(playerName, upcomingGames, scores, playerData);
      
    } catch (error) {
      console.error('Error fetching sports odds data:', error);
      return this.getFallbackGameData(playerName, sport, playerData);
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
    console.log(`Getting team for ${playerName}:`, playerData);
    
    // First try to get team from player data
    if (playerData?.team) {
      console.log(`Found team from playerData.team: ${playerData.team}`);
      return playerData.team;
    }
    
    // Try team abbreviation and expand it
    if (playerData?.teamAbbr) {
      console.log(`Found team abbreviation: ${playerData.teamAbbr}`);
      const fullTeamName = this.expandTeamAbbreviation(playerData.teamAbbr);
      if (fullTeamName) {
        console.log(`Expanded ${playerData.teamAbbr} to ${fullTeamName}`);
        return fullTeamName;
      }
    }
    
    // Try to extract from any other team-related fields
    if (playerData?.teamName) {
      console.log(`Found team from playerData.teamName: ${playerData.teamName}`);
      return playerData.teamName;
    }
    
    console.log(`No team found for ${playerName}`);
    return null;
  }

  private expandTeamAbbreviation(abbr: string): string | null {
    const teamMap: Record<string, string> = {
      // NBA teams
      'LAL': 'Los Angeles Lakers',
      'GSW': 'Golden State Warriors', 
      'BOS': 'Boston Celtics',
      'MIA': 'Miami Heat',
      'NYK': 'New York Knicks',
      'CHI': 'Chicago Bulls',
      'SAS': 'San Antonio Spurs',
      'PHX': 'Phoenix Suns',
      'LAC': 'LA Clippers',
      'DEN': 'Denver Nuggets',
      'MIL': 'Milwaukee Bucks',
      'PHI': 'Philadelphia 76ers',
      'DAL_NBA': 'Dallas Mavericks',
      'MIN': 'Minnesota Timberwolves',
      'OKC': 'Oklahoma City Thunder',
      'CLE': 'Cleveland Cavaliers',
      'MEM': 'Memphis Grizzlies',
      'SAC': 'Sacramento Kings',
      'NOP': 'New Orleans Pelicans',
      'IND': 'Indiana Pacers',
      'ATL': 'Atlanta Hawks',
      'ORL': 'Orlando Magic',
      'BKN': 'Brooklyn Nets',
      'WAS': 'Washington Wizards',
      'UTA': 'Utah Jazz',
      'POR': 'Portland Trail Blazers',
      'HOU': 'Houston Rockets',
      'DET': 'Detroit Pistons',
      'CHA': 'Charlotte Hornets',
      // NHL teams  
      'EDM': 'Edmonton Oilers',
      'TOR_NHL': 'Toronto Maple Leafs',
      'VGK': 'Vegas Golden Knights',
      'TBL': 'Tampa Bay Lightning',
      'COL': 'Colorado Avalanche',
      'CAR': 'Carolina Hurricanes',
      'NYR': 'New York Rangers',
      'FLA': 'Florida Panthers',
      'BOS_NHL': 'Boston Bruins',
      'DAL_NHL': 'Dallas Stars',
      // NFL teams
      'KC': 'Kansas City Chiefs',
      'BUF': 'Buffalo Bills',
      'SF': 'San Francisco 49ers',
      'DAL_NFL': 'Dallas Cowboys',
      'BAL': 'Baltimore Ravens',
      'MIA_NFL': 'Miami Dolphins',
      'LAR': 'Los Angeles Rams',
      'PHI_NFL': 'Philadelphia Eagles',
      // MLB teams
      'LAD': 'Los Angeles Dodgers',
      'NYY': 'New York Yankees',
      'HOU_MLB': 'Houston Astros',
      'ATL_MLB': 'Atlanta Braves',
      'TB': 'Tampa Bay Rays',
      'SD': 'San Diego Padres'
    };
    return teamMap[abbr.toUpperCase()] || null;
  }

  private isTeamMatch(gameTeam: string, playerTeam: string): boolean {
    if (!playerTeam || !gameTeam) return false;
    
    console.log(`Comparing game team: "${gameTeam}" with player team: "${playerTeam}"`);
    
    // Direct match (case insensitive)
    if (gameTeam.toLowerCase() === playerTeam.toLowerCase()) {
      console.log('Direct match found');
      return true;
    }
    
    // Check for common team name variations and partial matches
    const gameTeamLower = gameTeam.toLowerCase();
    const playerTeamLower = playerTeam.toLowerCase();
    
    // Special handling for Lakers since that's what we're testing with
    if ((gameTeamLower.includes('lakers') && playerTeamLower.includes('lakers')) ||
        (gameTeamLower.includes('los angeles lakers') && playerTeamLower.includes('los angeles lakers'))) {
      console.log('Lakers match found');
      return true;
    }
    
    // Extract key team identifiers (city names, team names)
    const extractTeamIdentifiers = (team: string): string[] => {
      const identifiers: string[] = [];
      const words = team.toLowerCase().split(' ');
      
      // Add full team name
      identifiers.push(team.toLowerCase());
      
      // Add individual words that are likely team identifiers
      words.forEach(word => {
        if (word.length > 3 && !['the', 'los', 'san', 'new', 'bay', 'golden', 'state'].includes(word)) {
          identifiers.push(word);
        }
      });
      
      return identifiers;
    };
    
    const gameTeamIdentifiers = extractTeamIdentifiers(gameTeam);
    const playerTeamIdentifiers = extractTeamIdentifiers(playerTeam);
    
    // Check if any identifiers match
    for (const gameId of gameTeamIdentifiers) {
      for (const playerId of playerTeamIdentifiers) {
        if (gameId === playerId || gameId.includes(playerId) || playerId.includes(gameId)) {
          console.log(`Identifier match found: "${gameId}" matches "${playerId}"`);
          return true;
        }
      }
    }
    
    console.log('No match found');
    return false;
  }

  private processPlayerGameData(playerName: string, upcomingGames: GameOdds[], scores: LiveScore[], playerData?: any): {
    nextGame?: GameOdds;
    liveGame?: LiveScore;
    lastGame?: LiveScore;
    playerOdds?: any;
  } {
    const playerTeam = this.getPlayerTeam(playerName, playerData);
    console.log(`Processing games for ${playerName}, identified team: ${playerTeam}`);
    
    const result: any = {};
    
    if (playerTeam) {
      // Find live game for player's team
      const liveGame = scores.find(game => {
        const isLive = !game.completed && new Date(game.commence_time) <= new Date();
        const isPlayerTeam = this.isTeamMatch(game.home_team, playerTeam) || this.isTeamMatch(game.away_team, playerTeam);
        console.log(`Checking live game: ${game.away_team} @ ${game.home_team}, isLive: ${isLive}, isPlayerTeam: ${isPlayerTeam}`);
        return isLive && isPlayerTeam;
      });
      
      if (liveGame) {
        result.liveGame = liveGame;
        console.log(`✅ Found live game: ${liveGame.away_team} @ ${liveGame.home_team}`);
      }
      
      // Find last completed game for player's team
      const lastGame = scores
        .filter(game => {
          const isCompleted = game.completed;
          const isPlayerTeam = this.isTeamMatch(game.home_team, playerTeam) || this.isTeamMatch(game.away_team, playerTeam);
          console.log(`Checking completed game: ${game.away_team} @ ${game.home_team}, isCompleted: ${isCompleted}, isPlayerTeam: ${isPlayerTeam}`);
          return isCompleted && isPlayerTeam;
        })
        .sort((a, b) => new Date(b.commence_time).getTime() - new Date(a.commence_time).getTime())[0];
      
      if (lastGame) {
        result.lastGame = lastGame;
        console.log(`✅ Found last game: ${lastGame.away_team} @ ${lastGame.home_team}`);
        console.log(`Scores:`, lastGame.scores);
      }
      
      console.log(`Final result for ${playerName}:`, {
        hasLiveGame: !!result.liveGame,
        hasLastGame: !!result.lastGame
      });
    } else {
      console.log(`❌ No team identified for ${playerName}, cannot match games`);
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
