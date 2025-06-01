
import React from 'react';
import { Flame, TrendingUp, Star } from 'lucide-react';
import { smartSearchService } from '@/services/smartSearchService';

interface TrendingPlayersSectionProps {
  onPlayerSelect: (playerName: string) => void;
}

const TrendingPlayersSection = ({ onPlayerSelect }: TrendingPlayersSectionProps) => {
  const trendingPlayers = smartSearchService.getTrendingPlayers();
  const popularSearches = smartSearchService.getPopularSearches();

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'hot': return <Flame className="w-3 h-3 text-orange-400" />;
      case 'up': return <TrendingUp className="w-3 h-3 text-emerald-400" />;
      case 'new': return <Star className="w-3 h-3 text-blue-400" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Trending Players */}
      <div>
        <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center">
          <Flame className="w-4 h-4 mr-2 text-orange-400" />
          Trending Now
        </h4>
        <div className="space-y-2">
          {trendingPlayers.map((player, index) => (
            <button
              key={index}
              onClick={() => onPlayerSelect(player.name)}
              className="w-full flex items-center justify-between p-2 hover:bg-slate-700/50 rounded text-left transition-all"
            >
              <span className="text-slate-300 text-sm">{player.name}</span>
              {getTrendIcon(player.trend)}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Searches */}
      <div>
        <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center">
          <Star className="w-4 h-4 mr-2 text-yellow-400" />
          Popular Players
        </h4>
        <div className="space-y-2">
          {popularSearches.slice(0, 6).map((player, index) => (
            <button
              key={index}
              onClick={() => onPlayerSelect(player)}
              className="w-full text-left p-2 hover:bg-slate-700/50 rounded text-slate-300 text-sm transition-all"
            >
              {player}
            </button>
          ))}
        </div>
      </div>

      {/* Search Tips */}
      <div className="mt-6 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
        <h4 className="text-xs font-medium text-slate-400 mb-2">💡 Smart Search Tips</h4>
        <div className="space-y-1 text-xs text-slate-500">
          <p>• Try nicknames: "The King", "Chef Curry", "TB12"</p>
          <p>• Use team codes: "LAL", "KC", "NYY"</p>
          <p>• Search by position: "NBA centers", "NFL quarterbacks"</p>
        </div>
      </div>
    </div>
  );
};

export default TrendingPlayersSection;
