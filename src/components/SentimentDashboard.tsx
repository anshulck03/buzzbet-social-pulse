
import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Shield, Clock, Loader2, Hash, Brain, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { redditApi } from '@/services/redditApi';
import { groqAnalyzer, GroqSummaryAnalysis } from '@/services/groqAnalyzer';

interface SentimentDashboardProps {
  player: { name: string; playerData?: any } | null;
}

const SentimentDashboard = ({ player }: SentimentDashboardProps) => {
  const [groqAnalysis, setGroqAnalysis] = useState<GroqSummaryAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!player?.name) return;

    const fetchAnalysis = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching Reddit data for AI analysis: ${player.name}`);
        const { posts, comments } = await redditApi.searchPlayerMentions(player.name);
        
        // Prepare posts for Groq analysis
        const postsForAnalysis = posts.map(post => ({
          title: post.title,
          content: post.selftext || ''
        }));
        
        // Add relevant comments as additional posts
        const commentsForAnalysis = comments.slice(0, 10).map(comment => ({
          title: 'Comment',
          content: comment.body
        }));
        
        const allContent = [...postsForAnalysis, ...commentsForAnalysis];
        
        console.log(`Analyzing ${allContent.length} pieces of content with Groq AI`);
        const analysis = await groqAnalyzer.summarizePosts(allContent, player.name);
        setGroqAnalysis(analysis);
        
      } catch (err) {
        console.error('Error fetching AI analysis:', err);
        setError('AI analysis temporarily unavailable - retrying...');
        setGroqAnalysis(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [player?.name]);

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="flex items-center justify-center p-12">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            <span className="text-slate-300">AI analyzing Reddit sentiment...</span>
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
            <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <p className="text-yellow-300 mb-2">{error}</p>
            <p className="text-slate-400 text-sm">Analysis will resume automatically</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!groqAnalysis) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="text-center">
            <Brain className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 mb-2">No recent discussions found for {player?.name}</p>
            <p className="text-slate-500 text-sm">Try a different player or check back later</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 6) return 'text-green-400';
    if (score >= 2) return 'text-lime-400';
    if (score >= -2) return 'text-yellow-400';
    if (score >= -6) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 6) return 'Strong Buy';
    if (score >= 2) return 'Buy';
    if (score >= -2) return 'Hold';
    if (score >= -6) return 'Sell';
    return 'Strong Sell';
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI-Powered Main Analysis */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-blue-400" />
              <span className="text-white">AI Reddit Intelligence</span>
            </div>
            <div className="flex items-center space-x-2">
              {groqAnalysis.aggregatedScore > 0 ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                <Zap className="w-3 h-3 mr-1" />
                Groq Powered
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div className={`text-6xl font-bold ${getScoreColor(groqAnalysis.aggregatedScore)}`}>
              {groqAnalysis.aggregatedScore >= 0 ? '+' : ''}{groqAnalysis.aggregatedScore}
            </div>
            <div className="flex-1">
              <div className="mb-2">
                <span className={`text-lg font-medium ${getScoreColor(groqAnalysis.aggregatedScore)}`}>
                  {getScoreLabel(groqAnalysis.aggregatedScore)}
                </span>
              </div>
              <Progress 
                value={((groqAnalysis.aggregatedScore + 10) / 20) * 100} 
                className="h-3 bg-slate-700"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>Strong Sell</span>
                <span>Hold</span>
                <span>Strong Buy</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-slate-400">
                  AI Confidence: {groqAnalysis.confidenceLevel}%
                </span>
                <span className={`${getSentimentColor(groqAnalysis.sentiment)} font-medium`}>
                  {groqAnalysis.sentiment.toUpperCase()} ({groqAnalysis.sentimentConfidence}%)
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-slate-900/50 rounded-lg">
            <h4 className="text-white font-medium mb-2">Overall Sentiment</h4>
            <p className="text-slate-300 text-sm">{groqAnalysis.overallSentiment}</p>
          </div>

          <div className="mt-4 p-4 bg-slate-900/50 rounded-lg">
            <h4 className="text-white font-medium mb-2 flex items-center">
              <Target className="w-4 h-4 mr-2 text-green-400" />
              AI Recommendation
            </h4>
            <p className="text-slate-300 text-sm">{groqAnalysis.recommendation}</p>
          </div>
        </CardContent>
      </Card>

      {/* Key Trends Analysis */}
      {groqAnalysis.keyTrends.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
              Key Trends Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {groqAnalysis.keyTrends.map((trend, index) => (
                <div 
                  key={index}
                  className="p-3 bg-slate-900/50 rounded-lg border-l-4 border-blue-400"
                >
                  <p className="text-slate-300 text-sm">{trend}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Factors & Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Factors */}
        {groqAnalysis.riskFactors.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                Risk Factors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {groqAnalysis.riskFactors.map((risk, index) => (
                  <div 
                    key={index}
                    className="p-2 bg-red-900/20 rounded-lg border border-red-700/50"
                  >
                    <p className="text-red-300 text-sm">{risk}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Opportunities */}
        {groqAnalysis.opportunities.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-400" />
                Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {groqAnalysis.opportunities.map((opportunity, index) => (
                  <div 
                    key={index}
                    className="p-2 bg-green-900/20 rounded-lg border border-green-700/50"
                  >
                    <p className="text-green-300 text-sm">{opportunity}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Timeline Analysis */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Clock className="w-5 h-5 mr-2 text-purple-400" />
            Timeline Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-slate-900/50 rounded-lg">
            <p className="text-slate-300 text-sm">{groqAnalysis.timeline}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SentimentDashboard;
