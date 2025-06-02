
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gamepad2, Clock, Trophy, TrendingUp, Calendar, Activity } from 'lucide-react';
import { sportsOddsApi, GameOdds, LiveScore } from '@/services/sportsOddsApi';

interface GameInfoCardProps {
  player: { name: string; playerData?: any } | null;
}

const GameInfoCard = ({ player }: GameInfoCardProps) => {
  const [gameData, setGameData] = useState<{
    nextGame?: GameOdds;
    liveGame?: LiveScore;
    lastGame?: LiveScore;
    playerOdds?: any;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!player?.name) return;

    const fetchGameData = async () => {
      setLoading(true);
      try {
        const sport = player.playerData?.sport || 'NBA';
        const data = await sportsOddsApi.getPlayerGameInfo(player.name, sport);
        setGameData(data);
      } catch (error) {
        console.error('Error fetching game data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [player?.name]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const formatOdds = (price: number) => {
    return price > 0 ? `+${price}` : `${price}`;
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Activity className="w-5 h-5 animate-spin text-blue-400 mr-2" />
            <span className="text-slate-300">Loading game data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!gameData) return null;

  return (
    <div className="space-y-4">
      {/* Live Game */}
      {gameData.liveGame && (
        <Card className="bg-slate-800/50 border-slate-700 border-l-4 border-l-red-400">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="w-5 h-5 mr-2 text-red-400 animate-pulse" />
              Live Game
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="text-center">
                <p className="text-slate-300 font-medium">{gameData.liveGame.away_team}</p>
                <p className="text-2xl font-bold text-white">
                  {gameData.liveGame.scores?.find(s => s.name === gameData.liveGame!.away_team)?.score || '0'}
                </p>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="text-red-400 border-red-400 animate-pulse">
                  LIVE
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-slate-300 font-medium">{gameData.liveGame.home_team}</p>
                <p className="text-2xl font-bold text-white">
                  {gameData.liveGame.scores?.find(s => s.name === gameData.liveGame!.home_team)?.score || '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Game */}
      {gameData.nextGame && (
        <Card className="bg-slate-800/50 border-slate-700 border-l-4 border-l-green-400">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-400" />
              Next Game
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 font-medium">{gameData.nextGame.away_team}</span>
                <span className="text-slate-500">@</span>
                <span className="text-slate-300 font-medium">{gameData.nextGame.home_team}</span>
              </div>
              
              <div className="text-center mb-4">
                <div className="text-slate-400 text-sm">
                  {formatDateTime(gameData.nextGame.commence_time).date}
                </div>
                <div className="text-white font-medium">
                  {formatDateTime(gameData.nextGame.commence_time).time}
                </div>
              </div>

              {/* Betting Odds */}
              {gameData.nextGame.bookmakers && gameData.nextGame.bookmakers.length > 0 && (
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <h4 className="text-slate-300 font-medium mb-2 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Betting Odds ({gameData.nextGame.bookmakers[0].title})
                  </h4>
                  
                  {gameData.nextGame.bookmakers[0].markets.map((market, index) => (
                    <div key={index} className="mb-2">
                      <p className="text-xs text-slate-500 mb-1">
                        {market.key === 'h2h' ? 'Moneyline' : market.key.toUpperCase()}
                      </p>
                      <div className="flex justify-between gap-2">
                        {market.outcomes.map((outcome, outcomeIndex) => (
                          <div key={outcomeIndex} className="flex-1 text-center p-2 bg-slate-800/50 rounded">
                            <p className="text-xs text-slate-400">{outcome.name}</p>
                            <p className="text-sm font-medium text-white">
                              {formatOdds(outcome.price)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Last Game */}
      {gameData.lastGame && !gameData.liveGame && (
        <Card className="bg-slate-800/50 border-slate-700 border-l-4 border-l-blue-400">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-blue-400" />
              Last Game
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="text-center">
                <p className="text-slate-300 font-medium">{gameData.lastGame.away_team}</p>
                <p className="text-2xl font-bold text-white">
                  {gameData.lastGame.scores?.find(s => s.name === gameData.lastGame!.away_team)?.score || '0'}
                </p>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  FINAL
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-slate-300 font-medium">{gameData.lastGame.home_team}</p>
                <p className="text-2xl font-bold text-white">
                  {gameData.lastGame.scores?.find(s => s.name === gameData.lastGame!.home_team)?.score || '0'}
                </p>
              </div>
            </div>
            <div className="text-center mt-2">
              <p className="text-xs text-slate-500">
                {formatDateTime(gameData.lastGame.commence_time).date}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GameInfoCard;
