
import React, { useEffect, useState } from 'react';
import { Clock, MessageCircle, TrendingUp, AlertTriangle, Loader2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { redditApi, RedditPost, RedditComment } from '@/services/redditApi';
import { ESPNPlayer } from '@/services/espnPlayerDatabase';

interface InsightFeedProps {
  player: { name: string; playerData?: ESPNPlayer } | null;
}

const InsightFeed = ({ player }: InsightFeedProps) => {
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [comments, setComments] = useState<RedditComment[]>([]);
  const [searchedSubreddits, setSearchedSubreddits] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!player?.name) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { posts: redditPosts, comments: redditComments, searchedSubreddits: subreddits } = 
          await redditApi.searchPlayerMentions(player.name, player.playerData);
        setPosts(redditPosts);
        setComments(redditComments);
        setSearchedSubreddits(subreddits);
      } catch (err) {
        console.error('Error fetching Reddit data:', err);
        setError('Failed to load Reddit data');
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
            <span className="text-slate-300">Loading Reddit insights...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
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
              <p>Searched: {searchedSubreddits.map(sub => `r/${sub}`).join(', ')}</p>
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

      {/* Reddit Insights */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-orange-400" />
            Reddit Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
          
          {!error && posts.length === 0 && (
            <div className="p-6 text-center">
              <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No Reddit discussions found for {player?.name}</p>
              <p className="text-slate-500 text-sm mt-1">Try searching for a different player or check the spelling</p>
              {searchedSubreddits.length > 0 && (
                <p className="text-slate-600 text-xs mt-2">
                  Searched: {searchedSubreddits.map(sub => `r/${sub}`).join(', ')}
                </p>
              )}
            </div>
          )}

          {!error && posts.length > 0 && posts.map((post, index) => (
            <div 
              key={post.id}
              className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <Badge variant="outline" className="text-orange-400 border-orange-400 text-xs">
                  r/{post.subreddit}
                </Badge>
                <div className="flex items-center text-slate-500 text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {post.score}
                </div>
              </div>
              
              <a 
                href={`https://reddit.com${post.permalink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <h4 className="text-slate-200 font-medium mb-2 text-sm leading-relaxed hover:text-blue-300 transition-colors flex items-start gap-2">
                  {post.title}
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-blue-400 flex-shrink-0 mt-0.5" />
                </h4>
              </a>
              
              {post.selftext && post.selftext.length > 0 && (
                <p className="text-slate-400 text-xs leading-relaxed mb-3">
                  {post.selftext.length > 150 ? `${post.selftext.substring(0, 150)}...` : post.selftext}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>u/{post.author}</span>
                <div className="flex items-center">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  {post.num_comments} comments
                </div>
              </div>
            </div>
          ))}

          {!error && posts.length > 0 && (
            <div className="text-center pt-2">
              <p className="text-slate-500 text-xs">
                Showing {posts.length} Reddit posts across {searchedSubreddits.length} subreddits
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightFeed;
