
import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Shield, Clock, Loader2, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { redditApi } from '@/services/redditApi';
import { sentimentAnalyzer, AggregateSentimentResult } from '@/utils/advancedSentimentAnalysis';

interface SentimentDashboardProps {
  player: { name: string; playerData?: any } | null;
}

const SentimentDashboard = ({ player }: SentimentDashboardProps) => {
  const [sentimentData, setSentimentData] = useState<AggregateSentimentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!player?.name) return;

    const fetchSentimentData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching Reddit data for ${player.name}`);
        const { posts, comments } = await redditApi.searchPlayerMentions(player.name);
        
        // Analyze sentiment for each post and comment
        const analyses = [];
        
        // Analyze posts
        posts.forEach(post => {
          const analysis = sentimentAnalyzer.analyzeSentiment(
            post.selftext || post.title,
            post.title,
            post.score,
            post.num_comments
          );
          analyses.push(analysis);
        });
        
        // Analyze comments
        comments.forEach(comment => {
          const analysis = sentimentAnalyzer.analyzeSentiment(
            comment.body,
            '',
            comment.score,
            0
          );
          analyses.push(analysis);
        });
        
        // Aggregate all analyses
        const aggregateResult = sentimentAnalyzer.aggregateSentiment(analyses);
        setSentimentData(aggregateResult);
        
      } catch (err) {
        console.error('Error fetching sentiment data:', err);
        setError('Failed to load sentiment data from Reddit');
        setSentimentData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSentimentData();
  }, [player?.name]);

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="flex items-center justify-center p-12">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            <span className="text-slate-300">Analyzing Reddit sentiment...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <p className="text-red-300 mb-2">{error}</p>
            <p className="text-slate-400 text-sm">Try searching for a different player</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!sentimentData || sentimentData.sampleSize === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 mb-2">No recent discussions found for {player?.name}</p>
            <p className="text-slate-500 text-sm">Try a different player or check back later</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSentimentColor = (score: number) => {
    if (score >= 6) return 'text-green-400';
    if (score >= 2) return 'text-lime-400';
    if (score >= -2) return 'text-yellow-400';
    if (score >= -6) return 'text-orange-400';
    return 'text-red-400';
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'very_positive': return 'Very Bullish';
      case 'positive': return 'Bullish';
      case 'neutral': return 'Neutral';
      case 'negative': return 'Bearish';
      case 'very_negative': return 'Very Bearish';
      default: return 'Neutral';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Sentiment Score */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-white">Reddit Sentiment Analysis</span>
            <div className="flex items-center space-x-2">
              {sentimentData.overallScore > 0 ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
              <Badge variant="outline" className="text-slate-300 border-slate-600">
                {sentimentData.sampleSize} posts analyzed
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div className={`text-6xl font-bold ${getSentimentColor(sentimentData.overallScore)}`}>
              {sentimentData.overallScore >= 0 ? '+' : ''}{sentimentData.overallScore}
            </div>
            <div className="flex-1">
              <div className="mb-2">
                <span className={`text-lg font-medium ${getSentimentColor(sentimentData.overallScore)}`}>
                  {getCategoryLabel(sentimentData.category)}
                </span>
              </div>
              <Progress 
                value={((sentimentData.overallScore + 10) / 20) * 100} 
                className="h-3 bg-slate-700"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>Very Bearish</span>
                <span>Neutral</span>
                <span>Very Bullish</span>
              </div>
              <div className="mt-2 text-sm text-slate-400">
                Confidence: {sentimentData.confidence}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Breakdown */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Discussion Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-slate-900/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-green-400 font-medium">Positive</h4>
                <span className="text-green-400 font-bold">
                  {sentimentData.breakdown.positive}
                </span>
              </div>
              <Progress 
                value={(sentimentData.breakdown.positive / sentimentData.sampleSize) * 100} 
                className="h-2 bg-slate-700" 
              />
            </div>
            
            <div className="p-4 bg-slate-900/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-yellow-400 font-medium">Neutral</h4>
                <span className="text-yellow-400 font-bold">
                  {sentimentData.breakdown.neutral}
                </span>
              </div>
              <Progress 
                value={(sentimentData.breakdown.neutral / sentimentData.sampleSize) * 100} 
                className="h-2 bg-slate-700" 
              />
            </div>
            
            <div className="p-4 bg-slate-900/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-red-400 font-medium">Negative</h4>
                <span className="text-red-400 font-bold">
                  {sentimentData.breakdown.negative}
                </span>
              </div>
              <Progress 
                value={(sentimentData.breakdown.negative / sentimentData.sampleSize) * 100} 
                className="h-2 bg-slate-700" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Sentiment Keywords */}
      {sentimentData.topSignals.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Hash className="w-5 h-5 mr-2 text-blue-400" />
              Top Sentiment Keywords
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sentimentData.topSignals.slice(0, 8).map((signal, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        signal.weight > 0 ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400'
                      }`}
                    >
                      {signal.keyword}
                    </Badge>
                    <span className="text-slate-400 text-sm capitalize">
                      {signal.category.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-300 text-sm">{signal.matches}x</span>
                    <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
                      {signal.impact}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SentimentDashboard;
