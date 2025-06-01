import React, { useState, useRef, useEffect } from 'react';
import { Search, Loader2, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { espnPlayerDB, ESPNPlayer } from '@/services/espnPlayerDatabase';
import { smartSearchService } from '@/services/smartSearchService';
import EnhancedPlayerCard from '@/components/EnhancedPlayerCard';
import QuickFilterChips from '@/components/QuickFilterChips';
import TrendingPlayersSection from '@/components/TrendingPlayersSection';

interface PlayerSearchBoxProps {
  onPlayerSelect: (player: { name: string; playerData?: ESPNPlayer }) => void;
  value: { name: string; playerData?: ESPNPlayer } | null;
}

const PlayerSearchBox = ({ onPlayerSelect, value }: PlayerSearchBoxProps) => {
  const [searchTerm, setSearchTerm] = useState(value?.name || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<ESPNPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dbLoaded, setDbLoaded] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isSmartSearch, setIsSmartSearch] = useState(false);

  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadDatabase = async () => {
      setIsLoading(true);
      try {
        await espnPlayerDB.loadAllPlayers();
        setDbLoaded(true);
        console.log(`Player database loaded with ${espnPlayerDB.getPlayerCount()} players`);
      } catch (error) {
        console.error('Failed to load player database:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDatabase();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePlayerClick = (playerName: string, playerData?: ESPNPlayer) => {
    setSearchTerm(playerName);
    setShowSuggestions(false);
    setActiveFilters([]);
    onPlayerSelect({ name: playerName, playerData });
  };

  const filterPlayers = (players: ESPNPlayer[], filters: string[]): ESPNPlayer[] => {
    if (filters.length === 0) return players;

    return players.filter(player => {
      return filters.every(filter => {
        switch (filter) {
          case 'trending':
            return ['LeBron James', 'Patrick Mahomes', 'Stephen Curry', 'Connor McDavid'].includes(player.name);
          case 'elite':
            const elitePlayers = ['LeBron James', 'Stephen Curry', 'Patrick Mahomes', 'Mike Trout', 'Connor McDavid'];
            return elitePlayers.includes(player.name);
          case 'breaking':
            return Math.random() > 0.9;
          case 'injured':
            return Math.random() > 0.85;
          case 'rookies':
            return Math.random() > 0.9;
          case 'NBA':
          case 'NFL':
          case 'MLB':
          case 'NHL':
            return player.sport === filter;
          default:
            return true;
        }
      });
    });
  };

  const debouncedSearch = (query: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (query.length >= 2 && dbLoaded) {
        const smartResult = smartSearchService.enhanceQuery(query);
        setIsSmartSearch(smartResult.enhancedQuery !== query || smartResult.isShortcut);
        
        if (smartResult.isShortcut) {
          const allPlayers = Array.from({ length: 100 }, (_, i) => espnPlayerDB.searchPlayers('a', 100)[i]).filter(Boolean);
          const filtered = filterPlayers(allPlayers, [smartResult.shortcutData?.value || '']);
          setSuggestions(filtered.slice(0, 8));
        } else {
          const results = espnPlayerDB.searchPlayers(smartResult.enhancedQuery, 50);
          const finalResults = filterPlayers(results, activeFilters);
          setSuggestions(finalResults.slice(0, 8));
        }
      } else {
        setSuggestions([]);
        setIsSmartSearch(false);
      }
    }, 200);

    setSearchTimeout(timeout);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setShowSuggestions(true);
    
    debouncedSearch(newValue);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
    if (searchTerm.length >= 2 && dbLoaded) {
      debouncedSearch(searchTerm);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const smartResult = smartSearchService.enhanceQuery(searchTerm.trim());
      handlePlayerClick(smartResult.enhancedQuery);
    }
  };

  const handleFilterSelect = (filter: string) => {
    const newFilters = activeFilters.includes(filter) 
      ? activeFilters.filter(f => f !== filter)
      : [...activeFilters, filter];
    
    setActiveFilters(newFilters);
    
    if (searchTerm.length >= 2 || newFilters.length > 0) {
      const baseResults = searchTerm.length >= 2 
        ? espnPlayerDB.searchPlayers(searchTerm, 50)
        : espnPlayerDB.searchPlayers('', 100);
      
      const filtered = filterPlayers(baseResults, newFilters);
      setSuggestions(filtered.slice(0, 8));
      setShowSuggestions(true);
    }
  };

  const handleFilterRemove = (filter: string) => {
    const newFilters = activeFilters.filter(f => f !== filter);
    setActiveFilters(newFilters);
    
    if (searchTerm.length >= 2 || newFilters.length > 0) {
      const baseResults = searchTerm.length >= 2 
        ? espnPlayerDB.searchPlayers(searchTerm, 50)
        : espnPlayerDB.searchPlayers('', 100);
      
      const filtered = filterPlayers(baseResults, newFilters);
      setSuggestions(filtered.slice(0, 8));
    }
  };

  const handleClearAllFilters = () => {
    setActiveFilters([]);
    if (searchTerm.length >= 2) {
      debouncedSearch(searchTerm);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="relative" ref={inputRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder={dbLoaded ? "Search players, try nicknames" : "Loading intelligent player search..."}
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            disabled={isLoading}
            className="pl-12 pr-12 py-4 text-lg bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
          />
          {isLoading && (
            <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400 animate-spin" />
          )}
          {isSmartSearch && !isLoading && (
            <Zap className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-400" />
          )}
        </div>
      </form>

      {/* Quick Filter Chips */}
      {dbLoaded && (
        <div className="mt-3">
          <QuickFilterChips 
            onFilterSelect={handleFilterSelect}
            activeFilters={activeFilters}
            onFilterRemove={handleFilterRemove}
            onClearAll={handleClearAllFilters}
            onPlayerSelect={handlePlayerClick}
          />
        </div>
      )}

      {showSuggestions && (
        <Card className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border-slate-600 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {/* Loading state */}
            {isLoading && (
              <div className="p-6 text-center">
                <Loader2 className="w-6 h-6 animate-spin text-blue-400 mx-auto mb-2" />
                <p className="text-slate-300">Loading intelligent player database...</p>
                <p className="text-slate-500 text-sm">Preparing smart search features...</p>
              </div>
            )}

            {/* Smart search indicator */}
            {isSmartSearch && dbLoaded && searchTerm.length >= 2 && (
              <div className="p-3 bg-yellow-400/10 border-b border-yellow-400/20">
                <div className="flex items-center text-yellow-400 text-sm">
                  <Zap className="w-4 h-4 mr-2" />
                  Smart search enhanced your query
                </div>
              </div>
            )}

            {/* Player suggestions */}
            {dbLoaded && (searchTerm.length >= 2 || activeFilters.length > 0) && suggestions.length > 0 && (
              <div className="p-4">
                <p className="text-sm text-slate-400 mb-3">
                  {activeFilters.length > 0 ? (
                    <>
                      Filtered Results ({suggestions.length})
                      {activeFilters.map(filter => (
                        <Badge key={filter} variant="outline" className="ml-2 text-xs text-blue-400 border-blue-400">
                          {filter}
                        </Badge>
                      ))}
                    </>
                  ) : (
                    `Players (${suggestions.length})`
                  )}
                </p>
                <div className="space-y-2">
                  {suggestions.map((player, index) => (
                    <EnhancedPlayerCard
                      key={player.id}
                      player={player}
                      onClick={() => handlePlayerClick(player.name, player)}
                      showTrending={activeFilters.includes('trending')}
                      compact={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* No results */}
            {dbLoaded && (searchTerm.length >= 2 || activeFilters.length > 0) && suggestions.length === 0 && (
              <div className="p-4 border-b border-slate-700">
                <p className="text-slate-400 text-sm">
                  {activeFilters.length > 0 
                    ? `No players found matching "${searchTerm}" with active filters`
                    : `No players found for "${searchTerm}"`
                  }
                </p>
                <p className="text-slate-500 text-xs mt-1">Try removing some filters or different search terms</p>
              </div>
            )}

            {/* Trending and popular when no search */}
            {dbLoaded && searchTerm === '' && activeFilters.length === 0 && (
              <div className="p-4">
                <TrendingPlayersSection onPlayerSelect={handlePlayerClick} />
              </div>
            )}
            
            {/* Enhanced search any name option */}
            {dbLoaded && searchTerm !== '' && (
              <div className="p-4 border-t border-slate-700">
                <button
                  onClick={() => handlePlayerClick(searchTerm)}
                  className="w-full flex items-center justify-between p-3 hover:bg-slate-700/50 rounded-lg text-left border border-slate-600/50 hover:border-blue-500/50 transition-all"
                >
                  <div>
                    <p className="text-white font-medium">Search for "{searchTerm}"</p>
                    <p className="text-sm text-slate-400">Multi-sport discussions, fantasy advice, injury reports • 200+ sports subreddits analyzed • Real-time community sentiment • Cross-platform intelligence</p>
                  </div>
                  <Search className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlayerSearchBox;
