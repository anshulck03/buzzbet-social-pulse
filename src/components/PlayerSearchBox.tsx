
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
  const [searchResults, setSearchResults] = useState<ESPNPlayer[]>([]);
  const [dbStats, setDbStats] = useState<{total: number, nba: number, nfl: number, mlb: number, nhl: number} | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const suggestions = [
    'LeBron James', 'Patrick Mahomes', 'Connor McDavid', 'Aaron Judge',
    'Stephen Curry', 'Josh Allen', 'Nathan MacKinnon', 'Mookie Betts',
    'Giannis Antetokounmpo', 'Travis Kelce', 'Leon Draisaitl', 'Shohei Ohtani'
  ];

  // Load database stats on component mount
  useEffect(() => {
    const loadStats = async () => {
      try {
        console.log('Loading player database...');
        await espnPlayerDB.loadAllPlayers();
        
        const total = espnPlayerDB.getPlayerCount();
        const nba = espnPlayerDB.getPlayersBySport('NBA').length;
        const nfl = espnPlayerDB.getPlayersBySport('NFL').length;
        const mlb = espnPlayerDB.getPlayersBySport('MLB').length;
        const nhl = espnPlayerDB.getPlayersBySport('NHL').length;
        
        setDbStats({ total, nba, nfl, mlb, nhl });
        
        console.log('=== PLAYER DATABASE STATS ===');
        console.log(`Total players: ${total}`);
        console.log(`NBA players: ${nba}`);
        console.log(`NFL players: ${nfl}`);
        console.log(`MLB players: ${mlb}`);
        console.log(`NHL players: ${nhl}`);
        console.log('============================');
      } catch (error) {
        console.error('Error loading player database:', error);
      }
    };
    
    loadStats();
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
    
    if (value.length > 1) {
      // Search database for matching players
      try {
        await espnPlayerDB.loadAllPlayers();
        const results = espnPlayerDB.searchPlayers(value, 8);
        setSearchResults(results);
        setShowSuggestions(true);
        console.log(`Found ${results.length} players matching "${value}":`, results.map(p => `${p.name} (${p.sport})`));
      } catch (error) {
        console.error('Error searching players:', error);
        setSearchResults([]);
        setShowSuggestions(value.length > 0);
      }
    } else {
      setSearchResults([]);
      setShowSuggestions(value.length > 0);
    }
  };

  const handleSuggestionClick = async (e: React.MouseEvent, suggestion: string) => {
    // Prevent event bubbling and default behavior
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Suggestion clicked:', suggestion);
    console.log('Event prevented and stopped');
    
    // Update UI immediately
    setQuery(suggestion);
    setShowSuggestions(false);
    
    try {
      // Find player data
      console.log('Finding player data for suggestion:', suggestion);
      const playerData = await findPlayerData(suggestion);
      
      const player = { 
        name: suggestion, 
        playerData 
      };
      
      console.log('Suggestion - calling onPlayerSelect with:', player);
      
      // Call onPlayerSelect immediately
      onPlayerSelect(player);
      
      // Also call onSearch if provided
      if (onSearch) {
        console.log('Also calling onSearch');
        onSearch(suggestion);
      }
      
      console.log('Suggestion processing complete');
    } catch (error) {
      console.error('Error in suggestion click:', error);
    }
  };

  const handlePlayerClick = async (e: React.MouseEvent, player: ESPNPlayer) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(query.toLowerCase()) && s.toLowerCase() !== query.toLowerCase()
  );

  // Combine database results and fallback suggestions
  const combinedSuggestions = [
    ...searchResults,
    ...filteredSuggestions.map(name => ({ 
      id: `suggestion_${name}`, 
      name, 
      firstName: name.split(' ')[0],
      lastName: name.split(' ').slice(1).join(' '),
      team: 'Various', 
      teamAbbr: '', 
      position: '', 
      sport: 'NBA' as const, 
      headshot: '', 
      searchTerms: [name.toLowerCase()] 
    }))
  ].slice(0, 8);

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

      {showSuggestions && combinedSuggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border-slate-600 z-50 shadow-xl">
          <div className="py-2">
            {combinedSuggestions.map((suggestion, index) => (
              <button
                key={suggestion.id || index}
                type="button"
                onMouseDown={(e) => suggestion.id?.startsWith('suggestion_') 
                  ? handleSuggestionClick(e, suggestion.name)
                  : handlePlayerClick(e, suggestion)
                }
                className="w-full px-4 py-2 text-left text-white hover:bg-slate-700 transition-colors focus:outline-none focus:bg-slate-700 flex justify-between items-center"
              >
                <span>{suggestion.name}</span>
                {suggestion.sport && suggestion.team && !suggestion.id?.startsWith('suggestion_') && (
                  <span className="text-xs text-slate-400">
                    {suggestion.sport} • {suggestion.team}
                  </span>
                )}
              </button>
            ))}
          </div>
        </Card>
      )}

      <div className="mt-2 text-center">
        <p className="text-xs text-slate-400">
          Multi-sport analysis • Team + fantasy subreddits • Major sport communities • Cross-platform sentiment • 200+ sports communities analyzed
        </p>
        {dbStats && (
          <p className="text-xs text-slate-500 mt-1">
            Database: {dbStats.total} players ({dbStats.nba} NBA, {dbStats.nfl} NFL, {dbStats.mlb} MLB, {dbStats.nhl} NHL)
          </p>
        )}
      </div>
    </div>
  );
};

export default PlayerSearchBox;
