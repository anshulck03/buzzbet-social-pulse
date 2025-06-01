
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Star, Flame, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { ESPNPlayer } from '@/services/espnPlayerDatabase';

interface EnhancedPlayerCardProps {
  player: ESPNPlayer;
  onClick: () => void;
  showTrending?: boolean;
  compact?: boolean;
}

const EnhancedPlayerCard = ({ player, onClick, showTrending = false, compact = false }: EnhancedPlayerCardProps) => {
  const getSportColor = (sport: string) => {
    switch (sport) {
      case 'NBA': return 'text-orange-400 border-orange-400 bg-orange-400/10';
      case 'NFL': return 'text-emerald-400 border-emerald-400 bg-emerald-400/10';
      case 'MLB': return 'text-blue-400 border-blue-400 bg-blue-400/10';
      case 'NHL': return 'text-purple-400 border-purple-400 bg-purple-400/10';
      default: return 'text-slate-400 border-slate-400 bg-slate-400/10';
    }
  };

  const getPositionIcon = (position: string, sport: string) => {
    if (sport === 'NFL' && (position.includes('QB') || position.includes('Quarterback'))) return '🏈';
    if (sport === 'NBA' && (position.includes('PG') || position.includes('Point'))) return '🏀';
    if (sport === 'MLB' && (position.includes('P') || position.includes('Pitcher'))) return '⚾';
    if (sport === 'NHL' && (position.includes('C') || position.includes('Center'))) return '🏒';
    return '';
  };

  const getPlayerStatus = () => {
    // Simulate player status - in real app this would come from injury/status APIs
    const random = Math.random();
    if (random > 0.8) return { status: 'injured', icon: AlertCircle, color: 'text-red-400' };
    if (random > 0.7) return { status: 'questionable', icon: Clock, color: 'text-yellow-400' };
    return { status: 'healthy', icon: CheckCircle, color: 'text-emerald-400' };
  };

  const isElitePlayer = () => {
    // Check if player is considered elite based on name recognition
    const elitePlayers = [
      'LeBron James', 'Stephen Curry', 'Kevin Durant', 'Giannis Antetokounmpo',
      'Patrick Mahomes', 'Josh Allen', 'Lamar Jackson', 'Aaron Rodgers',
      'Mike Trout', 'Aaron Judge', 'Mookie Betts', 'Shohei Ohtani'
    ];
    return elitePlayers.includes(player.name);
  };

  const playerStatus = getPlayerStatus();
  const positionIcon = getPositionIcon(player.position, player.sport);
  const isElite = isElitePlayer();

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center space-x-3 p-3 hover:bg-slate-700/50 rounded-lg transition-all text-left border border-slate-600/30 hover:border-slate-500/50"
      >
        <Avatar className="w-10 h-10">
          <AvatarImage src={player.headshot} alt={player.name} />
          <AvatarFallback className="bg-slate-700 text-slate-300 text-sm">
            {player.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p className="text-white font-medium truncate">{player.name}</p>
            {isElite && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
            {showTrending && <Flame className="w-4 h-4 text-orange-400" />}
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <span>{positionIcon}</span>
            <span>{player.position}</span>
            <span>•</span>
            <span className="truncate">{player.team}</span>
            <playerStatus.icon className={`w-4 h-4 ${playerStatus.color}`} />
          </div>
        </div>
        <Badge variant="outline" className={`text-xs ${getSportColor(player.sport)}`}>
          {player.sport}
        </Badge>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full p-4 hover:bg-slate-700/50 rounded-lg transition-all text-left border border-slate-600/30 hover:border-slate-500/50"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={player.headshot} alt={player.name} />
            <AvatarFallback className="bg-slate-700 text-slate-300">
              {player.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-white font-semibold">{player.name}</h3>
              {isElite && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
              {showTrending && <TrendingUp className="w-4 h-4 text-emerald-400" />}
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <span>{positionIcon}</span>
              <span>{player.position}</span>
              <span>•</span>
              <span>{player.team}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <Badge variant="outline" className={`text-xs ${getSportColor(player.sport)}`}>
            {player.sport}
          </Badge>
          <div className="flex items-center space-x-1">
            <playerStatus.icon className={`w-4 h-4 ${playerStatus.color}`} />
            <span className={`text-xs ${playerStatus.color}`}>
              {playerStatus.status === 'healthy' ? 'Healthy' : 
               playerStatus.status === 'questionable' ? 'Questionable' : 'Injured'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Additional context line */}
      <div className="text-xs text-slate-500 mt-2">
        {player.sport === 'NBA' && 'Next game: Tonight vs Warriors • Fantasy Tier: Elite'}
        {player.sport === 'NFL' && 'Next game: Sunday vs Patriots • Status: Starter'}
        {player.sport === 'MLB' && 'Next start: Wednesday vs Yankees • ERA: 2.85'}
        {player.sport === 'NHL' && 'Next game: Friday vs Rangers • PPG: 1.2'}
      </div>
    </button>
  );
};

export default EnhancedPlayerCard;
