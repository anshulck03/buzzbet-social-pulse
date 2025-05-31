
import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Shield, Clock, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { redditApi } from '@/services/redditApi';
import { analyzeSentiment, SentimentAnalysis } from '@/utils/sentimentAnalysis';

const SentimentDashboard = ({ player }) => {
  const [sentimentData, setSentimentData] = useState<SentimentAnalysis | null>(null);
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
        const analysis = analyzeSentiment(posts, comments);
        setSentimentData(analysis);
      } catch (err) {
        console.error('Error fetching sentiment data:', err);
        setError('Failed to load sentiment data. Using mock data.');
        
        // Fallback to mock data
        setSentimentData({
          score: 7.2,
          confidence: 0.8,
          positiveCount: 15,
          negativeCount: 5,
          injuryMentions: 2,
          performanceMentions: 12,
          totalMentions: 47,
          insights: ['Mock data - Reddit API integration in progress', 'High performance discussion volume']
        });
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

  if (!sentimentData) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="flex items-center justify-center p-12">
          <span className="text-slate-400">No sentiment data available</span>
        </CardContent>
      </Card>
    );
  }

  const getSentimentColor = (score) => {
    if (score >= 7) return 'text-green-400';
    if (score >= 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSentimentBg = (score) => {
    if (score >= 7) return 'bg-green-400/20';
    if (score >= 5) return 'bg-yellow-400/20';
    return 'bg-red-400/20';
  };

  return (
    <div className="space-y-6">
      {error && (
        <Card className="bg-yellow-900/20 border-yellow-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-300 text-sm">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Sentiment Score */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-white">Reddit Sentiment Analysis</span>
            <div className="flex items-center space-x-2">
              {sentimentData.score > 5 ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
              <Badge variant="outline" className="text-slate-300 border-slate-600">
                {sentimentData.totalMentions} mentions
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div className={`text-6xl font-bold ${getSentimentColor(sentimentData.score)}`}>
              {sentimentData.score}
            </div>
            <div className="flex-1">
              <Progress 
                value={sentimentData.score * 10} 
                className="h-3 bg-slate-700"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>Bearish</span>
                <span>Neutral</span>
                <span>Bullish</span>
              </div>
              <div className="mt-2 text-sm text-slate-400">
                Confidence: {Math.round(sentimentData.confidence * 100)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sentimentData.insights.map((insight, index) => (
            <div 
              key={index}
              className="p-3 rounded-lg border bg-slate-900/20 border-slate-700"
            >
              <p className="text-slate-300 text-sm">{insight}</p>
            </div>
          ))}
          
          {sentimentData.injuryMentions > 0 && (
            <div className="p-3 rounded-lg border bg-red-900/20 border-red-700">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="outline" className="mb-2 text-red-400 border-red-400">
                    Injury Watch
                  </Badge>
                  <p className="text-slate-300 text-sm">
                    Injury mentioned {sentimentData.injuryMentions} times in recent discussions
                  </p>
                </div>
                <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse"></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sentiment Breakdown */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Sentiment Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-green-400 font-medium">Positive</h4>
                <span className="text-green-400 font-bold">
                  {sentimentData.positiveCount}
                </span>
              </div>
              <Progress 
                value={(sentimentData.positiveCount / (sentimentData.positiveCount + sentimentData.negativeCount)) * 100} 
                className="h-2 bg-slate-700" 
              />
            </div>
            
            <div className="p-4 bg-slate-900/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-red-400 font-medium">Negative</h4>
                <span className="text-red-400 font-bold">
                  {sentimentData.negativeCount}
                </span>
              </div>
              <Progress 
                value={(sentimentData.negativeCount / (sentimentData.positiveCount + sentimentData.negativeCount)) * 100} 
                className="h-2 bg-slate-700" 
              />
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Performance mentions: {sentimentData.performanceMentions}</span>
              <span>Sample size: {sentimentData.totalMentions}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SentimentDashboard;
