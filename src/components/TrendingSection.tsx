
import React from 'react';
import { TrendingUp, TrendingDown, Flame, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TrendingSection = () => {
  const trendingPlayers = [
    {
      name: 'LeBron James',
      team: 'Lakers',
      sentiment: 8.1,
      change: +0.7,
      reason: 'Triple-double performance',
      mentions: 2847
    },
    {
      name: 'Stephen Curry',
      team: 'Warriors',
      sentiment: 7.3,
      change: +0.2,
      reason: 'Clutch 3-pointers',
      mentions: 1923
    },
    {
      name: 'Luka Dončić',
      team: 'Mavericks',
      sentiment: 5.8,
      change: -1.2,
      reason: 'Injury concerns',
      mentions: 1456
    },
    {
      name: 'Jayson Tatum',
      team: 'Celtics',
      sentiment: 6.9,
      change: +0.4,
      reason: 'All-Star discussions',
      mentions: 1234
    }
  ];

  const hotTopics = [
    'Trade deadline rumors',
    'Injury reports',
    'MVP race discussions',
    'Playoff seeding talks'
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Flame className="w-5 h-5 mr-2 text-orange-400" />
            Trending Players
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trendingPlayers.map((player, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-slate-400 font-mono text-sm w-6">
                  #{index + 1}
                </div>
                <div>
                  <p className="text-white font-medium">{player.name}</p>
                  <p className="text-xs text-slate-400">{player.team} • {player.mentions} mentions</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <span className={`text-sm font-bold ${
                      player.sentiment >= 7 ? 'text-green-400' : 
                      player.sentiment >= 5 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {player.sentiment}
                    </span>
                    <div className="flex items-center">
                      {player.change > 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-400" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-400" />
                      )}
                      <span className={`text-xs ml-1 ${
                        player.change > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {player.change > 0 ? '+' : ''}{player.change}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">{player.reason}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-400" />
            Hot Topics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hotTopics.map((topic, index) => (
            <div key={index} className="p-3 bg-slate-900/50 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">{topic}</span>
                <Badge variant="outline" className="text-slate-400 border-slate-600">
                  {Math.floor(Math.random() * 500 + 100)} mentions
                </Badge>
              </div>
            </div>
          ))}
          
          <div className="p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-700/30">
            <h4 className="text-white font-medium mb-2">Market Opportunity</h4>
            <p className="text-sm text-slate-300 mb-3">
              Sentiment gap detected: Public betting 65% on Lakers, but social sentiment only 52% positive
            </p>
            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
              Contrarian Signal
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendingSection;
