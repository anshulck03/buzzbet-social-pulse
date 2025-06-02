import React, { useState } from 'react';
import Header from '@/components/Header';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import GameInfoCard from '@/components/GameInfoCard';

const Index = () => {
  const [searchText, setSearchText] = useState('');
  const [player, setPlayer] = useState<{ name: string; playerData?: any } | null>(null);
  const debouncedSearchText = useDebounce(searchText, 500);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  // Mocked function to simulate player search
  const searchPlayer = async (name: string) => {
    // In a real application, this would be an API call
    console.log(`Searching for player: ${name}`);
    
    // Mocked data for demonstration
    if (name.toLowerCase() === 'lebron james') {
      return { name: 'LeBron James', playerData: { team: 'Lakers', sport: 'NBA' } };
    } else if (name.toLowerCase() === 'kevin durant') {
      return { name: 'Kevin Durant', playerData: { team: 'Suns', sport: 'NBA' } };
    } else if (name.toLowerCase() === 'patrick mahomes') {
      return { name: 'Patrick Mahomes', playerData: { team: 'Chiefs', sport: 'NFL' } };
    } else if (name.toLowerCase() === 'lionel messi') {
      return { name: 'Lionel Messi', playerData: { team: 'Inter Miami', sport: 'MLS' } };
    }
    
    return null;
  };

  React.useEffect(() => {
    if (debouncedSearchText) {
      searchPlayer(debouncedSearchText)
        .then(playerData => {
          setPlayer(playerData || null);
        });
    } else {
      setPlayer(null);
    }
  }, [debouncedSearchText]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <div className="container mx-auto p-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="search">
            <Search className="mr-2 h-4 w-4" />
          </Label>
          <Input
            type="search"
            id="search"
            placeholder="Search for a player..."
            value={searchText}
            onChange={handleSearch}
          />
          <Button variant="outline" size="sm">
            Search
          </Button>
        </div>

        {player && (
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-white mb-2">
              {player.name}
            </h2>
            <GameInfoCard player={player} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
