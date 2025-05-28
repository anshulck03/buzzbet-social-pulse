
import React from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, ExternalLink, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const InsightFeed = ({ player }) => {
  const insights = [
    {
      id: 1,
      type: 'positive',
      source: 'Reddit',
      subreddit: 'r/nba',
      content: 'His defense has been incredible this season. Completely locked down Tatum in the 4th quarter.',
      score: 8.2,
      upvotes: 847,
      timeAgo: '2h ago',
      url: '#'
    },
    {
      id: 2,
      type: 'negative',
      source: 'Twitter',
      handle: '@NBAAnalyst',
      content: 'Concerning trend: 3PT% has dropped to 31% over last 10 games. Regression to the mean?',
      score: 3.1,
      likes: 234,
      timeAgo: '3h ago',
      url: '#'
    },
    {
      id: 3,
      type: 'neutral',
      source: 'YouTube',
      channel: 'ESPN',
      content: 'Post-game interview: "We need to execute better in clutch situations"',
      score: 5.8,
      views: '12K views',
      timeAgo: '4h ago',
      url: '#'
    },
    {
      id: 4,
      type: 'positive',
      source: 'News',
      outlet: 'The Athletic',
      content: 'Advanced metrics show elite defensive impact - 97.2 defensive rating when on court',
      score: 7.9,
      timeAgo: '5h ago',
      url: '#'
    },
    {
      id: 5,
      type: 'negative',
      source: 'Reddit',
      subreddit: 'r/fantasybball',
      content: 'Ankle looked a bit stiff during warm-ups. Worth monitoring for DFS lineups.',
      score: 4.2,
      upvotes: 156,
      timeAgo: '6h ago',
      url: '#'
    }
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case 'positive': return 'text-green-400 border-green-400';
      case 'negative': return 'text-red-400 border-red-400';
      default: return 'text-yellow-400 border-yellow-400';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'positive': return <ThumbsUp className="w-4 h-4" />;
      case 'negative': return <ThumbsDown className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getSourceIcon = (source) => {
    const icons = {
      Reddit: '🔴',
      Twitter: '🐦',
      YouTube: '📺',
      News: '📰'
    };
    return icons[source] || '📄';
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>Live Insights</span>
          <Badge variant="outline" className="text-green-400 border-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {insights.map((insight) => (
          <div 
            key={insight.id}
            className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getSourceIcon(insight.source)}</span>
                <div>
                  <p className="text-sm text-slate-300 font-medium">{insight.source}</p>
                  <p className="text-xs text-slate-500">
                    {insight.subreddit || insight.handle || insight.channel || insight.outlet}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={getTypeColor(insight.type)}>
                  {getTypeIcon(insight.type)}
                  <span className="ml-1 text-xs">{insight.score}</span>
                </Badge>
              </div>
            </div>
            
            <p className="text-slate-300 text-sm mb-3 leading-relaxed">
              {insight.content}
            </p>
            
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {insight.timeAgo}
                </span>
                {insight.upvotes && (
                  <span>{insight.upvotes} upvotes</span>
                )}
                {insight.likes && (
                  <span>{insight.likes} likes</span>
                )}
                {insight.views && (
                  <span>{insight.views}</span>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-slate-400 hover:text-slate-300 p-1 h-auto"
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default InsightFeed;
