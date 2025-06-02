
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Activity } from 'lucide-react';
import { sportsOddsApi, LiveScore } from '@/services/sportsOddsApi';

interface GameInfoCardProps {
  player: { name: string; playerData?: any } | null;
}

const GameInfoCard = ({ player }: GameInfoCardProps) => {
  const [gameData, setGameData] = useState<{
    liveGame?: LiveScore;
    lastGame?: LiveScore;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!player?.name) return;

    const fetchGameData = async () => {
      setLoading(true);
      try {
        const sport = player.playerData?.sport || 'NBA';
        console.log(`Fetching game data for ${player.name} with team: ${player.playerData?.team || player.playerData?.teamAbbr}`);
        const data = await sportsOddsApi.getPlayerGameInfo(player.name, sport, player.playerData);
        
        // Only set live game and last game data, explicitly exclude next game
        setGameData({
          liveGame: data.liveGame,
          lastGame: data.lastGame
        });
      } catch (error) {
        console.error('Error fetching game data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [player?.name, player?.playerData]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
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

      {/* Last Game Statistics - Enhanced */}
      {gameData.lastGame && !gameData.liveGame && (
        <Card className="bg-slate-800/50 border-slate-700 border-l-4 border-l-blue-400">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-blue-400" />
              Team's Last Game
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Game Result */}
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <p className="text-slate-300 font-medium">{gameData.lastGame.away_team}</p>
                  <p className="text-2xl font-bold text-white">
                    {gameData.lastGame.scores?.find(s => s.name === gameData.lastGame!.away_team)?.score || '0'}
                  </p>
                </div>
                <div className="text-center mx-4">
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    FINAL
                  </Badge>
                </div>
                <div className="text-center flex-1">
                  <p className="text-slate-300 font-medium">{gameData.lastGame.home_team}</p>
                  <p className="text-2xl font-bold text-white">
                    {gameData.lastGame.scores?.find(s => s.name === gameData.lastGame!.home_team)?.score || '0'}
                  </p>
                </div>
              </div>

              {/* Game Details */}
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Date:</span>
                    <p className="text-slate-300">{formatDateTime(gameData.lastGame.commence_time).date}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Result:</span>
                    <p className="text-slate-300">
                      {(() => {
                        const awayScore = parseInt(gameData.lastGame.scores?.find(s => s.name === gameData.lastGame!.away_team)?.score || '0');
                        const homeScore = parseInt(gameData.lastGame.scores?.find(s => s.name === gameData.lastGame!.home_team)?.score || '0');
                        const playerTeam = player?.playerData?.team || '';
                        
                        if (playerTeam === gameData.lastGame.away_team) {
                          return awayScore > homeScore ? 'Win' : 'Loss';
                        } else if (playerTeam === gameData.lastGame.home_team) {
                          return homeScore > awayScore ? 'Win' : 'Loss';
                        }
                        return 'Result';
                      })()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Score Difference */}
              <div className="text-center">
                <p className="text-xs text-slate-500">
                  Score Difference: {Math.abs(
                    parseInt(gameData.lastGame.scores?.find(s => s.name === gameData.lastGame!.away_team)?.score || '0') -
                    parseInt(gameData.lastGame.scores?.find(s => s.name === gameData.lastGame!.home_team)?.score || '0')
                  )} points
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GameInfoCard;
