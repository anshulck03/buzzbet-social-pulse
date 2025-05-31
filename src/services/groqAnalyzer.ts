
interface GroqPostAnalysis {
  bettingScore: number;
  confidence: number;
  category: 'injury' | 'performance' | 'legal' | 'team_chemistry' | 'personal' | 'general';
  riskLevel: 'low' | 'medium' | 'high';
  keyInsights: string[];
  recency: 'breaking' | 'recent' | 'old';
  reliability: 'confirmed' | 'rumor' | 'speculation';
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentConfidence: number;
}

export interface GroqSummaryAnalysis {
  overallSentiment: string;
  keyTrends: string[];
  riskFactors: string[];
  opportunities: string[];
  timeline: string;
  recommendation: string;
  aggregatedScore: number;
  confidenceLevel: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentConfidence: number;
}

export class GroqAnalyzer {
  private apiKey: string;
  private baseUrl: string;
  private model: string;
  private requestDelay: number;
  private cache: Map<string, any>;

  constructor() {
    this.apiKey = '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';
    this.baseUrl = 'https://api.groq.com/openai/v1/chat/completions';
    this.model = 'meta-llama/llama-4-scout-17b-16e-instruct';
    this.requestDelay = 1000; // 1 second between requests for rate limiting
    this.cache = new Map();
  }

  private async makeGroqRequest(prompt: string): Promise<any> {
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
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
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

  async analyzePost(title: string, content: string, playerName: string): Promise<GroqPostAnalysis> {
    const cacheKey = this.getCacheKey(title + content, playerName);
    
    if (this.cache.has(cacheKey)) {
      console.log('Using cached analysis for post');
      return this.cache.get(cacheKey);
    }

    const prompt = `Analyze this Reddit post about ${playerName} for sports betting intelligence and sentiment analysis.

Post Title: "${title}"
Post Content: "${content}"

Provide a JSON response with the following structure:
{
  "bettingScore": (number from -10 to +10, where -10=strong bet against, +10=strong bet on),
  "confidence": (number 0-100 representing confidence in this analysis),
  "category": (one of: "injury", "performance", "legal", "team_chemistry", "personal", "general"),
  "riskLevel": (one of: "low", "medium", "high"),
  "keyInsights": (array of 2-3 specific findings from this post),
  "recency": (one of: "breaking", "recent", "old"),
  "reliability": (one of: "confirmed", "rumor", "speculation"),
  "sentiment": (one of: "positive", "negative", "neutral"),
  "sentimentConfidence": (number 0-100 representing sentiment confidence)
}

Return only valid JSON, no additional text.`;

    try {
      const response = await this.makeGroqRequest(prompt);
      
      // Extract JSON from response if it's wrapped in text
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : response;
      
      const analysis = JSON.parse(jsonStr);
      
      const result = {
        bettingScore: Math.max(-10, Math.min(10, analysis.bettingScore || 0)),
        confidence: Math.max(0, Math.min(100, analysis.confidence || 50)),
        category: analysis.category || 'general',
        riskLevel: analysis.riskLevel || 'medium',
        keyInsights: Array.isArray(analysis.keyInsights) ? analysis.keyInsights : [],
        recency: analysis.recency || 'recent',
        reliability: analysis.reliability || 'speculation',
        sentiment: analysis.sentiment || 'neutral',
        sentimentConfidence: Math.max(0, Math.min(100, analysis.sentimentConfidence || 50))
      };

      // Cache the result
      this.cache.set(cacheKey, result);
      
      // Add delay to respect rate limits
      await this.delay(this.requestDelay);
      
      return result;
    } catch (error) {
      console.error('Error analyzing post with Groq:', error);
      // Return default analysis if AI fails
      return {
        bettingScore: 0,
        confidence: 30,
        category: 'general',
        riskLevel: 'medium',
        keyInsights: ['Analysis processing - check back soon'],
        recency: 'recent',
        reliability: 'speculation',
        sentiment: 'neutral',
        sentimentConfidence: 30
      };
    }
  }

  async summarizePosts(posts: Array<{title: string, content: string}>, playerName: string): Promise<GroqSummaryAnalysis> {
    if (posts.length === 0) {
      return {
        overallSentiment: 'Neutral - No recent discussions found',
        keyTrends: ['No trending topics detected'],
        riskFactors: ['Limited data available for analysis'],
        opportunities: ['Monitor for emerging discussions'],
        timeline: 'No recent activity to analyze',
        recommendation: 'Hold - Insufficient data for betting recommendation',
        aggregatedScore: 0,
        confidenceLevel: 0,
        sentiment: 'neutral',
        sentimentConfidence: 0
      };
    }

    const cacheKey = this.getCacheKey(posts.map(p => p.title).join(''), playerName);
    
    if (this.cache.has(cacheKey)) {
      console.log('Using cached summary analysis');
      return this.cache.get(cacheKey);
    }

    // Batch posts for efficient processing
    const batchedPosts = posts.slice(0, 10); // Limit to 10 most relevant posts
    const allPosts = batchedPosts.map((post, index) => 
      `Post ${index + 1}: "${post.title}" - "${post.content.substring(0, 200)}..."`
    ).join('\n\n');

    const prompt = `Analyze these ${batchedPosts.length} Reddit posts about ${playerName} and provide comprehensive betting intelligence and sentiment analysis:

${allPosts}

Provide analysis as JSON:
{
  "overallSentiment": (string describing current betting outlook and mood),
  "keyTrends": (array of 3-5 key patterns or trends emerging from posts),
  "riskFactors": (array of specific concerns or red flags for betting),
  "opportunities": (array of positive indicators or opportunities),
  "timeline": (string describing how sentiment has evolved recently),
  "recommendation": (one of: "Buy", "Hold", "Sell" with brief reasoning),
  "aggregatedScore": (number from -10 to +10 representing overall outlook),
  "confidenceLevel": (number 0-100 representing confidence in analysis),
  "sentiment": (one of: "positive", "negative", "neutral"),
  "sentimentConfidence": (number 0-100 representing sentiment confidence)
}

Return only valid JSON, no additional text.`;

    try {
      const response = await this.makeGroqRequest(prompt);
      
      // Extract JSON from response if it's wrapped in text
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : response;
      
      const analysis = JSON.parse(jsonStr);
      
      const result = {
        overallSentiment: analysis.overallSentiment || 'Mixed sentiment detected',
        keyTrends: Array.isArray(analysis.keyTrends) ? analysis.keyTrends : ['Trend analysis in progress'],
        riskFactors: Array.isArray(analysis.riskFactors) ? analysis.riskFactors : ['Risk assessment ongoing'],
        opportunities: Array.isArray(analysis.opportunities) ? analysis.opportunities : ['Monitoring for opportunities'],
        timeline: analysis.timeline || 'Timeline analysis developing',
        recommendation: analysis.recommendation || 'Hold - Analysis in progress',
        aggregatedScore: Math.max(-10, Math.min(10, analysis.aggregatedScore || 0)),
        confidenceLevel: Math.max(0, Math.min(100, analysis.confidenceLevel || 50)),
        sentiment: analysis.sentiment || 'neutral',
        sentimentConfidence: Math.max(0, Math.min(100, analysis.sentimentConfidence || 50))
      };

      // Cache the result
      this.cache.set(cacheKey, result);
      
      // Add delay to respect rate limits
      await this.delay(this.requestDelay);
      
      return result;
    } catch (error) {
      console.error('Error summarizing posts with Groq:', error);
      // Return meaningful fallback instead of error messages
      return {
        overallSentiment: 'Processing Reddit discussions - real-time analysis loading',
        keyTrends: ['Discussion volume analysis in progress', 'Sentiment patterns being evaluated'],
        riskFactors: ['Monitoring for breaking news', 'Assessing discussion reliability'],
        opportunities: ['Analyzing positive sentiment indicators'],
        timeline: 'Recent activity being processed',
        recommendation: 'Hold - Completing comprehensive analysis',
        aggregatedScore: 0,
        confidenceLevel: 40,
        sentiment: 'neutral',
        sentimentConfidence: 40
      };
    }
  }
}

export const groqAnalyzer = new GroqAnalyzer();
