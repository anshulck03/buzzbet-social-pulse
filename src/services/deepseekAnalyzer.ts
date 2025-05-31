
interface DeepSeekPostAnalysis {
  performanceScore: number;
  confidence: number;
  category: 'injury' | 'performance' | 'trade' | 'team_chemistry' | 'personal' | 'fantasy' | 'general';
  riskLevel: 'low' | 'medium' | 'high';
  keyInsights: string[];
  recency: 'breaking' | 'recent' | 'old';
  reliability: 'confirmed' | 'rumor' | 'speculation';
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentConfidence: number;
  sport: 'NBA' | 'NFL' | 'NHL' | 'MLB' | 'unknown';
}

export interface DeepSeekSummaryAnalysis {
  playerSummary: string;
  performanceTrajectory: 'Rising Star' | 'Proven Performer' | 'Declining' | 'Sleeper Pick' | 'Avoid';
  keyTrends: string[];
  riskFactors: string[];
  opportunities: string[];
  fantasyImpact: string;
  recommendation: string;
  performanceScore: number;
  trajectoryConfidence: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentConfidence: number;
  sport: 'NBA' | 'NFL' | 'NHL' | 'MLB' | 'unknown';
  subredditsAnalyzed: string[];
  
  // New sections
  recentPerformance: {
    lastThreeGames: string;
    injuryStatus: 'Healthy' | 'Questionable' | 'Doubtful' | 'Out';
    injuryDescription: string;
    matchupDifficulty: 'Easy' | 'Moderate' | 'Tough';
    matchupReasoning: string;
  };
  fantasyInsights: {
    startSitRecommendation: 'Must Start' | 'Start' | 'Flex' | 'Sit' | 'Avoid';
    startSitConfidence: number;
    tradeValueTrend: 'Rising' | 'Stable' | 'Falling';
    tradeValueExplanation: string;
    restOfSeasonOutlook: string;
    pprRelevance: string;
    dynastyRelevance: string;
  };
  breakingNews: {
    hasRecentNews: boolean;
    newsItems: Array<{
      content: string;
      timestamp: string;
      sourceQuality: 'Verified' | 'Team Source' | 'Speculation';
      category: 'Injury' | 'Trade' | 'Practice' | 'Performance' | 'Personal';
    }>;
  };
}

export class DeepSeekAnalyzer {
  private apiKey: string;
  private baseUrl: string;
  private model: string;
  private requestDelay: number;
  private cache: Map<string, any>;

  constructor() {
    this.apiKey = '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';
    this.baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
    this.model = 'deepseek/deepseek-r1-0528:free';
    this.requestDelay = 1000;
    this.cache = new Map();
  }

  private async makeDeepSeekRequest(prompt: string): Promise<any> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getCacheKey(content: string, playerName: string): string {
    return `${playerName}-${content.substring(0, 50)}`;
  }

  private detectSport(content: string, subreddit: string): 'NBA' | 'NFL' | 'NHL' | 'MLB' | 'unknown' {
    const text = content.toLowerCase();
    const sub = subreddit.toLowerCase();
    
    // Subreddit-based detection
    if (sub.includes('nba') || sub.includes('basketball')) return 'NBA';
    if (sub.includes('nfl') || sub.includes('football')) return 'NFL';
    if (sub.includes('nhl') || sub.includes('hockey')) return 'NHL';
    if (sub.includes('mlb') || sub.includes('baseball')) return 'MLB';
    
    // Content-based detection
    if (text.includes('basketball') || text.includes('nba') || text.includes('dunk') || text.includes('three-pointer')) return 'NBA';
    if (text.includes('football') || text.includes('nfl') || text.includes('touchdown') || text.includes('quarterback')) return 'NFL';
    if (text.includes('hockey') || text.includes('nhl') || text.includes('goal') || text.includes('puck')) return 'NHL';
    if (text.includes('baseball') || text.includes('mlb') || text.includes('home run') || text.includes('pitcher')) return 'MLB';
    
    return 'unknown';
  }

  async analyzePost(title: string, content: string, playerName: string, subreddit: string = ''): Promise<DeepSeekPostAnalysis> {
    const cacheKey = this.getCacheKey(title + content, playerName);
    
    if (this.cache.has(cacheKey)) {
      console.log('Using cached analysis for post');
      return this.cache.get(cacheKey);
    }

    const sport = this.detectSport(title + ' ' + content, subreddit);
    const sportContext = this.getSportContext(sport);

    const prompt = `Analyze this Reddit post about ${playerName} for sports intelligence and performance analysis.

Post Title: "${title}"
Post Content: "${content}"
Subreddit: r/${subreddit}
Sport Context: ${sportContext}

Provide a JSON response with the following structure:
{
  "performanceScore": (number from -10 to +10, where -10=major decline, +10=major improvement),
  "confidence": (number 0-100 representing analysis confidence),
  "category": (one of: "injury", "performance", "trade", "team_chemistry", "personal", "fantasy", "general"),
  "riskLevel": (one of: "low", "medium", "high"),
  "keyInsights": (array of 2-3 specific findings from this post),
  "recency": (one of: "breaking", "recent", "old"),
  "reliability": (one of: "confirmed", "rumor", "speculation"),
  "sentiment": (one of: "positive", "negative", "neutral"),
  "sentimentConfidence": (number 0-100 representing sentiment confidence),
  "sport": "${sport}"
}

Return only valid JSON, no additional text.`;

    try {
      const response = await this.makeDeepSeekRequest(prompt);
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : response;
      
      const analysis = JSON.parse(jsonStr);
      
      const result = {
        performanceScore: Math.max(-10, Math.min(10, analysis.performanceScore || 0)),
        confidence: Math.max(0, Math.min(100, analysis.confidence || 50)),
        category: analysis.category || 'general',
        riskLevel: analysis.riskLevel || 'medium',
        keyInsights: Array.isArray(analysis.keyInsights) ? analysis.keyInsights : [],
        recency: analysis.recency || 'recent',
        reliability: analysis.reliability || 'speculation',
        sentiment: analysis.sentiment || 'neutral',
        sentimentConfidence: Math.max(0, Math.min(100, analysis.sentimentConfidence || 50)),
        sport: sport
      };

      this.cache.set(cacheKey, result);
      await this.delay(this.requestDelay);
      
      return result;
    } catch (error) {
      console.error('Error analyzing post with DeepSeek:', error);
      return {
        performanceScore: 0,
        confidence: 30,
        category: 'general',
        riskLevel: 'medium',
        keyInsights: ['Analysis processing - check back soon'],
        recency: 'recent',
        reliability: 'speculation',
        sentiment: 'neutral',
        sentimentConfidence: 30,
        sport: sport
      };
    }
  }

  async summarizePosts(posts: Array<{title: string, content: string, subreddit?: string}>, playerName: string): Promise<DeepSeekSummaryAnalysis> {
    if (posts.length === 0) {
      return {
        playerSummary: 'No recent discussions found for analysis',
        performanceTrajectory: 'Sleeper Pick',
        keyTrends: ['No trending topics detected'],
        riskFactors: ['Limited data available for analysis'],
        opportunities: ['Monitor for emerging discussions'],
        fantasyImpact: 'Insufficient data for fantasy assessment',
        recommendation: 'Monitor - Need more discussion data for analysis',
        performanceScore: 0,
        trajectoryConfidence: 0,
        sentiment: 'neutral',
        sentimentConfidence: 0,
        sport: 'unknown',
        subredditsAnalyzed: [],
        recentPerformance: {
          lastThreeGames: 'No recent performance data available',
          injuryStatus: 'Healthy',
          injuryDescription: 'No injury concerns identified',
          matchupDifficulty: 'Moderate',
          matchupReasoning: 'Standard matchup difficulty expected'
        },
        fantasyInsights: {
          startSitRecommendation: 'Flex',
          startSitConfidence: 50,
          tradeValueTrend: 'Stable',
          tradeValueExplanation: 'Limited data for trade value assessment',
          restOfSeasonOutlook: 'Monitor for more discussion data',
          pprRelevance: 'Standard PPR value expected',
          dynastyRelevance: 'Hold and monitor development'
        },
        breakingNews: {
          hasRecentNews: false,
          newsItems: []
        }
      };
    }

    const cacheKey = this.getCacheKey(posts.map(p => p.title).join(''), playerName);
    
    if (this.cache.has(cacheKey)) {
      console.log('Using cached summary analysis');
      return this.cache.get(cacheKey);
    }

    const batchedPosts = posts.slice(0, 12);
    const subreddits = [...new Set(batchedPosts.map(p => p.subreddit).filter(Boolean))];
    const primarySport = this.detectSport(batchedPosts.map(p => p.title + ' ' + p.content).join(' '), subreddits.join(' '));
    const sportContext = this.getSportContext(primarySport);

    const allPosts = batchedPosts.map((post, index) => 
      `Post ${index + 1} (r/${post.subreddit}): "${post.title}" - "${post.content.substring(0, 200)}..."`
    ).join('\n\n');

    const prompt = `Analyze these ${batchedPosts.length} Reddit posts about ${playerName} and provide comprehensive sports intelligence analysis with enhanced fantasy and performance insights:

Sport: ${primarySport}
Sport Context: ${sportContext}
Subreddits: ${subreddits.join(', ')}

${allPosts}

Provide comprehensive analysis as JSON:
{
  "playerSummary": (2-3 sentence overview of player's current situation),
  "performanceTrajectory": (one of: "Rising Star", "Proven Performer", "Declining", "Sleeper Pick", "Avoid"),
  "keyTrends": (array of 3-5 key patterns or trends),
  "riskFactors": (array of specific concerns or red flags),
  "opportunities": (array of positive indicators),
  "fantasyImpact": (fantasy sports relevance assessment),
  "recommendation": (clear guidance with reasoning),
  "performanceScore": (number from -10 to +10),
  "trajectoryConfidence": (number 0-100),
  "sentiment": (one of: "positive", "negative", "neutral"),
  "sentimentConfidence": (number 0-100),
  "sport": "${primarySport}",
  "subredditsAnalyzed": ${JSON.stringify(subreddits)},
  "recentPerformance": {
    "lastThreeGames": (summary of recent game performance vs averages mentioned in discussions),
    "injuryStatus": (one of: "Healthy", "Questionable", "Doubtful", "Out"),
    "injuryDescription": (brief injury status or "No injury concerns identified"),
    "matchupDifficulty": (one of: "Easy", "Moderate", "Tough"),
    "matchupReasoning": (brief explanation of upcoming matchup difficulty)
  },
  "fantasyInsights": {
    "startSitRecommendation": (one of: "Must Start", "Start", "Flex", "Sit", "Avoid"),
    "startSitConfidence": (number 0-100),
    "tradeValueTrend": (one of: "Rising", "Stable", "Falling"),
    "tradeValueExplanation": (brief explanation of trade value trend),
    "restOfSeasonOutlook": (1-2 sentences on expected performance),
    "pprRelevance": (PPR format specific advice),
    "dynastyRelevance": (dynasty league specific outlook)
  },
  "breakingNews": {
    "hasRecentNews": (boolean if any news in last 24-48 hours),
    "newsItems": (array of recent news items from discussions, max 3)
  }
}

Return only valid JSON, no additional text.`;

    try {
      const response = await this.makeDeepSeekRequest(prompt);
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : response;
      
      const analysis = JSON.parse(jsonStr);
      
      const result = {
        playerSummary: analysis.playerSummary || 'AI analysis in progress for this player',
        performanceTrajectory: analysis.performanceTrajectory || 'Sleeper Pick',
        keyTrends: Array.isArray(analysis.keyTrends) ? analysis.keyTrends : ['Trend analysis in progress'],
        riskFactors: Array.isArray(analysis.riskFactors) ? analysis.riskFactors : ['Risk assessment ongoing'],
        opportunities: Array.isArray(analysis.opportunities) ? analysis.opportunities : ['Monitoring for opportunities'],
        fantasyImpact: analysis.fantasyImpact || 'Fantasy impact being evaluated',
        recommendation: analysis.recommendation || 'Monitor - Analysis in progress',
        performanceScore: Math.max(-10, Math.min(10, analysis.performanceScore || 0)),
        trajectoryConfidence: Math.max(0, Math.min(100, analysis.trajectoryConfidence || 50)),
        sentiment: analysis.sentiment || 'neutral',
        sentimentConfidence: Math.max(0, Math.min(100, analysis.sentimentConfidence || 50)),
        sport: primarySport,
        subredditsAnalyzed: subreddits,
        recentPerformance: {
          lastThreeGames: analysis.recentPerformance?.lastThreeGames || 'Recent performance data being analyzed',
          injuryStatus: analysis.recentPerformance?.injuryStatus || 'Healthy',
          injuryDescription: analysis.recentPerformance?.injuryDescription || 'No injury concerns identified',
          matchupDifficulty: analysis.recentPerformance?.matchupDifficulty || 'Moderate',
          matchupReasoning: analysis.recentPerformance?.matchupReasoning || 'Standard matchup difficulty expected'
        },
        fantasyInsights: {
          startSitRecommendation: analysis.fantasyInsights?.startSitRecommendation || 'Flex',
          startSitConfidence: Math.max(0, Math.min(100, analysis.fantasyInsights?.startSitConfidence || 60)),
          tradeValueTrend: analysis.fantasyInsights?.tradeValueTrend || 'Stable',
          tradeValueExplanation: analysis.fantasyInsights?.tradeValueExplanation || 'Trade value assessment in progress',
          restOfSeasonOutlook: analysis.fantasyInsights?.restOfSeasonOutlook || 'Season outlook being evaluated',
          pprRelevance: analysis.fantasyInsights?.pprRelevance || 'PPR impact being analyzed',
          dynastyRelevance: analysis.fantasyInsights?.dynastyRelevance || 'Dynasty value being assessed'
        },
        breakingNews: {
          hasRecentNews: analysis.breakingNews?.hasRecentNews || false,
          newsItems: Array.isArray(analysis.breakingNews?.newsItems) ? analysis.breakingNews.newsItems.slice(0, 3) : []
        }
      };

      this.cache.set(cacheKey, result);
      await this.delay(this.requestDelay);
      
      return result;
    } catch (error) {
      console.error('Error summarizing posts with DeepSeek:', error);
      return {
        playerSummary: 'AI processing comprehensive analysis across multiple discussions',
        performanceTrajectory: 'Sleeper Pick',
        keyTrends: ['Cross-subreddit analysis in progress', 'Discussion patterns being evaluated'],
        riskFactors: ['Monitoring for breaking developments', 'Assessing community sentiment reliability'],
        opportunities: ['Analyzing positive trajectory indicators'],
        fantasyImpact: 'Fantasy relevance assessment in progress',
        recommendation: 'Monitor - Completing multi-source analysis',
        performanceScore: 0,
        trajectoryConfidence: 40,
        sentiment: 'neutral',
        sentimentConfidence: 40,
        sport: primarySport,
        subredditsAnalyzed: subreddits,
        recentPerformance: {
          lastThreeGames: 'Performance tracking in progress',
          injuryStatus: 'Healthy',
          injuryDescription: 'Monitoring for injury updates',
          matchupDifficulty: 'Moderate',
          matchupReasoning: 'Matchup analysis pending'
        },
        fantasyInsights: {
          startSitRecommendation: 'Flex',
          startSitConfidence: 50,
          tradeValueTrend: 'Stable',
          tradeValueExplanation: 'Analyzing trade discussions',
          restOfSeasonOutlook: 'Evaluating long-term potential',
          pprRelevance: 'PPR analysis in progress',
          dynastyRelevance: 'Dynasty evaluation ongoing'
        },
        breakingNews: {
          hasRecentNews: false,
          newsItems: []
        }
      };
    }
  }

  private getSportContext(sport: string): string {
    const contexts = {
      'NBA': 'Basketball stats: points, rebounds, assists, shooting %, usage rate, trade rumors, injury reports',
      'NFL': 'Football stats: yards, touchdowns, snap counts, target share, injury reports, depth charts',
      'NHL': 'Hockey stats: goals, assists, ice time, power play, save %, trade rumors, injury reports',
      'MLB': 'Baseball stats: batting average, home runs, RBI, ERA, WHIP, playing time, injury reports',
      'unknown': 'General sports performance, injury status, team dynamics, and player development'
    };
    return contexts[sport] || contexts['unknown'];
  }
}

export const deepseekAnalyzer = new DeepSeekAnalyzer();
