
import React, { useState, useRef, useEffect } from 'react';
import { Search, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const PlayerSearchBox = ({ onPlayerSelect, value }) => {
  const [searchTerm, setSearchTerm] = useState(value?.name || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches] = useState([
    'LeBron James', 'Tom Brady', 'Aaron Judge', 'Stephen Curry', 'Patrick Mahomes', 'Mookie Betts'
  ]);

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

  const handlePlayerClick = (playerName) => {
    setSearchTerm(playerName);
    setShowSuggestions(false);
    // Create a generic player object for any name
    onPlayerSelect({ name: playerName });
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      handlePlayerClick(searchTerm.trim());
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
                    💡 Tip: You can search for any professional athlete from NBA, NFL, or MLB
                  </p>
                </div>
              </div>
            )}
            
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
