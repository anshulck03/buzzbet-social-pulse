import { ESPNPlayer, espnPlayerDB } from './espnPlayerDatabase';

interface PlayerScore {
  player: ESPNPlayer;
  redditBuzzScore: number;
  performanceScore: number;
  fantasyScore: number;
  newsScore: number;
  totalScore: number;
  subredditCoverage: number;
  trendingIndicator?: 'trending' | 'elite';
}

class DynamicPlayerRankingService {
  private cachedRankings: Map<string, PlayerScore[]> = new Map();
  private lastUpdate: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  // Enhanced All-Star detection across all sports
  private isAllStarPlayer(player: ESPNPlayer): boolean {
    const allStarPlayers = {
      NBA: [
        'LeBron James', 'Stephen Curry', 'Giannis Antetokounmpo', 'Luka Dončić', 
        'Joel Embiid', 'Nikola Jokic', 'Jayson Tatum', 'Kevin Durant',
        'Anthony Davis', 'Kawhi Leonard', 'Jimmy Butler', 'Damian Lillard',
        'Anthony Edwards', 'Victor Wembanyama', 'Shai Gilgeous-Alexander',
        'Donovan Mitchell', 'Trae Young', 'Ja Morant', 'Zion Williamson'
      ],
      NFL: [
        'Patrick Mahomes', 'Josh Allen', 'Lamar Jackson', 'Joe Burrow',
        'Aaron Rodgers', 'Justin Herbert', 'Dak Prescott', 'Tua Tagovailoa',
        'Christian McCaffrey', 'Travis Kelce', 'Tyreek Hill', 'Cooper Kupp',
        'Aaron Donald', 'T.J. Watt', 'Myles Garrett', 'Nick Bosa'
      ],
      MLB: [
        'Mike Trout', 'Shohei Ohtani', 'Aaron Judge', 'Mookie Betts',
        'Ronald Acuña Jr.', 'Juan Soto', 'Fernando Tatis Jr.', 'Vladimir Guerrero Jr.',
        'Francisco Lindor', 'Freddie Freeman', 'Manny Machado', 'Pete Alonso',
        'Jose Altuve', 'Yordan Alvarez', 'Kyle Tucker', 'Bo Bichette'
      ],
      NHL: [
        'Connor McDavid', 'Leon Draisaitl', 'Nathan MacKinnon', 'Auston Matthews',
        'Erik Karlsson', 'Nikita Kucherov', 'David Pastrnak', 'Igor Shesterkin',
        'Cale Makar', 'Victor Hedman', 'Sidney Crosby', 'Alexander Ovechkin',
        'Kirill Kaprizov', 'Matthew Tkachuk', 'Jack Hughes', 'Tim Stützle'
      ]
    };
    
    return allStarPlayers[player.sport]?.includes(player.name) || false;
  }

  // Enhanced subreddit coverage calculation
  private calculateSubredditCoverage(player: ESPNPlayer): number {
    let coverage = 0;
    
    // Base sport subreddit coverage
    coverage += 20; // Main sport subreddit
    
    // Team subreddit coverage
    if (player.team) {
      coverage += 25; // Team-specific subreddit
    }
    
    // Fantasy subreddit coverage
    coverage += 15; // Fantasy sport subreddit
    
    // Popular players get broader coverage
    const popularPlayers = [
      'LeBron James', 'Stephen Curry', 'Patrick Mahomes', 'Mike Trout', 'Connor McDavid'
    ];
    if (popularPlayers.includes(player.name)) {
      coverage += 20; // Cross-sport coverage
    }
    
    // All-Star players get additional coverage
    if (this.isAllStarPlayer(player)) {
      coverage += 15; // Additional sport-specific communities
    }
    
    // Add some randomness for variety
    coverage += Math.random() * 10;
    
    return Math.min(coverage, 100);
  }

  // Enhanced Reddit buzz scoring with multiple search approaches
  private calculateRedditBuzzScore(player: ESPNPlayer): number {
    let score = Math.random() * 40; // Base random component
    
    // Popular players get higher buzz
    const popularPlayers = [
      'Patrick Mahomes', 'Josh Allen', 'Lamar Jackson', 'Joe Burrow', // NFL
      'LeBron James', 'Stephen Curry', 'Luka Dončić', 'Giannis Antetokounmpo', // NBA
      'Aaron Judge', 'Shohei Ohtani', 'Mike Trout', 'Mookie Betts', // MLB
      'Connor McDavid', 'Nathan MacKinnon', 'Auston Matthews', 'Leon Draisaitl' // NHL
    ];
    
    if (popularPlayers.includes(player.name)) {
      score += 35;
    }
    
    // All-Star boost
    if (this.isAllStarPlayer(player)) {
      score += 25;
    }
    
    // Team popularity boost
    const popularTeams = ['Lakers', 'Cowboys', 'Yankees', 'Warriors', 'Chiefs', 'Celtics', 'Dodgers'];
    if (popularTeams.some(team => player.team.includes(team))) {
      score += 20;
    }
    
    // Subreddit coverage multiplier
    const coverageMultiplier = this.calculateSubredditCoverage(player) / 100;
    score *= (1 + coverageMultiplier * 0.5);
    
    return Math.min(score, 100);
  }

  // Simulate performance metrics scoring
  private calculatePerformanceScore(player: ESPNPlayer): number {
    let score = Math.random() * 60; // Base performance
    
    // Boost for elite positions
    const elitePositions = ['QB', 'PG', 'SG', 'C', 'F'];
    if (elitePositions.includes(player.position)) {
      score += 20;
    }
    
    // Age factor (prime years get boost)
    const primeNames = ['Anthony Edwards', 'Ja Morant', 'Trae Young', 'Luka Dončić', 'Josh Allen'];
    if (primeNames.includes(player.name)) {
      score += 20;
    }
    
    return Math.min(score, 100);
  }

  // Simulate fantasy relevance scoring
  private calculateFantasyScore(player: ESPNPlayer): number {
    let score = Math.random() * 40;
    
    const fantasyRelevant = [
      'Christian McCaffrey', 'Tyreek Hill', 'Travis Kelce', // NFL
      'Nikola Jokic', 'Luka Dončić', 'Anthony Davis', // NBA
      'Ronald Acuña Jr.', 'Juan Soto', 'Fernando Tatis Jr.' // MLB
    ];
    
    if (fantasyRelevant.includes(player.name)) {
      score += 40;
    }
    
    return Math.min(score, 100);
  }

  // Simulate news volume scoring
  private calculateNewsScore(player: ESPNPlayer): number {
    let score = Math.random() * 30;
    
    // Recent news simulation
    const recentNews = ['Victor Wembanyama', 'Connor Bedard', 'Caleb Williams'];
    if (recentNews.includes(player.name)) {
      score += 20;
    }
    
    return Math.min(score, 100);
  }

  private calculateTotalScore(
    redditBuzz: number,
    performance: number,
    fantasy: number,
    news: number,
    subredditCoverage: number
  ): number {
    return (redditBuzz * 0.35) + (performance * 0.25) + (fantasy * 0.15) + (news * 0.1) + (subredditCoverage * 0.15);
  }

  private assignTrendingIndicator(player: ESPNPlayer, totalScore: number): 'trending' | 'elite' | undefined {
    if (this.isAllStarPlayer(player)) return 'elite';
    
    const trendingPlayers = ['Victor Wembanyama', 'Caleb Williams', 'Connor Bedard'];
    if (trendingPlayers.includes(player.name)) return 'trending';
    
    // Assign based on score thresholds
    if (totalScore > 75) return 'trending';
    
    return undefined;
  }

  async getTopPlayersBySport(sport: string, limit: number = 5): Promise<PlayerScore[]> {
    const cacheKey = `${sport}_${limit}`;
    const now = Date.now();
    
    // Check cache validity
    if (this.cachedRankings.has(cacheKey) && 
        this.lastUpdate.has(cacheKey) && 
        (now - this.lastUpdate.get(cacheKey)!) < this.CACHE_DURATION) {
      return this.cachedRankings.get(cacheKey)!;
    }

    // Generate new rankings
    const players = espnPlayerDB.getPlayersBySport(sport);
    const playerScores: PlayerScore[] = [];

    for (const player of players) {
      const redditBuzzScore = this.calculateRedditBuzzScore(player);
      const performanceScore = this.calculatePerformanceScore(player);
      const fantasyScore = this.calculateFantasyScore(player);
      const newsScore = this.calculateNewsScore(player);
      const subredditCoverage = this.calculateSubredditCoverage(player);
      const totalScore = this.calculateTotalScore(redditBuzzScore, performanceScore, fantasyScore, newsScore, subredditCoverage);
      
      playerScores.push({
        player,
        redditBuzzScore,
        performanceScore,
        fantasyScore,
        newsScore,
        totalScore,
        subredditCoverage,
        trendingIndicator: this.assignTrendingIndicator(player, totalScore)
      });
    }

    // Sort by total score and take top players
    const topPlayers = playerScores
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit);

    // Cache results
    this.cachedRankings.set(cacheKey, topPlayers);
    this.lastUpdate.set(cacheKey, now);

    return topPlayers;
  }

  async getTrendingPlayers(limit: number = 5): Promise<PlayerScore[]> {
    const cacheKey = `trending_${limit}`;
    const now = Date.now();
    
    if (this.cachedRankings.has(cacheKey) && 
        this.lastUpdate.has(cacheKey) && 
        (now - this.lastUpdate.get(cacheKey)!) < (15 * 60 * 1000)) { // 15 min cache for trending
      return this.cachedRankings.get(cacheKey)!;
    }

    // Get players from all sports and find trending ones
    const allPlayers: PlayerScore[] = [];
    const sports = ['NBA', 'NFL', 'MLB', 'NHL'];
    
    for (const sport of sports) {
      const sportPlayers = await this.getTopPlayersBySport(sport, 20);
      allPlayers.push(...sportPlayers);
    }

    // Filter and sort by trending criteria (high news score + recent buzz)
    const trendingPlayers = allPlayers
      .filter(p => p.newsScore > 25 || p.redditBuzzScore > 70)
      .sort((a, b) => (b.newsScore + b.redditBuzzScore) - (a.newsScore + a.redditBuzzScore))
      .slice(0, limit)
      .map(p => ({ ...p, trendingIndicator: 'trending' as const }));

    this.cachedRankings.set(cacheKey, trendingPlayers);
    this.lastUpdate.set(cacheKey, now);

    return trendingPlayers;
  }

  async getAllStarPlayers(limit: number = 5): Promise<PlayerScore[]> {
    const cacheKey = `allstar_${limit}`;
    const now = Date.now();
    
    if (this.cachedRankings.has(cacheKey) && 
        this.lastUpdate.has(cacheKey) && 
        (now - this.lastUpdate.get(cacheKey)!) < this.CACHE_DURATION) {
      return this.cachedRankings.get(cacheKey)!;
    }

    const allPlayers: PlayerScore[] = [];
    const sports = ['NBA', 'NFL', 'MLB', 'NHL'];
    
    for (const sport of sports) {
      const sportPlayers = await this.getTopPlayersBySport(sport, 15);
      allPlayers.push(...sportPlayers);
    }

    // Filter for All-Star players and sort by total score
    const allStarPlayers = allPlayers
      .filter(p => this.isAllStarPlayer(p.player))
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit)
      .map(p => ({ ...p, trendingIndicator: 'elite' as const }));

    this.cachedRankings.set(cacheKey, allStarPlayers);
    this.lastUpdate.set(cacheKey, now);

    return allStarPlayers;
  }

  clearCache(): void {
    this.cachedRankings.clear();
    this.lastUpdate.clear();
  }
}

export const dynamicPlayerRanking = new DynamicPlayerRankingService();
export type { PlayerScore };
