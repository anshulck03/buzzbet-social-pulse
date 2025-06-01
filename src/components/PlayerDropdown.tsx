
import React, { useState, useEffect } from 'react';
import { Loader2, TrendingUp, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { dynamicPlayerRanking, PlayerScore } from '@/services/dynamicPlayerRanking';

interface PlayerDropdownProps {
  filterType: string;
  onPlayerSelect: (playerName: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const PlayerDropdown = ({ filterType, onPlayerSelect, isOpen, onClose }: PlayerDropdownProps) => {
  const [players, setPlayers] = useState<PlayerScore[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && filterType) {
      loadPlayers();
    }
  }, [isOpen, filterType]);

  const loadPlayers = async () => {
    setIsLoading(true);
    try {
      let playerData: PlayerScore[] = [];
      
      switch (filterType) {
        case 'NFL':
        case 'NBA':
        case 'MLB':
        case 'NHL':
          playerData = await dynamicPlayerRanking.getTopPlayersBySport(filterType, 5);
          break;
        case 'trending':
          playerData = await dynamicPlayerRanking.getTrendingPlayers(5);
          break;
        case 'elite':
          playerData = await dynamicPlayerRanking.getAllStarPlayers(5);
          break;
        default:
          playerData = [];
      }
      
      setPlayers(playerData);
    } catch (error) {
      console.error('Error loading players:', error);
      setPlayers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (indicator?: string) => {
    switch (indicator) {
      case 'trending':
        return <TrendingUp className="w-3 h-3 text-orange-400" />;
      case 'elite':
        return <Star className="w-3 h-3 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getDescription = () => {
    switch (filterType) {
      case 'NFL':
        return 'Top 5 NFL players by multiple subreddit coverage & performance';
      case 'NBA':
        return 'Top 5 NBA players by community buzz & current season impact';
      case 'MLB':
        return 'Top 5 MLB players by discussion volume & achievements';
      case 'NHL':
        return 'Top 5 NHL players by performance & community engagement';
      case 'trending':
        return 'Cross-sport trending players with biggest discussion spikes';
      case 'elite':
        return 'All-Star caliber players across NFL, NBA, MLB & NHL';
      default:
        return 'Dynamic player rankings with enhanced coverage';
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border-slate-600 z-50 shadow-xl">
      <CardContent className="p-0">
        <div className="p-3 border-b border-slate-700">
          <p className="text-xs text-slate-400">{getDescription()}</p>
        </div>
        
        {isLoading ? (
          <div className="p-4 text-center">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Analyzing enhanced coverage data...</p>
          </div>
        ) : players.length > 0 ? (
          <div className="p-2">
            {players.map((playerScore) => (
              <button
                key={playerScore.player.id}
                onClick={() => {
                  onPlayerSelect(playerScore.player.name);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-700/50 rounded-lg text-left transition-all group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
                      {playerScore.player.name}
                    </span>
                    {getStatusIcon(playerScore.trendingIndicator)}
                  </div>
                  <p className="text-xs text-slate-400">
                    {playerScore.player.position} • {playerScore.player.teamAbbr || playerScore.player.team}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-blue-400 font-medium">
                    Score: {Math.round(playerScore.totalScore)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center">
            <p className="text-sm text-slate-400">No players found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerDropdown;
