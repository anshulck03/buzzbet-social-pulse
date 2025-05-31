
interface GeminiPostAnalysis {
  bettingScore: number;
  confidence: number;
  category: 'injury' | 'performance' | 'legal' | 'team_chemistry' | 'personal' | 'general';
  riskLevel: 'low' | 'medium' | 'high';
  keyInsights: string[];
  recency: 'breaking' | 'recent' | 'old';
  reliability: 'confirmed' | 'rumor' | 'speculation';
}

interface GeminiSummaryAnalysis {
  overallSentiment: string;
  keyTrends: string[];
  riskFactors: string[];
  opportunities: string[];
  timeline: string;
  recommendation: string;
  aggregatedScore: number;
  confidenceLevel: number;
}

export class GeminiAnalyzer {
  private apiKey: string;
  private baseUrl: string;
  private requestDelay: number;

  constructor() {
    this.apiKey = 'AIzaSyBwOpQX1WH5c_aJWtfYZZIU5Bq3WADT5jo';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    this.requestDelay = 1000; // 1 second between requests for rate limiting
  }

  private async makeGeminiRequest(prompt: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async analyzePost(title: string, content: string, playerName: string): Promise<GeminiPostAnalysis> {
    const prompt = `Analyze this Reddit post about ${playerName} for sports betting intelligence. Post: '${title}' - '${content}'. 

Provide JSON response with:
- bettingScore: -10 to +10 (-10=bet against, +10=bet on player)
- confidence: 0-100 confidence in this information
- category: 'injury', 'performance', 'legal', 'team_chemistry', 'personal', 'general'
- riskLevel: 'low', 'medium', 'high'
- keyInsights: array of specific findings
- recency: 'breaking', 'recent', 'old'
- reliability: 'confirmed', 'rumor', 'speculation'

Return only valid JSON, no additional text.`;

    try {
      const response = await this.makeGeminiRequest(prompt);
      
      // Extract JSON from response if it's wrapped in text
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : response;
      
      const analysis = JSON.parse(jsonStr);
      
      // Add delay to respect rate limits
      await this.delay(this.requestDelay);
      
      return {
        bettingScore: Math.max(-10, Math.min(10, analysis.bettingScore || 0)),
        confidence: Math.max(0, Math.min(100, analysis.confidence || 50)),
        category: analysis.category || 'general',
        riskLevel: analysis.riskLevel || 'medium',
        keyInsights: Array.isArray(analysis.keyInsights) ? analysis.keyInsights : [],
        recency: analysis.recency || 'recent',
        reliability: analysis.reliability || 'speculation'
      };
    } catch (error) {
      console.error('Error analyzing post with Gemini:', error);
      // Return default analysis if AI fails
      return {
        bettingScore: 0,
        confidence: 30,
        category: 'general',
        riskLevel: 'medium',
        keyInsights: ['Analysis unavailable - using fallback'],
        recency: 'recent',
        reliability: 'speculation'
      };
    }
  }

  async summarizePosts(posts: Array<{title: string, content: string}>, playerName: string): Promise<GeminiSummaryAnalysis> {
    if (posts.length === 0) {
      return {
        overallSentiment: 'Neutral - No data available',
        keyTrends: [],
        riskFactors: ['No recent discussions found'],
        opportunities: [],
        timeline: 'No recent activity',
        recommendation: 'Insufficient data for betting recommendation',
        aggregatedScore: 0,
        confidenceLevel: 0
      };
    }

    const allPosts = posts.map((post, index) => 
      `Post ${index + 1}: "${post.title}" - "${post.content}"`
    ).join('\n\n');

    const prompt = `Analyze these ${posts.length} Reddit posts about ${playerName} and provide betting intelligence summary:
${allPosts}

Provide comprehensive analysis as JSON:
- overallSentiment: Current betting outlook
- keyTrends: Array of patterns that emerge across posts
- riskFactors: Array of specific concerns for betting
- opportunities: Array of positive indicators
- timeline: How sentiment has changed recently
- recommendation: Clear betting guidance
- aggregatedScore: Overall score from -10 to +10
- confidenceLevel: Confidence 0-100 in this analysis

Return only valid JSON, no additional text.`;

    try {
      const response = await this.makeGeminiRequest(prompt);
      
      // Extract JSON from response if it's wrapped in text
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : response;
      
      const analysis = JSON.parse(jsonStr);
      
      // Add delay to respect rate limits
      await this.delay(this.requestDelay);
      
      return {
        overallSentiment: analysis.overallSentiment || 'Neutral outlook',
        keyTrends: Array.isArray(analysis.keyTrends) ? analysis.keyTrends : [],
        riskFactors: Array.isArray(analysis.riskFactors) ? analysis.riskFactors : [],
        opportunities: Array.isArray(analysis.opportunities) ? analysis.opportunities : [],
        timeline: analysis.timeline || 'No clear timeline trend',
        recommendation: analysis.recommendation || 'Monitor for more data',
        aggregatedScore: Math.max(-10, Math.min(10, analysis.aggregatedScore || 0)),
        confidenceLevel: Math.max(0, Math.min(100, analysis.confidenceLevel || 50))
      };
    } catch (error) {
      console.error('Error summarizing posts with Gemini:', error);
      // Return default summary if AI fails
      return {
        overallSentiment: 'Analysis unavailable - using basic sentiment',
        keyTrends: ['Unable to analyze trends'],
        riskFactors: ['AI analysis failed - use caution'],
        opportunities: [],
        timeline: 'Analysis unavailable',
        recommendation: 'Manual analysis recommended',
        aggregatedScore: 0,
        confidenceLevel: 20
      };
    }
  }
}

export const geminiAnalyzer = new GeminiAnalyzer();
