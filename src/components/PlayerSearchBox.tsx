
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ESPNPlayer, espnPlayerDB } from '@/services/espnPlayerDatabase';

interface PlayerSearchBoxProps {
  onPlayerSelect: (player: { name: string; playerData?: ESPNPlayer }) => void;
  value: { name: string; playerData?: ESPNPlayer } | null;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  isLoading?: boolean;
}

const PlayerSearchBox = ({ onPlayerSelect, value, onSearch, onClear, isLoading = false }: PlayerSearchBoxProps) => {
  const [query, setQuery] = useState(value?.name || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState<ESPNPlayer[]>([]);
  const [dbStats, setDbStats] = useState<{total: number, nba: number, nfl: number, mlb: number, nhl: number} | null>(null);
  const [isDbLoading, setIsDbLoading] = useState(true);
  const [cacheStatus, setCacheStatus] = useState<'loading' | 'cached' | 'fresh'>('loading');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Load database stats on component mount
  useEffect(() => {
    const loadStats = async () => {
      try {
        console.log('Loading player database...');
        setIsDbLoading(true);
        
        // Check if data will come from cache
        const hasCache = localStorage.getItem('espn_players_cache');
        if (hasCache) {
          setCacheStatus('cached');
        }
        
        await espnPlayerDB.loadAllPlayers();
        
        const total = espnPlayerDB.getPlayerCount();
        const nba = espnPlayerDB.getPlayersBySport('NBA').length;
        const nfl = espnPlayerDB.getPlayersBySport('NFL').length;
        const mlb = espnPlayerDB.getPlayersBySport('MLB').length;
        const nhl = espnPlayerDB.getPlayersBySport('NHL').length;
        
        setDbStats({ total, nba, nfl, mlb, nhl });
        setIsDbLoading(false);
        
        if (!hasCache) {
          setCacheStatus('fresh');
        }
        
        console.log('=== PLAYER DATABASE STATS ===');
        console.log(`Total players: ${total}`);
        console.log(`NBA players: ${nba}`);
        console.log(`NFL players: ${nfl}`);
        console.log(`MLB players: ${mlb}`);
        console.log(`NHL players: ${nhl}`);
        console.log('============================');
      } catch (error) {
        console.error('Error loading player database:', error);
        setIsDbLoading(false);
      }
    };
    
    loadStats();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const findPlayerData = async (playerName: string): Promise<ESPNPlayer | undefined> => {
    console.log('Searching for player data:', playerName);
    try {
      await espnPlayerDB.loadAllPlayers();
      const searchResults = espnPlayerDB.searchPlayers(playerName, 1);
      if (searchResults.length > 0) {
        console.log('Found player:', searchResults[0]);
        return searchResults[0];
      }
      console.log('No player data found for:', playerName);
      return undefined;
    } catch (error) {
      console.error('Error finding player data:', error);
      return undefined;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      console.log('Form submit - searching for:', query.trim());
      const playerData = await findPlayerData(query.trim());
      const player = { 
        name: query.trim(), 
        playerData 
      };
      console.log('Form submit - calling onPlayerSelect with:', player);
      onPlayerSelect(player);
      if (onSearch) onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 0) {
      try {
        await espnPlayerDB.loadAllPlayers();
        // Get more results for better predictions
        const results = espnPlayerDB.searchPlayers(value, 10);
        setSearchResults(results);
        setShowSuggestions(true);
        console.log(`Found ${results.length} players matching "${value}":`, results.map(p => `${p.name} (${p.sport})`));
      } catch (error) {
        console.error('Error searching players:', error);
        setSearchResults([]);
        setShowSuggestions(false);
      }
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
  };

  const handlePlayerClick = async (player: ESPNPlayer) => {
    console.log('Player clicked:', player.name);
    
    setQuery(player.name);
    setShowSuggestions(false);
    
    const playerData = { 
      name: player.name, 
      playerData: player 
    };
    
    console.log('Player click - calling onPlayerSelect with:', playerData);
    onPlayerSelect(playerData);
    
    if (onSearch) {
      onSearch(player.name);
    }
  };

  const handleClear = () => {
    setQuery('');
    setShowSuggestions(false);
    setSearchResults([]);
    if (onClear) onClear();
    inputRef.current?.focus();
  };

  const handleRefreshCache = async () => {
    setIsDbLoading(true);
    setCacheStatus('loading');
    try {
      await espnPlayerDB.refreshPlayers();
      
      const total = espnPlayerDB.getPlayerCount();
      const nba = espnPlayerDB.getPlayersBySport('NBA').length;
      const nfl = espnPlayerDB.getPlayersBySport('NFL').length;
      const mlb = espnPlayerDB.getPlayersBySport('MLB').length;
      const nhl = espnPlayerDB.getPlayersBySport('NHL').length;
      
      setDbStats({ total, nba, nfl, mlb, nhl });
      setCacheStatus('fresh');
      console.log('Player database refreshed successfully');
    } catch (error) {
      console.error('Error refreshing player database:', error);
    } finally {
      setIsDbLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search players by name (e.g., LeBron, Mahomes, McDavid)"
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              if (query.length > 0 && searchResults.length > 0) {
                setShowSuggestions(true);
              }
            }}
            className="pl-10 pr-10 py-3 bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            disabled={isLoading || isDbLoading}
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {showSuggestions && searchResults.length > 0 && (
        <Card 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border-slate-600 z-50 shadow-xl max-h-80 overflow-y-auto"
        >
          <div className="py-2">
            {searchResults.map((player, index) => (
              <button
                key={`${player.id}_${index}`}
                type="button"
                onClick={() => handlePlayerClick(player)}
                className="w-full px-4 py-3 text-left text-white hover:bg-slate-700 transition-colors focus:outline-none focus:bg-slate-700 flex items-center gap-3 group"
              >
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarImage 
                    src={player.headshot} 
                    alt={player.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-slate-600 text-slate-300 text-sm font-medium">
                    {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium truncate">{player.name}</span>
                      {player.position && (
                        <span className="text-xs text-slate-400">
                          {player.position}
                        </span>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <div className="text-sm text-slate-300">{player.sport}</div>
                      <div className="text-xs text-slate-400 truncate max-w-24">{player.team}</div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      <div className="mt-2 text-center">
        <p className="text-xs text-slate-400">
          Multi-sport analysis • Team + fantasy subreddits • Major sport communities • Cross-platform sentiment • 200+ sports communities analyzed
        </p>
        
        <div className="flex items-center justify-center gap-2 mt-1">
          {dbStats && (
            <p className="text-xs text-slate-500">
              Database: {dbStats.total} players ({dbStats.nba} NBA, {dbStats.nfl} NFL, {dbStats.mlb} MLB, {dbStats.nhl} NHL)
              {cacheStatus === 'cached' && ' • Loaded from cache'}
              {cacheStatus === 'fresh' && ' • Fresh data'}
            </p>
          )}
          
          {isDbLoading && (
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Loading players...
            </div>
          )}
          
          {!isDbLoading && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefreshCache}
              className="text-xs text-slate-500 hover:text-slate-300 h-auto py-0 px-2"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Refresh
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerSearchBox;
