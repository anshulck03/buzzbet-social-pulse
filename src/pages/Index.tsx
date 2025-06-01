import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, AlertTriangle, Activity, Users, Eye, MessageCircle, Brain, Hash, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PlayerSearchBox from '@/components/PlayerSearchBox';
import SentimentDashboard from '@/components/SentimentDashboard';
import InsightFeed from '@/components/InsightFeed';
import TrendingSection from '@/components/TrendingSection';
import QuickFilterChips from '@/components/QuickFilterChips';
import { Player } from '@/data/playersDatabase';
import { ESPNPlayer } from '@/services/espnPlayerDatabase';

const Index = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<{ name: string; playerData?: ESPNPlayer } | null>(null);
  const [showPlayerPage, setShowPlayerPage] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handlePlayerSelect = (player: { name: string; playerData?: ESPNPlayer }) => {
    console.log('Player selected in Index:', player);
    setSelectedPlayer(player);
    setShowPlayerPage(true);
    console.log('State after player select - showPlayerPage should be true');
  };

  const handleFilterSelect = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const handleFilterRemove = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  const handleClearAllFilters = () => {
    setActiveFilters([]);
  };

  const handleQuickPlayerSelect = (playerName: string) => {
    console.log('Quick player select:', playerName);
    const player = { name: playerName };
    handlePlayerSelect(player);
  };

  const handleNewSearch = () => {
    console.log('Handling new search - resetting state');
    setShowPlayerPage(false);
    setSelectedPlayer(null);
  };

  console.log('Current state - showPlayerPage:', showPlayerPage, 'selectedPlayer:', selectedPlayer);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* New AI Brain Logo */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-emerald-400/20 rounded-xl border border-cyan-400/30 backdrop-blur-sm"></div>
                <svg className="w-8 h-8 relative z-10" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <path d="M30 25 C20 25, 15 35, 15 45 C15 55, 20 65, 30 65 L35 65 C35 70, 40 75, 45 75 L55 75 C60 75, 65 70, 65 65 L70 65 C80 65, 85 55, 85 45 C85 35, 80 25, 70 25 L65 25 C65 20, 60 15, 55 15 L45 15 C40 15, 35 20, 35 25 Z" 
                        fill="url(#brainGradient)" 
                        stroke="rgba(6, 182, 212, 0.8)" 
                        strokeWidth="1"/>
                  <circle cx="40" cy="40" r="2" fill="#06b6d4"/>
                  <circle cx="60" cy="40" r="2" fill="#10b981"/>
                  <circle cx="50" cy="55" r="2" fill="#06b6d4"/>
                  <defs>
                    <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(6, 182, 212, 0.3)" />
                      <stop offset="100%" stopColor="rgba(16, 185, 129, 0.3)" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  SentiBet
                </h1>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Sports Intelligence</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-cyan-400 border-cyan-400/50 bg-cyan-400/10">
                <Brain className="w-3 h-3 mr-2" />
                AI-Powered
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {!showPlayerPage ? (
          // Landing Page
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-200 to-emerald-200 bg-clip-text text-transparent">
                AI-Powered Multi-Sport Intelligence
              </h2>
              <p className="text-xl text-slate-400 mb-8">
                Comprehensive sports intelligence across NBA, NFL, NHL, and MLB with AI-powered subreddit discovery
              </p>
              
              <div className="max-w-2xl mx-auto mb-6">
                <PlayerSearchBox onPlayerSelect={handlePlayerSelect} value={null} />
              </div>

              <QuickFilterChips
                onFilterSelect={handleFilterSelect}
                activeFilters={activeFilters}
                onFilterRemove={handleFilterRemove}
                onClearAll={handleClearAllFilters}
                onPlayerSelect={handleQuickPlayerSelect}
              />
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/40 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Intelligence Engine</p>
                      <p className="text-2xl font-bold text-white">DeepSeek AI</p>
                    </div>
                    <Brain className="w-8 h-8 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/40 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Subreddit Discovery</p>
                      <p className="text-2xl font-bold text-white">200+</p>
                    </div>
                    <Hash className="w-8 h-8 text-emerald-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/40 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Sports Covered</p>
                      <p className="text-2xl font-bold text-white">4 Major</p>
                    </div>
                    <Trophy className="w-8 h-8 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sports Coverage */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <Card className="bg-slate-800/30 border-slate-700/50 hover:border-orange-400/50 hover:bg-orange-400/5 transition-all backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 border border-orange-400/30">
                    <span className="text-orange-400 font-bold text-lg">NBA</span>
                  </div>
                  <p className="text-slate-300 text-sm">Basketball Intelligence</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/30 border-slate-700/50 hover:border-emerald-400/50 hover:bg-emerald-400/5 transition-all backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 border border-emerald-400/30">
                    <span className="text-emerald-400 font-bold text-lg">NFL</span>
                  </div>
                  <p className="text-slate-300 text-sm">Football Intelligence</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/30 border-slate-700/50 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 border border-cyan-400/30">
                    <span className="text-cyan-400 font-bold text-lg">NHL</span>
                  </div>
                  <p className="text-slate-300 text-sm">Hockey Intelligence</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/30 border-slate-700/50 hover:border-red-400/50 hover:bg-red-400/5 transition-all backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 border border-red-400/30">
                    <span className="text-red-400 font-bold text-lg">MLB</span>
                  </div>
                  <p className="text-slate-300 text-sm">Baseball Intelligence</p>
                </CardContent>
              </Card>
            </div>

            <TrendingSection />
          </div>
        ) : (
          // Player Information Page
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent mb-2">Sports Intelligence Report</h3>
                <p className="text-slate-400">AI-powered analysis across 200+ sports subreddits • Last updated: {new Date().toLocaleTimeString()}</p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleNewSearch}
                className="border-slate-600/50 text-slate-300 hover:bg-slate-800/50 hover:border-cyan-400/50 hover:text-cyan-300 transition-all backdrop-blur-sm"
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
