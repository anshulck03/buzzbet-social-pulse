
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, User, Calendar, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { ESPNPlayer } from '@/services/espnPlayerDatabase';
import { DeepSeekSummaryAnalysis, deepseekAnalyzer } from '@/services/deepseekAnalyzer';
import { nbaImageService } from '@/services/nbaImageService';

interface PlayerProfileHeaderProps {
  player: ESPNPlayer;
  onRefreshAnalysis?: () => void;
}

const PlayerProfileHeader = ({ player, onRefreshAnalysis }: PlayerProfileHeaderProps) => {
  const [aiSummary, setAiSummary] = useState<DeepSeekSummaryAnalysis | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [playerImage, setPlayerImage] = useState<string>('');
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  console.log('PlayerProfileHeader player:', player);

  useEffect(() => {
    loadPlayerImage();
    generateAISummary();
  }, [player.id, player.displayName]);

  const loadPlayerImage = async () => {
    setIsLoadingImage(true);
    try {
      const imageUrl = await nbaImageService.getImageForPlayer(player.id, player.displayName);
      setPlayerImage(imageUrl);
    } catch (error) {
      console.error('Failed to load player image:', error);
    } finally {
      setIsLoadingImage(false);
    }
  };

  const generateAISummary = async () => {
    setIsLoadingAI(true);
    setAiError(null);
    try {
      // Create mock Reddit posts for AI analysis
      const mockPosts = [
        {
          title: `${player.displayName} performance analysis`,
          content: `Analyzing ${player.displayName} current form and statistics for ${player.team}`,
          subreddit: player.sport.toLowerCase()
        },
        {
          title: `${player.displayName} season outlook`,
          content: `Discussion about ${player.displayName} potential and team impact`,
          subreddit: 'sports'
        }
      ];

      const summary = await deepseekAnalyzer.summarizePosts(mockPosts, player.displayName);
      setAiSummary(summary);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to generate AI summary:', error);
      setAiError('Failed to generate AI analysis. Please try again.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleRefreshAnalysis = () => {
    generateAISummary();
    onRefreshAnalysis?.();
  };

  const getSportIcon = (sport: string) => {
    const sportColors = {
      'NBA': 'text-orange-400 bg-orange-400/10 border-orange-400/30',
      'NFL': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
      'NHL': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
      'MLB': 'text-red-400 bg-red-400/10 border-red-400/30'
    };
    return sportColors[sport] || 'text-slate-400 bg-slate-400/10 border-slate-400/30';
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  return (
    <div className="space-y-6">
      {/* Main Player Info Card */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Player Image Section */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-lg overflow-hidden bg-slate-700/30 border border-slate-600/50">
                {isLoadingImage ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                  </div>
                ) : playerImage ? (
                  <img 
                    src={playerImage} 
                    alt={player.displayName}
                    className="w-full h-full object-cover"
                    onError={() => setPlayerImage('')}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-12 h-12 text-slate-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Player Details */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl lg:text-3xl font-bold text-white">
                      {player.displayName}
                    </h2>
                    {player.jersey && (
                      <span className="text-lg text-slate-300">#{player.jersey}</span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge 
                      variant="outline" 
                      className={`${getSportIcon(player.sport)} border`}
                    >
                      {player.sport}
                    </Badge>
                    <span className="text-slate-300">{player.team}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300">{player.position}</span>
                  </div>

                  {/* Physical Stats */}
                  <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                    {player.height && (
                      <div className="flex items-center gap-1">
                        <span>Height:</span>
                        <span className="text-slate-300">{player.height}</span>
                      </div>
                    )}
                    {player.weight && (
                      <div className="flex items-center gap-1">
                        <span>Weight:</span>
                        <span className="text-slate-300">{player.weight} lbs</span>
                      </div>
                    )}
                    {player.age && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span className="text-slate-300">{player.age} years old</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Season Stats */}
                <div className="lg:text-right">
                  <h3 className="text-sm font-medium text-slate-400 mb-2">Current Season</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 text-sm">
                    {player.stats?.points && (
                      <div className="flex lg:justify-end items-center gap-2">
                        <span className="text-slate-400">Points:</span>
                        <span className="text-white font-medium">{player.stats.points}</span>
                      </div>
                    )}
                    {player.stats?.assists && (
                      <div className="flex lg:justify-end items-center gap-2">
                        <span className="text-slate-400">Assists:</span>
                        <span className="text-white font-medium">{player.stats.assists}</span>
                      </div>
                    )}
                    {player.stats?.rebounds && (
                      <div className="flex lg:justify-end items-center gap-2">
                        <span className="text-slate-400">Rebounds:</span>
                        <span className="text-white font-medium">{player.stats.rebounds}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Contract & Experience */}
              <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-700/50">
                {player.experience && (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Activity className="w-4 h-4" />
                    <span>{player.experience} years pro</span>
                  </div>
                )}
                {player.salary && (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <DollarSign className="w-4 h-4" />
                    <span>{formatCurrency(player.salary)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI-Powered Summary Card */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">AI Performance Analysis</h3>
            </div>
            <div className="flex items-center gap-2">
              {lastUpdated && (
                <span className="text-xs text-slate-400">
                  Updated {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshAnalysis}
                disabled={isLoadingAI}
                className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingAI ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          {isLoadingAI ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-3">
                <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                <span className="text-slate-300">Generating AI analysis...</span>
              </div>
            </div>
          ) : aiError ? (
            <div className="py-4 text-center">
              <p className="text-red-400 mb-2">{aiError}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshAnalysis}
                className="border-red-400/50 text-red-400 hover:bg-red-400/10"
              >
                Try Again
              </Button>
            </div>
          ) : aiSummary ? (
            <div className="space-y-4">
              {/* Quick Summary */}
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-slate-200 leading-relaxed">
                  {aiSummary.playerSummary}
                </p>
              </div>

              {/* Key Metrics Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-slate-700/20 rounded-lg">
                  <div className="text-lg font-bold text-white">
                    {aiSummary.performanceScore > 0 ? '+' : ''}{aiSummary.performanceScore}
                  </div>
                  <div className="text-xs text-slate-400">Performance Score</div>
                </div>
                <div className="text-center p-3 bg-slate-700/20 rounded-lg">
                  <div className="text-lg font-bold text-cyan-400">
                    {aiSummary.performanceTrajectory}
                  </div>
                  <div className="text-xs text-slate-400">Trajectory</div>
                </div>
                <div className="text-center p-3 bg-slate-700/20 rounded-lg">
                  <div className="text-lg font-bold text-emerald-400">
                    {aiSummary.fantasyInsights.startSitRecommendation}
                  </div>
                  <div className="text-xs text-slate-400">Fantasy</div>
                </div>
                <div className="text-center p-3 bg-slate-700/20 rounded-lg">
                  <div className="text-lg font-bold text-orange-400">
                    {aiSummary.recentPerformance.injuryStatus}
                  </div>
                  <div className="text-xs text-slate-400">Health</div>
                </div>
              </div>

              {/* Expandable Detailed Analysis */}
              <div>
                <Button
                  variant="ghost"
                  onClick={() => setShowFullSummary(!showFullSummary)}
                  className="text-cyan-400 hover:bg-cyan-400/10 p-0 h-auto"
                >
                  {showFullSummary ? 'Hide' : 'Show'} Detailed Analysis
                </Button>

                {showFullSummary && (
                  <div className="mt-4 space-y-4">
                    <div className="grid lg:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium text-slate-300 mb-2">Key Trends</h4>
                          <ul className="space-y-1">
                            {aiSummary.keyTrends.map((trend, index) => (
                              <li key={index} className="text-sm text-slate-400">• {trend}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-slate-300 mb-2">Opportunities</h4>
                          <ul className="space-y-1">
                            {aiSummary.opportunities.map((opportunity, index) => (
                              <li key={index} className="text-sm text-slate-400">• {opportunity}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium text-slate-300 mb-2">Risk Factors</h4>
                          <ul className="space-y-1">
                            {aiSummary.riskFactors.map((risk, index) => (
                              <li key={index} className="text-sm text-slate-400">• {risk}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-slate-300 mb-2">Fantasy Impact</h4>
                          <p className="text-sm text-slate-400">{aiSummary.fantasyImpact}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-700/50">
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Recommendation</h4>
                      <p className="text-sm text-cyan-400 font-medium">{aiSummary.recommendation}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerProfileHeader;
