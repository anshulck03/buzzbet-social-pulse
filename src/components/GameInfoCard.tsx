
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Calendar, DollarSign } from 'lucide-react';
import { sportsOddsApi, LiveScore, GameOdds } from '@/services/sportsOddsApi';

interface GameInfoCardProps {
  player: { name: string; playerData?: any } | null;
}

const GameInfoCard = ({ player }: GameInfoCardProps) => {
  const [gameData, setGameData] = useState<{
    liveGame?: LiveScore;
    nextGame?: GameOdds;
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
        
        setGameData({
          liveGame: data.liveGame,
          nextGame: data.nextGame
        });
      } catch (error) {
        console.error('Error fetching game data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [player?.name, player?.playerData]);

  const formatGameTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getMoneylineOdds = (game: GameOdds, teamName: string) => {
    if (!game.bookmakers || game.bookmakers.length === 0) return null;
    
    const bookmaker = game.bookmakers[0]; // Use first available bookmaker
    const h2hMarket = bookmaker.markets.find(market => market.key === 'h2h');
    
    if (!h2hMarket) return null;
    
    const teamOdds = h2hMarket.outcomes.find(outcome => outcome.name === teamName);
    return teamOdds ? teamOdds.price : null;
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

  if (!gameData?.liveGame && !gameData?.nextGame) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="text-center text-slate-400">
            No games in the next week.
          </div>
        </CardContent>
      </Card>
    );
  }

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

      {/* Next Game with Moneyline */}
      {gameData.nextGame && (
        <Card className="bg-slate-800/50 border-slate-700 border-l-4 border-l-blue-400">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-400" />
              Next Game
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-slate-400 text-sm mb-2">
                {formatGameTime(gameData.nextGame.commence_time)}
              </p>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-slate-300 font-medium">{gameData.nextGame.away_team}</p>
                </div>
                <div className="text-center">
                  <span className="text-slate-400 text-sm">@</span>
                </div>
                <div className="text-center">
                  <p className="text-slate-300 font-medium">{gameData.nextGame.home_team}</p>
                </div>
              </div>
            </div>
            
            {/* Moneyline Odds */}
            <div className="border-t border-slate-600 pt-4">
              <div className="flex items-center mb-2">
                <DollarSign className="w-4 h-4 mr-2 text-green-400" />
                <span className="text-slate-300 font-medium">Moneyline</span>
              </div>
              <div className="flex justify-between">
                <div className="text-center">
                  <p className="text-slate-400 text-sm">{gameData.nextGame.away_team}</p>
                  <p className="text-green-400 font-bold">
                    {(() => {
                      const odds = getMoneylineOdds(gameData.nextGame!, gameData.nextGame!.away_team);
                      return odds ? (odds > 0 ? `+${odds}` : `${odds}`) : 'N/A';
                    })()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-sm">{gameData.nextGame.home_team}</p>
                  <p className="text-green-400 font-bold">
                    {(() => {
                      const odds = getMoneylineOdds(gameData.nextGame!, gameData.nextGame!.home_team);
                      return odds ? (odds > 0 ? `+${odds}` : `${odds}`) : 'N/A';
                    })()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GameInfoCard;
