
import React, { useState, useRef, useEffect } from 'react';
import { Search, Star, User, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { espnPlayerDB, ESPNPlayer } from '@/services/espnPlayerDatabase';

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
  
  const [recentSearches] = useState([
    'LeBron James', 'Patrick Mahomes', 'Aaron Judge', 'Stephen Curry', 'Josh Allen', 'Mike Trout'
  ]);

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
    onPlayerSelect({ name: playerName, playerData });
  };

  const debouncedSearch = (query: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (query.length >= 2 && dbLoaded) {
        const results = espnPlayerDB.searchPlayers(query, 8);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    }, 300);

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
      handlePlayerClick(searchTerm.trim());
    }
  };

  const getSportColor = (sport: string) => {
    switch (sport) {
      case 'NBA': return 'text-orange-400 border-orange-400';
      case 'NFL': return 'text-green-400 border-green-400';
      case 'MLB': return 'text-blue-400 border-blue-400';
      case 'NHL': return 'text-purple-400 border-purple-400';
      default: return 'text-slate-400 border-slate-400';
    }
  };

  return (
    <div className="relative" ref={inputRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder={dbLoaded ? "Search any NBA, NFL, MLB, or NHL player..." : "Loading player database..."}
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            disabled={isLoading}
            className="pl-12 pr-4 py-4 text-lg bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
          />
          {isLoading && (
            <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400 animate-spin" />
          )}
        </div>
      </form>

      {showSuggestions && (
        <Card className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border-slate-600 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {/* Loading state */}
            {isLoading && (
              <div className="p-6 text-center">
                <Loader2 className="w-6 h-6 animate-spin text-blue-400 mx-auto mb-2" />
                <p className="text-slate-300">Loading player database...</p>
                <p className="text-slate-500 text-sm">Fetching players from ESPN...</p>
              </div>
            )}

            {/* Database load error */}
            {!isLoading && !dbLoaded && (
              <div className="p-6 text-center">
                <p className="text-red-300 mb-2">Failed to load player database</p>
                <p className="text-slate-500 text-sm">You can still search manually</p>
              </div>
            )}

            {/* Autocomplete suggestions */}
            {dbLoaded && searchTerm.length >= 2 && suggestions.length > 0 && (
              <div className="p-4 border-b border-slate-700">
                <p className="text-sm text-slate-400 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Player Suggestions ({suggestions.length})
                </p>
                {suggestions.map((player, index) => (
                  <button
                    key={player.id}
                    onClick={() => handlePlayerClick(player.name, player)}
                    className="block w-full text-left p-3 hover:bg-slate-700 rounded mb-2 border border-slate-600"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={player.headshot} alt={player.name} />
                          <AvatarFallback className="bg-slate-700 text-slate-300 text-xs">
                            {player.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium">{player.name}</p>
                          <p className="text-sm text-slate-400">
                            {player.position} • {player.team}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`text-xs ${getSportColor(player.sport)}`}>
                        {player.sport}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No results */}
            {dbLoaded && searchTerm.length >= 2 && suggestions.length === 0 && (
              <div className="p-4 border-b border-slate-700">
                <p className="text-slate-400 text-sm">No players found for "{searchTerm}"</p>
              </div>
            )}

            {/* Recent searches when no input */}
            {dbLoaded && searchTerm === '' && (
              <div className="p-4">
                <p className="text-sm text-slate-400 mb-3 flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  Try Searching For
                </p>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handlePlayerClick(search)}
                    className="block w-full text-left px-2 py-2 text-slate-300 hover:bg-slate-700 rounded text-sm"
                  >
                    {search}
                  </button>
                ))}
                <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
                  <p className="text-xs text-slate-500">
                    💡 Database includes {espnPlayerDB.getPlayerCount().toLocaleString()} active players from NBA, NFL, MLB, and NHL
                  </p>
                </div>
              </div>
            )}
            
            {/* Search any name option */}
            {dbLoaded && searchTerm !== '' && (
              <div className="p-4">
                <button
                  onClick={() => handlePlayerClick(searchTerm)}
                  className="w-full flex items-center justify-between p-3 hover:bg-slate-700 rounded text-left border border-slate-600"
                >
                  <div>
                    <p className="text-white font-medium">Search for "{searchTerm}"</p>
                    <p className="text-sm text-slate-400">Press Enter or click to search</p>
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
