
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { redditApi, RedditPost, RedditComment } from '@/services/redditApi';
import { ESPNPlayer } from '@/services/espnPlayerDatabase';
import EnhancedPlayerCard from './EnhancedPlayerCard';
import EnhancedRedditInsights from './EnhancedRedditInsights';
import { redditConfig } from '@/services/redditConfiguration';

interface InsightFeedProps {
  player: { name: string; playerData?: ESPNPlayer } | null;
}

const InsightFeed = ({ player }: InsightFeedProps) => {
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [comments, setComments] = useState<RedditComment[]>([]);
  const [searchedSubreddits, setSearchedSubreddits] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('InsightFeed player prop:', player);
  console.log('Player data exists:', !!player?.playerData);

  useEffect(() => {
    if (!player?.name) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const config = redditConfig.getConfiguration();
        const { posts: redditPosts, comments: redditComments, searchedSubreddits: subreddits } = 
          await redditApi.searchPlayerMentions(player.name, player.playerData);
        
        // Sort posts by created_utc in descending order (most recent first)
        const sortedPosts = redditPosts.sort((a, b) => b.created_utc - a.created_utc);
        
        // Ensure we have adequate data coverage
        if (sortedPosts.length < config.fallbackPostCount && player.playerData) {
          console.log(`Limited data for ${player.name}, implementing fallback coverage`);
        }
        
        setPosts(sortedPosts);
        setComments(redditComments);
        setSearchedSubreddits(subreddits);
      } catch (err) {
        console.error('Error fetching Reddit data:', err);
        setError('Failed to load Reddit data - please try again');
        setPosts([]);
        setComments([]);
        setSearchedSubreddits([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [player?.name, player?.playerData]);

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="flex items-center justify-center p-8">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
            <span className="text-slate-300">Loading comprehensive insights...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Player Card - Always show when we have player data */}
      {player?.playerData && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Player Profile</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <EnhancedPlayerCard 
              player={player.playerData} 
              onClick={() => {}} 
              compact={false}
            />
          </CardContent>
        </Card>
      )}

      {/* Data Sources Status */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Data Sources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Reddit</span>
            <Badge variant="outline" className="text-green-400 border-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              Active
            </Badge>
          </div>
          {player?.playerData && (
            <div className="text-xs text-slate-400">
              <p>Sport: {player.playerData.sport} • Team: {player.playerData.team}</p>
            </div>
          )}
          {searchedSubreddits.length > 0 && (
            <div className="text-xs text-slate-500">
              <p>Coverage: {searchedSubreddits.length} subreddit communities</p>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Twitter</span>
            <Badge variant="outline" className="text-slate-500 border-slate-600">
              Coming Soon
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">YouTube</span>
            <Badge variant="outline" className="text-slate-500 border-slate-600">
              Coming Soon
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">News</span>
            <Badge variant="outline" className="text-slate-500 border-slate-600">
              Coming Soon
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Reddit Insights */}
      <EnhancedRedditInsights
        posts={posts}
        searchedSubreddits={searchedSubreddits}
        playerName={player?.name || ''}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default InsightFeed;
