
import React, { useState, useRef, useEffect } from 'react';
import { Search, Star, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { searchPlayers, Player } from '@/data/playersDatabase';

interface PlayerSearchBoxProps {
  onPlayerSelect: (player: { name: string; playerData?: Player }) => void;
  value: { name: string; playerData?: Player } | null;
}

const PlayerSearchBox = ({ onPlayerSelect, value }: PlayerSearchBoxProps) => {
  const [searchTerm, setSearchTerm] = useState(value?.name || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Player[]>([]);
  const [recentSearches] = useState([
    'LeBron James', 'Patrick Mahomes', 'Aaron Judge', 'Stephen Curry', 'Josh Allen', 'Mike Trout'
  ]);

  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePlayerClick = (playerName: string, playerData?: Player) => {
    setSearchTerm(playerName);
    setShowSuggestions(false);
    onPlayerSelect({ name: playerName, playerData });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setShowSuggestions(true);
    
    if (newValue.length >= 2) {
      const results = searchPlayers(newValue);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
    if (searchTerm.length >= 2) {
      const results = searchPlayers(searchTerm);
      setSuggestions(results);
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
            placeholder="Search any NBA, NFL, or MLB player..."
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className="pl-12 pr-4 py-4 text-lg bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </form>

      {showSuggestions && (
        <Card className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border-slate-600 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {/* Autocomplete suggestions */}
            {searchTerm.length >= 2 && suggestions.length > 0 && (
              <div className="p-4 border-b border-slate-700">
                <p className="text-sm text-slate-400 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Player Suggestions
                </p>
                {suggestions.map((player, index) => (
                  <button
                    key={index}
                    onClick={() => handlePlayerClick(player.name, player)}
                    className="block w-full text-left p-3 hover:bg-slate-700 rounded mb-2 border border-slate-600"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{player.name}</p>
                        <p className="text-sm text-slate-400">
                          {player.position} • {player.team}
                        </p>
                      </div>
                      <Badge variant="outline" className={`text-xs ${getSportColor(player.sport)}`}>
                        {player.sport}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Recent searches when no input */}
            {searchTerm === '' && (
              <div className="p-4">
                <p className="text-sm text-slate-400 mb-3 flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  Recent Searches
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
                    💡 Tip: Start typing any player name for autocomplete suggestions
                  </p>
                </div>
              </div>
            )}
            
            {/* Search any name option */}
            {searchTerm !== '' && (
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
