import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, AlertTriangle, Activity, Users, Eye, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PlayerSearchBox from '@/components/PlayerSearchBox';
import SentimentDashboard from '@/components/SentimentDashboard';
import InsightFeed from '@/components/InsightFeed';
import TrendingSection from '@/components/TrendingSection';
import { Player } from '@/data/playersDatabase';

const Index = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<{ name: string; playerData?: Player } | null>(null);
  const [searchResults, setSearchResults] = useState(false);

  const handlePlayerSelect = (player: { name: string; playerData?: Player }) => {
    setSelectedPlayer(player);
    setSearchResults(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  SentiBet
                </h1>
                <p className="text-xs text-slate-400">Reddit Sports Intelligence</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-orange-400 border-orange-400">
                <MessageCircle className="w-3 h-3 mr-2" />
                Reddit Only
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {!searchResults ? (
          // Landing Page
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Reddit Intelligence for Smart Bettors
              </h2>
              <p className="text-xl text-slate-400 mb-8">
                Uncover betting insights from NBA Reddit discussions before the market catches on
              </p>
              
              <div className="max-w-2xl mx-auto">
                <PlayerSearchBox onPlayerSelect={handlePlayerSelect} value={null} />
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Data Source</p>
                      <p className="text-2xl font-bold text-white">Reddit</p>
                    </div>
                    <MessageCircle className="w-8 h-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Subreddits</p>
                      <p className="text-2xl font-bold text-white">2</p>
                    </div>
                    <Activity className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Update Frequency</p>
                      <p className="text-2xl font-bold text-white">Real-time</p>
                    </div>
                    <Eye className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <TrendingSection />
          </div>
        ) : (
          // Search Results Page
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Reddit Intelligence Report</h3>
                <p className="text-slate-400">Analyzing r/nba and r/fantasybball discussions • Last updated: {new Date().toLocaleTimeString()}</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSearchResults(false)}
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                New Search
              </Button>
            </div>

            <PlayerSearchBox onPlayerSelect={handlePlayerSelect} value={selectedPlayer} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SentimentDashboard player={selectedPlayer} />
              </div>
              <div>
                <InsightFeed player={selectedPlayer} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
