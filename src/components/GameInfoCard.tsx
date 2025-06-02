
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';
import { sportsOddsApi, LiveScore } from '@/services/sportsOddsApi';

interface GameInfoCardProps {
  player: { name: string; playerData?: any } | null;
}

const GameInfoCard = ({ player }: GameInfoCardProps) => {
  const [gameData, setGameData] = useState<{
    liveGame?: LiveScore;
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
        
        // Only set live game data
        setGameData({
          liveGame: data.liveGame
        });
      } catch (error) {
        console.error('Error fetching game data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [player?.name, player?.playerData]);

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

  if (!gameData?.liveGame) return null;

  return (
    <div className="space-y-4">
      {/* Live Game */}
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
    </div>
  );
};

export default GameInfoCard;
