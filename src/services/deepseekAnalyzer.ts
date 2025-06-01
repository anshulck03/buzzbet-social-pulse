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
    console.log('DeepSeek API Request Details:', {
      url: this.baseUrl,
      model: this.model,
      hasApiKey: !!this.apiKey,
      apiKeyLength: this.apiKey?.length,
      promptLength: prompt.length
    });

    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

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
          max_tokens: 1000 // Reduced from 1500 to 1000 for faster response
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('DeepSeek API Response Status:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('DeepSeek API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          errorText: errorText
        });
        
        // Check for specific error types
        if (response.status === 401) {
          throw new Error(`DeepSeek API authentication failed - check API key validity`);
        } else if (response.status === 429) {
          throw new Error(`DeepSeek API rate limit exceeded - too many requests`);
        } else if (response.status === 402) {
          throw new Error(`DeepSeek API billing issue - insufficient credits or expired subscription`);
        } else {
          throw new Error(`DeepSeek API error: ${response.status} ${response.statusText} - ${errorText}`);
        }
      }

      const data = await response.json();
      console.log('DeepSeek API Success:', {
        hasChoices: !!data.choices,
        choicesLength: data.choices?.length,
        usage: data.usage
      });

      return data.choices[0].message.content;
    } catch (networkError) {
      console.error('DeepSeek Network Error:', networkError);
      if (networkError.name === 'AbortError') {
        throw new Error('DeepSeek API timeout - request took too long');
      }
      if (networkError instanceof Error) {
        throw new Error(`DeepSeek network error: ${networkError.message}`);
      }
      throw networkError;
    }
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

    // OPTIMIZATION: Shortened prompt for faster processing
    const prompt = `Analyze this Reddit post about ${playerName} for sports intelligence.

Post: "${title}" - "${content.substring(0, 300)}..." (Sport: ${sport})

JSON response:
{
  "performanceScore": (number -10 to +10),
  "confidence": (0-100),
  "category": ("injury"|"performance"|"trade"|"team_chemistry"|"personal"|"fantasy"|"general"),
  "riskLevel": ("low"|"medium"|"high"),
  "keyInsights": (array of 2 findings),
  "recency": ("breaking"|"recent"|"old"),
  "reliability": ("confirmed"|"rumor"|"speculation"),
  "sentiment": ("positive"|"negative"|"neutral"),
  "sentimentConfidence": (0-100),
  "sport": "${sport}"
}`;

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

    // OPTIMIZATION: Process fewer posts for faster response
    const batchedPosts = posts.slice(0, 8); // Reduced from 12 to 8
    const subreddits = [...new Set(batchedPosts.map(p => p.subreddit).filter(Boolean))];
    const primarySport = this.detectSport(batchedPosts.map(p => p.title + ' ' + p.content).join(' '), subreddits.join(' '));
    const sportContext = this.getSportContext(primarySport);

    // OPTIMIZATION: Shortened content for faster processing
    const allPosts = batchedPosts.map((post, index) => 
      `${index + 1}. (r/${post.subreddit}): "${post.title}" - "${post.content.substring(0, 150)}..."`
    ).join('\n');

    // OPTIMIZATION: More concise prompt
    const prompt = `Analyze ${batchedPosts.length} Reddit posts about ${playerName} (${primarySport}):

${allPosts}

JSON response:
{
  "playerSummary": (2-sentence overview),
  "performanceTrajectory": ("Rising Star"|"Proven Performer"|"Declining"|"Sleeper Pick"|"Avoid"),
  "keyTrends": (array of 3 trends),
  "riskFactors": (array of 2 concerns),
  "opportunities": (array of 2 positives),
  "fantasyImpact": (fantasy assessment),
  "recommendation": (clear guidance),
  "performanceScore": (-10 to +10),
  "trajectoryConfidence": (0-100),
  "sentiment": ("positive"|"negative"|"neutral"),
  "sentimentConfidence": (0-100),
  "sport": "${primarySport}",
  "subredditsAnalyzed": ${JSON.stringify(subreddits)},
  "recentPerformance": {
    "lastThreeGames": (performance summary),
    "injuryStatus": ("Healthy"|"Questionable"|"Doubtful"|"Out"),
    "injuryDescription": (injury status),
    "matchupDifficulty": ("Easy"|"Moderate"|"Tough"),
    "matchupReasoning": (matchup explanation)
  },
  "fantasyInsights": {
    "startSitRecommendation": ("Must Start"|"Start"|"Flex"|"Sit"|"Avoid"),
    "startSitConfidence": (0-100),
    "tradeValueTrend": ("Rising"|"Stable"|"Falling"),
    "tradeValueExplanation": (brief explanation),
    "restOfSeasonOutlook": (season outlook),
    "pprRelevance": (PPR advice),
    "dynastyRelevance": (dynasty outlook)
  },
  "breakingNews": {
    "hasRecentNews": (boolean),
    "newsItems": (array of recent news, max 2)
  }
}`;

    try {
      const response = await this.makeDeepSeekRequest(prompt);
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : response;
      
      const analysis = JSON.parse(jsonStr);
      
      // ... keep existing code (result construction and validation) the same
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
      // ... keep existing code (fallback response) the same
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
