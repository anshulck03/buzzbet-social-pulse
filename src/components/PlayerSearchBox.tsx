
import React, { useState, useRef, useEffect } from 'react';
import { Search, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const PlayerSearchBox = ({ onPlayerSelect, value }) => {
  const [searchTerm, setSearchTerm] = useState(value?.name || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches] = useState([
    'LeBron James', 'Stephen Curry', 'Luka Dončić', 'Jayson Tatum'
  ]);
  
  // Mock NBA players data
  const players = [
    { id: 1, name: 'LeBron James', team: 'Lakers', position: 'SF' },
    { id: 2, name: 'Stephen Curry', team: 'Warriors', position: 'PG' },
    { id: 3, name: 'Luka Dončić', team: 'Mavericks', position: 'PG' },
    { id: 4, name: 'Jayson Tatum', team: 'Celtics', position: 'SF' },
    { id: 5, name: 'Nikola Jokić', team: 'Nuggets', position: 'C' },
    { id: 6, name: 'Giannis Antetokounmpo', team: 'Bucks', position: 'PF' },
    { id: 7, name: 'Kevin Durant', team: 'Suns', position: 'SF' },
    { id: 8, name: 'Damian Lillard', team: 'Bucks', position: 'PG' },
  ];

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePlayerClick = (player) => {
    setSearchTerm(player.name);
    setShowSuggestions(false);
    onPlayerSelect(player);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  return (
    <div className="relative" ref={inputRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          type="text"
          placeholder="Search NBA players..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="pl-12 pr-4 py-4 text-lg bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {showSuggestions && (
        <Card className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border-slate-600 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {searchTerm === '' && (
              <div className="p-4 border-b border-slate-700">
                <p className="text-sm text-slate-400 mb-3 flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  Recent Searches
                </p>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchTerm(search);
                      const player = players.find(p => p.name === search);
                      if (player) handlePlayerClick(player);
                    }}
                    className="block w-full text-left px-2 py-2 text-slate-300 hover:bg-slate-700 rounded text-sm"
                  >
                    {search}
                  </button>
                ))}
              </div>
            )}
            
            {filteredPlayers.length > 0 ? (
              <div className="p-2">
                {filteredPlayers.map((player) => (
                  <button
                    key={player.id}
                    onClick={() => handlePlayerClick(player)}
                    className="w-full flex items-center justify-between p-3 hover:bg-slate-700 rounded text-left"
                  >
                    <div>
                      <p className="text-white font-medium">{player.name}</p>
                      <p className="text-sm text-slate-400">{player.team} • {player.position}</p>
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </button>
                ))}
              </div>
            ) : searchTerm !== '' ? (
              <div className="p-4 text-center text-slate-400">
                No players found for "{searchTerm}"
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlayerSearchBox;
