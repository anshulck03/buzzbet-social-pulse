
import { ESPNPlayer, espnPlayerDB } from './espnPlayerDatabase';

interface PlayerScore {
  player: ESPNPlayer;
  redditBuzzScore: number;
  performanceScore: number;
  fantasyScore: number;
  newsScore: number;
  totalScore: number;
  trendingIndicator?: 'trending' | 'elite' | 'injured';
}

class DynamicPlayerRankingService {
  private cachedRankings: Map<string, PlayerScore[]> = new Map();
  private lastUpdate: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  // Simulate Reddit buzz scoring based on player popularity and current events
  private calculateRedditBuzzScore(player: ESPNPlayer): number {
    const popularPlayers = [
      'Patrick Mahomes', 'Josh Allen', 'Lamar Jackson', 'Joe Burrow', // NFL
      'LeBron James', 'Stephen Curry', 'Luka Dončić', 'Giannis Antetokounmpo', // NBA
      'Aaron Judge', 'Shohei Ohtani', 'Mike Trout', 'Mookie Betts', // MLB
      'Connor McDavid', 'Nathan MacKinnon', 'Auston Matthews', 'Leon Draisaitl' // NHL
    ];
    
    let score = Math.random() * 50; // Base random component
    
    if (popularPlayers.includes(player.name)) {
      score += 30;
    }
    
    // Boost for certain teams with high fan engagement
    const popularTeams = ['Lakers', 'Cowboys', 'Yankees', 'Warriors', 'Chiefs', 'Celtics'];
    if (popularTeams.some(team => player.team.includes(team))) {
      score += 15;
    }
    
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
    news: number
  ): number {
    return (redditBuzz * 0.4) + (performance * 0.3) + (fantasy * 0.2) + (news * 0.1);
  }

  private assignTrendingIndicator(player: ESPNPlayer, totalScore: number): 'trending' | 'elite' | 'injured' | undefined {
    const trendingPlayers = ['Victor Wembanyama', 'Caleb Williams', 'Connor Bedard'];
    const elitePlayers = ['Patrick Mahomes', 'LeBron James', 'Connor McDavid', 'Aaron Judge'];
    const injuredPlayers = ['Kawhi Leonard', 'Zion Williamson', 'Ben Simmons'];
    
    if (trendingPlayers.includes(player.name)) return 'trending';
    if (elitePlayers.includes(player.name)) return 'elite';
    if (injuredPlayers.includes(player.name)) return 'injured';
    
    // Assign based on score thresholds
    if (totalScore > 80) return 'elite';
    if (totalScore > 65) return 'trending';
    
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
      const totalScore = this.calculateTotalScore(redditBuzzScore, performanceScore, fantasyScore, newsScore);
      
      playerScores.push({
        player,
        redditBuzzScore,
        performanceScore,
        fantasyScore,
        newsScore,
        totalScore,
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

  async getElitePlayers(limit: number = 5): Promise<PlayerScore[]> {
    const cacheKey = `elite_${limit}`;
    const now = Date.now();
    
    if (this.cachedRankings.has(cacheKey) && 
        this.lastUpdate.has(cacheKey) && 
        (now - this.lastUpdate.get(cacheKey)!) < this.CACHE_DURATION) {
      return this.cachedRankings.get(cacheKey)!;
    }

    const allPlayers: PlayerScore[] = [];
    const sports = ['NBA', 'NFL', 'MLB', 'NHL'];
    
    for (const sport of sports) {
      const sportPlayers = await this.getTopPlayersBySport(sport, 10);
      allPlayers.push(...sportPlayers);
    }

    const elitePlayers = allPlayers
      .filter(p => p.totalScore > 75)
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit)
      .map(p => ({ ...p, trendingIndicator: 'elite' as const }));

    this.cachedRankings.set(cacheKey, elitePlayers);
    this.lastUpdate.set(cacheKey, now);

    return elitePlayers;
  }

  async getInjuredPlayers(limit: number = 5): Promise<PlayerScore[]> {
    const cacheKey = `injured_${limit}`;
    const now = Date.now();
    
    if (this.cachedRankings.has(cacheKey) && 
        this.lastUpdate.has(cacheKey) && 
        (now - this.lastUpdate.get(cacheKey)!) < this.CACHE_DURATION) {
      return this.cachedRankings.get(cacheKey)!;
    }

    // Simulate injured players with high discussion volume
    const injuredPlayerNames = [
      'Kawhi Leonard', 'Zion Williamson', 'Ben Simmons', 'Jonathan Isaac',
      'Klay Thompson', 'Aaron Rodgers', 'Christian McCaffrey', 'Saquon Barkley'
    ];

    const allPlayers: PlayerScore[] = [];
    const sports = ['NBA', 'NFL', 'MLB', 'NHL'];
    
    for (const sport of sports) {
      const sportPlayers = await this.getTopPlayersBySport(sport, 50);
      allPlayers.push(...sportPlayers);
    }

    const injuredPlayers = allPlayers
      .filter(p => injuredPlayerNames.includes(p.player.name))
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit)
      .map(p => ({ ...p, trendingIndicator: 'injured' as const }));

    this.cachedRankings.set(cacheKey, injuredPlayers);
    this.lastUpdate.set(cacheKey, now);

    return injuredPlayers;
  }

  clearCache(): void {
    this.cachedRankings.clear();
    this.lastUpdate.clear();
  }
}

export const dynamicPlayerRanking = new DynamicPlayerRankingService();
export type { PlayerScore };
