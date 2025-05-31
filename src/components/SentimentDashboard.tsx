
import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Shield, Clock, Loader2, Hash, Brain, Target, Zap, Star, Trophy, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { redditApi } from '@/services/redditApi';
import { deepseekAnalyzer, DeepSeekSummaryAnalysis } from '@/services/deepseekAnalyzer';

interface SentimentDashboardProps {
  player: { name: string; playerData?: any } | null;
}

const SentimentDashboard = ({ player }: SentimentDashboardProps) => {
  const [aiAnalysis, setAiAnalysis] = useState<DeepSeekSummaryAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!player?.name) return;

    const fetchAnalysis = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching Reddit data for AI sports intelligence: ${player.name}`);
        const { posts, comments } = await redditApi.searchPlayerMentions(player.name, player.playerData);
        
        // Prepare posts for DeepSeek analysis
        const postsForAnalysis = posts.map(post => ({
          title: post.title,
          content: post.selftext || '',
          subreddit: post.subreddit
        }));
        
        // Add relevant comments as additional posts
        const commentsForAnalysis = comments.slice(0, 8).map(comment => ({
          title: 'Community Discussion',
          content: comment.body,
          subreddit: 'comment'
        }));
        
        const allContent = [...postsForAnalysis, ...commentsForAnalysis];
        
        console.log(`Analyzing ${allContent.length} pieces of content with DeepSeek AI`);
        const analysis = await deepseekAnalyzer.summarizePosts(allContent, player.name);
        setAiAnalysis(analysis);
        
      } catch (err) {
        console.error('Error fetching AI sports intelligence:', err);
        setError('AI analysis temporarily unavailable - retrying...');
        setAiAnalysis(null);
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
            <span className="text-slate-300">AI analyzing sports intelligence...</span>
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

  if (!aiAnalysis) {
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

  const getTrajectoryColor = (trajectory: string) => {
    switch (trajectory) {
      case 'Rising Star': return 'text-green-400 bg-green-900/20 border-green-700';
      case 'Proven Performer': return 'text-blue-400 bg-blue-900/20 border-blue-700';
      case 'Sleeper Pick': return 'text-purple-400 bg-purple-900/20 border-purple-700';
      case 'Declining': return 'text-orange-400 bg-orange-900/20 border-orange-700';
      case 'Avoid': return 'text-red-400 bg-red-900/20 border-red-700';
      default: return 'text-slate-400 bg-slate-900/20 border-slate-700';
    }
  };

  const getTrajectoryIcon = (trajectory: string) => {
    switch (trajectory) {
      case 'Rising Star': return <Star className="w-5 h-5" />;
      case 'Proven Performer': return <Trophy className="w-5 h-5" />;
      case 'Sleeper Pick': return <Activity className="w-5 h-5" />;
      case 'Declining': return <TrendingDown className="w-5 h-5" />;
      case 'Avoid': return <AlertTriangle className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getSportColor = (sport: string) => {
    switch (sport) {
      case 'NBA': return 'text-orange-400 border-orange-400';
      case 'NFL': return 'text-green-400 border-green-400';
      case 'NHL': return 'text-blue-400 border-blue-400';
      case 'MLB': return 'text-red-400 border-red-400';
      default: return 'text-slate-400 border-slate-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 6) return 'text-green-400';
    if (score >= 2) return 'text-lime-400';
    if (score >= -2) return 'text-yellow-400';
    if (score >= -6) return 'text-orange-400';
    return 'text-red-400';
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
      {/* AI-Powered Sports Intelligence */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-blue-400" />
              <span className="text-white">Sports Intelligence Report</span>
            </div>
            <div className="flex items-center space-x-2">
              {aiAnalysis.sport !== 'unknown' && (
                <Badge variant="outline" className={`${getSportColor(aiAnalysis.sport)} text-xs`}>
                  {aiAnalysis.sport}
                </Badge>
              )}
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                <Zap className="w-3 h-3 mr-1" />
                DeepSeek AI
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Performance Trajectory */}
          <div className={`mb-6 p-4 rounded-lg border ${getTrajectoryColor(aiAnalysis.performanceTrajectory)}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getTrajectoryIcon(aiAnalysis.performanceTrajectory)}
                <span className="font-bold text-lg">{aiAnalysis.performanceTrajectory}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`text-3xl font-bold ${getScoreColor(aiAnalysis.performanceScore)}`}>
                  {aiAnalysis.performanceScore >= 0 ? '+' : ''}{aiAnalysis.performanceScore}
                </div>
              </div>
            </div>
            <Progress 
              value={((aiAnalysis.performanceScore + 10) / 20) * 100} 
              className="h-2 bg-slate-700 mb-2"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>Avoid</span>
              <span>Monitor</span>
              <span>Rising Star</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-slate-400">
                Trajectory Confidence: {aiAnalysis.trajectoryConfidence}%
              </span>
              <span className={`${getSentimentColor(aiAnalysis.sentiment)} font-medium`}>
                {aiAnalysis.sentiment.toUpperCase()} ({aiAnalysis.sentimentConfidence}%)
              </span>
            </div>
          </div>
          
          {/* Player Summary */}
          <div className="mb-6 p-4 bg-slate-900/50 rounded-lg">
            <h4 className="text-white font-medium mb-2">Player Summary</h4>
            <p className="text-slate-300 text-sm leading-relaxed">{aiAnalysis.playerSummary}</p>
          </div>

          {/* AI Recommendation */}
          <div className="p-4 bg-slate-900/50 rounded-lg">
            <h4 className="text-white font-medium mb-2 flex items-center">
              <Target className="w-4 h-4 mr-2 text-green-400" />
              AI Recommendation
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">{aiAnalysis.recommendation}</p>
          </div>
        </CardContent>
      </Card>

      {/* Key Trends Analysis */}
      {aiAnalysis.keyTrends.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
              Key Trends Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiAnalysis.keyTrends.map((trend, index) => (
                <div 
                  key={index}
                  className="p-3 bg-slate-900/50 rounded-lg border-l-4 border-blue-400"
                >
                  <p className="text-slate-300 text-sm leading-relaxed">{trend}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Opportunities & Risk Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Opportunities */}
        {aiAnalysis.opportunities.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-400" />
                Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {aiAnalysis.opportunities.map((opportunity, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-green-900/20 rounded-lg border border-green-700/50"
                  >
                    <p className="text-green-300 text-sm leading-relaxed">{opportunity}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Risk Factors */}
        {aiAnalysis.riskFactors.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                Risk Factors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {aiAnalysis.riskFactors.map((risk, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-red-900/20 rounded-lg border border-red-700/50"
                  >
                    <p className="text-red-300 text-sm leading-relaxed">{risk}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Fantasy Impact */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-purple-400" />
            Fantasy Impact Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-slate-900/50 rounded-lg">
            <p className="text-slate-300 text-sm leading-relaxed">{aiAnalysis.fantasyImpact}</p>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources */}
      {aiAnalysis.subredditsAnalyzed.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Hash className="w-5 h-5 mr-2 text-orange-400" />
              AI-Discovered Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {aiAnalysis.subredditsAnalyzed.map((subreddit, index) => (
                <Badge key={index} variant="outline" className="text-orange-400 border-orange-400">
                  r/{subreddit}
                </Badge>
              ))}
            </div>
            <p className="text-slate-500 text-xs mt-3">
              AI analyzed {aiAnalysis.subredditsAnalyzed.length} intelligent subreddit sources
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SentimentDashboard;
