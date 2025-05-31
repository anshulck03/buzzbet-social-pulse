
import { RedditPost, RedditComment } from '@/services/redditApi';

interface SentimentKeywords {
  positive: string[];
  negative: string[];
  injury: string[];
  performance: string[];
}

const SENTIMENT_KEYWORDS: SentimentKeywords = {
  positive: [
    'beast', 'amazing', 'clutch', 'elite', 'goat', 'incredible', 'dominant', 'unstoppable',
    'mvp', 'all-star', 'legendary', 'perfect', 'excellent', 'outstanding', 'phenomenal',
    'crushing', 'killing it', 'on fire', 'lights out', 'money', 'automatic'
  ],
  negative: [
    'trash', 'terrible', 'awful', 'horrible', 'worst', 'garbage', 'disappointing',
    'pathetic', 'overrated', 'washed', 'declining', 'struggling', 'choking',
    'bust', 'liability', 'brick', 'turnover machine', 'can\'t shoot', 'useless'
  ],
  injury: [
    'injury', 'injured', 'hurt', 'pain', 'ankle', 'knee', 'shoulder', 'back',
    'hamstring', 'questionable', 'doubtful', 'out', 'sidelined', 'limping',
    'soreness', 'strain', 'sprain', 'torn', 'surgery', 'rehab'
  ],
  performance: [
    'points', 'rebounds', 'assists', 'blocks', 'steals', 'shooting', 'defense',
    'offense', 'clutch', 'fourth quarter', 'game winner', 'triple double',
    'double double', 'efficiency', 'usage rate', 'plus minus'
  ]
};

export interface SentimentAnalysis {
  score: number; // 0-10 scale
  confidence: number; // 0-1 scale
  positiveCount: number;
  negativeCount: number;
  injuryMentions: number;
  performanceMentions: number;
  totalMentions: number;
  insights: string[];
}

export function analyzeSentiment(posts: RedditPost[], comments: RedditComment[]): SentimentAnalysis {
  let positiveCount = 0;
  let negativeCount = 0;
  let injuryMentions = 0;
  let performanceMentions = 0;
  const insights: string[] = [];

  // Combine all text content
  const allTexts: string[] = [];
  
  posts.forEach(post => {
    allTexts.push(post.title.toLowerCase());
    if (post.selftext) {
      allTexts.push(post.selftext.toLowerCase());
    }
  });

  comments.forEach(comment => {
    allTexts.push(comment.body.toLowerCase());
  });

  // Analyze each text
  allTexts.forEach(text => {
    // Count positive keywords
    SENTIMENT_KEYWORDS.positive.forEach(keyword => {
      if (text.includes(keyword)) {
        positiveCount++;
      }
    });

    // Count negative keywords
    SENTIMENT_KEYWORDS.negative.forEach(keyword => {
      if (text.includes(keyword)) {
        negativeCount++;
      }
    });

    // Count injury mentions
    SENTIMENT_KEYWORDS.injury.forEach(keyword => {
      if (text.includes(keyword)) {
        injuryMentions++;
      }
    });

    // Count performance mentions
    SENTIMENT_KEYWORDS.performance.forEach(keyword => {
      if (text.includes(keyword)) {
        performanceMentions++;
      }
    });
  });

  const totalMentions = allTexts.length;
  const totalSentimentMentions = positiveCount + negativeCount;

  // Calculate sentiment score (0-10 scale)
  let score = 5; // Neutral baseline
  
  if (totalSentimentMentions > 0) {
    const positiveRatio = positiveCount / totalSentimentMentions;
    score = 5 + (positiveRatio - 0.5) * 10;
    score = Math.max(0, Math.min(10, score));
  }

  // Calculate confidence based on sample size
  const confidence = Math.min(1, totalSentimentMentions / 10);

  // Generate insights
  if (injuryMentions > 2) {
    insights.push(`Injury concerns mentioned ${injuryMentions} times`);
  }

  if (positiveCount > negativeCount * 2) {
    insights.push('Strongly positive sentiment detected');
  } else if (negativeCount > positiveCount * 2) {
    insights.push('Strongly negative sentiment detected');
  }

  if (performanceMentions > 5) {
    insights.push('High performance discussion volume');
  }

  if (totalMentions < 5) {
    insights.push('Limited discussion volume - low confidence');
  }

  return {
    score: Math.round(score * 10) / 10,
    confidence: Math.round(confidence * 100) / 100,
    positiveCount,
    negativeCount,
    injuryMentions,
    performanceMentions,
    totalMentions,
    insights
  };
}

export function getTopPosts(posts: RedditPost[], type: 'positive' | 'negative', limit: number = 5): RedditPost[] {
  const keywords = type === 'positive' ? SENTIMENT_KEYWORDS.positive : SENTIMENT_KEYWORDS.negative;
  
  return posts
    .filter(post => {
      const text = (post.title + ' ' + post.selftext).toLowerCase();
      return keywords.some(keyword => text.includes(keyword));
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getTopComments(comments: RedditComment[], type: 'positive' | 'negative', limit: number = 5): RedditComment[] {
  const keywords = type === 'positive' ? SENTIMENT_KEYWORDS.positive : SENTIMENT_KEYWORDS.negative;
  
  return comments
    .filter(comment => {
      const text = comment.body.toLowerCase();
      return keywords.some(keyword => text.includes(keyword));
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
