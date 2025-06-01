
import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
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
  const inputRef = useRef<HTMLInputElement>(null);
  
  const suggestions = [
    'LeBron James', 'Patrick Mahomes', 'Connor McDavid', 'Aaron Judge',
    'Stephen Curry', 'Josh Allen', 'Nathan MacKinnon', 'Mookie Betts',
    'Giannis Antetokounmpo', 'Travis Kelce', 'Leon Draisaitl', 'Shohei Ohtani'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const findPlayerData = async (playerName: string): Promise<ESPNPlayer | undefined> => {
    console.log('Searching for player data:', playerName);
    try {
      // Ensure the database is loaded first
      await espnPlayerDB.loadAllPlayers();
      
      // Use the searchPlayers method which exists
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
      const playerData = await findPlayerData(query.trim());
      const player = { 
        name: query.trim(), 
        playerData 
      };
      console.log('Submitting player:', player);
      onPlayerSelect(player);
      if (onSearch) onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setQuery(suggestion);
    const playerData = await findPlayerData(suggestion);
    const player = { 
      name: suggestion, 
      playerData 
    };
    console.log('Selected suggestion player:', player);
    onPlayerSelect(player);
    if (onSearch) onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setQuery('');
    setShowSuggestions(false);
    if (onClear) onClear();
    inputRef.current?.focus();
  };

  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(query.toLowerCase()) && s.toLowerCase() !== query.toLowerCase()
  );

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search players, try nicknames"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(query.length > 0)}
            className="pl-10 pr-10 py-3 bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            disabled={isLoading}
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

      {showSuggestions && filteredSuggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border-slate-600 z-50 shadow-xl">
          <div className="py-2">
            {filteredSuggestions.slice(0, 6).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2 text-left text-white hover:bg-slate-700 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </Card>
      )}

      <div className="mt-2 text-center">
        <p className="text-xs text-slate-400">
          Multi-sport analysis • Team + fantasy subreddits • Major sport communities • Cross-platform sentiment • 200+ sports communities analyzed
        </p>
      </div>
    </div>
  );
};

export default PlayerSearchBox;
