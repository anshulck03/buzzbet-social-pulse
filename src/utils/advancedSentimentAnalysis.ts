
export interface SentimentSignal {
  keyword: string;
  category: string;
  matches: number;
  weight: number;
  impact: 'high' | 'medium' | 'low';
}

export interface SentimentContext {
  hasInjuryMention: boolean;
  hasPerformanceMention: boolean;
  isRecent: boolean;
  confidenceFactors: string[];
}

export interface SentimentResult {
  score: number;
  confidence: number;
  category: 'very_positive' | 'positive' | 'neutral' | 'negative' | 'very_negative';
  signals: SentimentSignal[];
  context: SentimentContext;
  rawScore?: number;
  totalWeight?: number;
  engagementBoost?: number;
}

export interface AggregateSentimentResult {
  overallScore: number;
  confidence: number;
  category: 'very_positive' | 'positive' | 'neutral' | 'negative' | 'very_negative';
  breakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
  topSignals: SentimentSignal[];
  sampleSize: number;
}

export class SentimentAnalyzer {
  private sentimentKeywords: Record<string, string[]>;
  private contextMultipliers: Record<string, number>;

  constructor() {
    this.sentimentKeywords = {
      strongPositive: [
        'beast', 'goat', 'elite', 'clutch', 'amazing', 'incredible', 'dominant', 
        'unstoppable', 'legendary', 'phenomenal', 'superstar', 'mvp', 'hall of fame',
        'explosive', 'game-changer', 'world-class', 'spectacular', 'outstanding'
      ],
      
      positive: [
        'good', 'great', 'solid', 'nice', 'impressive', 'strong', 'consistent',
        'reliable', 'skilled', 'talented', 'productive', 'effective', 'valuable',
        'improving', 'promising', 'confident', 'focused', 'determined'
      ],
      
      strongNegative: [
        'trash', 'terrible', 'awful', 'horrible', 'pathetic', 'useless', 'washed',
        'overrated', 'bust', 'disaster', 'embarrassing', 'disgraceful', 'choker',
        'liability', 'toxic', 'nightmare', 'catastrophic', 'humiliating'
      ],
      
      negative: [
        'bad', 'poor', 'weak', 'disappointing', 'concerning', 'struggling',
        'inconsistent', 'unreliable', 'limited', 'declining', 'questionable',
        'risky', 'problematic', 'mediocre', 'average', 'ordinary'
      ],
      
      injury: [
        'injured', 'hurt', 'pain', 'surgery', 'out', 'sidelined', 'questionable',
        'doubtful', 'dnp', 'rest', 'load management', 'precaution', 'setback',
        'recovery', 'rehab', 'limping', 'grimacing', 'tender', 'sore'
      ],
      
      performance: [
        'points', 'yards', 'goals', 'assists', 'rebounds', 'tackles', 'saves',
        'home runs', 'strikeouts', 'rushing', 'passing', 'shooting', 'defense'
      ]
    };
    
    this.contextMultipliers = {
      recent: 1.5,
      playoffs: 1.3,
      injury: 0.7,
      rumor: 0.8
    };
  }

  analyzeSentiment(text: string, title: string = '', score: number = 0, commentCount: number = 0): SentimentResult {
    if (!text || text.length < 3) {
      return {
        score: 0,
        confidence: 0,
        category: 'neutral',
        signals: [],
        context: {
          hasInjuryMention: false,
          hasPerformanceMention: false,
          isRecent: false,
          confidenceFactors: []
        }
      };
    }

    const cleanText = text.toLowerCase().replace(/[^\w\s]/g, ' ');
    
    let sentimentScore = 0;
    let totalWeight = 0;
    let signals: SentimentSignal[] = [];
    let context: SentimentContext = {
      hasInjuryMention: false,
      hasPerformanceMention: false,
      isRecent: false,
      confidenceFactors: []
    };

    Object.entries(this.sentimentKeywords).forEach(([category, keywords]) => {
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = (cleanText.match(regex) || []).length;
        
        if (matches > 0) {
          let weight = this.getCategoryWeight(category);
          let adjustedWeight = weight * matches;
          
          sentimentScore += adjustedWeight;
          totalWeight += Math.abs(adjustedWeight);
          
          signals.push({
            keyword,
            category,
            matches,
            weight: adjustedWeight,
            impact: this.getImpactLevel(Math.abs(adjustedWeight))
          });
          
          if (category === 'injury') {
            context.hasInjuryMention = true;
            context.confidenceFactors.push('injury_mentioned');
          }
          if (category === 'performance') {
            context.hasPerformanceMention = true;
            context.confidenceFactors.push('performance_data');
          }
        }
      });
    });

    const engagementBoost = this.calculateEngagementBoost(score, commentCount);
    sentimentScore *= engagementBoost;

    if (this.hasRecentContext(title, text)) {
      context.isRecent = true;
      sentimentScore *= this.contextMultipliers.recent;
      context.confidenceFactors.push('recent_context');
    }

    const normalizedScore = totalWeight > 0 ? 
      Math.max(-10, Math.min(10, (sentimentScore / totalWeight) * 10)) : 0;

    const confidence = this.calculateConfidence(signals, context, text.length);

    return {
      score: Math.round(normalizedScore * 10) / 10,
      confidence: Math.round(confidence),
      category: this.categorizeScore(normalizedScore),
      signals: signals.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight)),
      context,
      rawScore: sentimentScore,
      totalWeight,
      engagementBoost
    };
  }

  private getCategoryWeight(category: string): number {
    const weights: Record<string, number> = {
      strongPositive: 2.0,
      positive: 1.0,
      strongNegative: -2.0,
      negative: -1.0,
      injury: -1.5,
      performance: 0.5
    };
    return weights[category] || 0;
  }

  private calculateEngagementBoost(score: number, commentCount: number): number {
    const upvoteBoost = Math.min(1.5, 1 + (score / 100));
    const commentBoost = Math.min(1.3, 1 + (commentCount / 50));
    return (upvoteBoost + commentBoost) / 2;
  }

  private hasRecentContext(title: string, text: string): boolean {
    const recentKeywords = [
      'today', 'yesterday', 'tonight', 'this week', 'last night',
      'game', 'match', 'performance', 'just', 'now', 'currently'
    ];
    
    const combined = `${title} ${text}`.toLowerCase();
    return recentKeywords.some(keyword => combined.includes(keyword));
  }

  private calculateConfidence(signals: SentimentSignal[], context: SentimentContext, textLength: number): number {
    let confidence = 30;
    
    const strongSignals = signals.filter(s => Math.abs(s.weight) >= 1.5).length;
    const totalSignals = signals.length;
    confidence += Math.min(40, (strongSignals * 10) + (totalSignals * 2));
    
    confidence += Math.min(15, textLength / 10);
    
    if (context.hasPerformanceMention) confidence += 5;
    if (context.isRecent) confidence += 10;
    if (context.hasInjuryMention) confidence -= 5;
    
    return Math.max(0, Math.min(100, confidence));
  }

  private categorizeScore(score: number): 'very_positive' | 'positive' | 'neutral' | 'negative' | 'very_negative' {
    if (score >= 6) return 'very_positive';
    if (score >= 2) return 'positive';
    if (score >= -2) return 'neutral';
    if (score >= -6) return 'negative';
    return 'very_negative';
  }

  private getImpactLevel(weight: number): 'high' | 'medium' | 'low' {
    if (weight >= 2) return 'high';
    if (weight >= 1) return 'medium';
    return 'low';
  }

  aggregateSentiment(analyses: SentimentResult[]): AggregateSentimentResult {
    if (!analyses || analyses.length === 0) {
      return {
        overallScore: 0,
        confidence: 0,
        category: 'neutral',
        breakdown: {
          positive: 0,
          negative: 0,
          neutral: 0
        },
        topSignals: [],
        sampleSize: 0
      };
    }

    let weightedScore = 0;
    let totalWeight = 0;
    let breakdown = { positive: 0, negative: 0, neutral: 0 };
    let allSignals: SentimentSignal[] = [];

    analyses.forEach(analysis => {
      const weight = analysis.confidence / 100;
      weightedScore += analysis.score * weight;
      totalWeight += weight;
      
      if (analysis.score > 1) breakdown.positive++;
      else if (analysis.score < -1) breakdown.negative++;
      else breakdown.neutral++;
      
      allSignals.push(...analysis.signals);
    });

    const overallScore = totalWeight > 0 ? weightedScore / totalWeight : 0;
    const avgConfidence = analyses.reduce((sum, a) => sum + a.confidence, 0) / analyses.length;

    const signalCounts: Record<string, SentimentSignal & { totalMatches: number }> = {};
    allSignals.forEach(signal => {
      const key = `${signal.keyword}_${signal.category}`;
      if (!signalCounts[key]) {
        signalCounts[key] = { ...signal, totalMatches: 0 };
      }
      signalCounts[key].totalMatches += signal.matches;
    });

    const topSignals = Object.values(signalCounts)
      .sort((a, b) => b.totalMatches - a.totalMatches)
      .slice(0, 10)
      .map(({ totalMatches, ...signal }) => signal);

    return {
      overallScore: Math.round(overallScore * 10) / 10,
      confidence: Math.round(avgConfidence),
      category: this.categorizeScore(overallScore),
      breakdown,
      topSignals,
      sampleSize: analyses.length
    };
  }
}

export const sentimentAnalyzer = new SentimentAnalyzer();
