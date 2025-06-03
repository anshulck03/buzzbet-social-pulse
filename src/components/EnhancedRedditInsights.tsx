
import React, { useState } from 'react';
import { Clock, MessageCircle, TrendingUp, ExternalLink, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { RedditPost } from '@/services/redditApi';
import { useRedditPagination } from '@/hooks/useRedditPagination';
import { redditConfig } from '@/services/redditConfiguration';

interface EnhancedRedditInsightsProps {
  posts: RedditPost[];
  searchedSubreddits: string[];
  playerName: string;
  loading: boolean;
  error: string | null;
}

const EnhancedRedditInsights = ({ 
  posts, 
  searchedSubreddits, 
  playerName, 
  loading, 
  error 
}: EnhancedRedditInsightsProps) => {
  const config = redditConfig.getConfiguration();
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const {
    paginatedPosts,
    pagination,
    filters,
    uniqueSubreddits,
    totalFilteredPosts,
    goToPage,
    nextPage,
    previousPage,
    updateFilters
  } = useRedditPagination(posts, config.postsPerPage);

  const formatPostDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const togglePostExpansion = (postId: string) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
  };

  const getSubredditColor = (subreddit: string) => {
    const colors = [
      'text-orange-400 border-orange-400',
      'text-blue-400 border-blue-400',
      'text-green-400 border-green-400',
      'text-purple-400 border-purple-400',
      'text-cyan-400 border-cyan-400',
      'text-red-400 border-red-400'
    ];
    const index = subreddit.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="flex items-center justify-center p-8">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-slate-300">Loading comprehensive Reddit insights...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-orange-400" />
            Reddit Insights
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
          </Button>
        </div>
        
        <div className="text-sm text-slate-400 space-y-2">
          <p>Comprehensive analysis across {searchedSubreddits.length} subreddits</p>
          <div className="flex flex-wrap gap-1">
            {searchedSubreddits.slice(0, 8).map((subreddit) => (
              <Badge 
                key={subreddit} 
                variant="outline" 
                className={`text-xs ${getSubredditColor(subreddit)}`}
              >
                r/{subreddit}
              </Badge>
            ))}
            {searchedSubreddits.length > 8 && (
              <Badge variant="outline" className="text-xs text-slate-500 border-slate-600">
                +{searchedSubreddits.length - 8} more
              </Badge>
            )}
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Sort By</label>
              <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
                <SelectTrigger className="bg-slate-800 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {config.sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Filter By</label>
              <Select value={filters.filterBy} onValueChange={(value) => updateFilters({ filterBy: value })}>
                <SelectTrigger className="bg-slate-800 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {config.filterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-2 block">Subreddit</label>
              <Select value={filters.subredditFilter} onValueChange={(value) => updateFilters({ subredditFilter: value })}>
                <SelectTrigger className="bg-slate-800 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subreddits</SelectItem>
                  {uniqueSubreddits.map((subreddit) => (
                    <SelectItem key={subreddit} value={subreddit}>
                      r/{subreddit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
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
            <p className="text-slate-400">No Reddit discussions found for {playerName}</p>
            <p className="text-slate-500 text-sm mt-1">
              Try searching for a different player or check back later for new discussions
            </p>
            {searchedSubreddits.length > 0 && (
              <p className="text-slate-600 text-xs mt-2">
                Searched: {searchedSubreddits.map(sub => `r/${sub}`).join(', ')}
              </p>
            )}
          </div>
        )}

        {!error && posts.length > 0 && (
          <>
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>
                Showing {totalFilteredPosts} discussions across {uniqueSubreddits.length} subreddits
              </span>
              <span>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
            </div>

            {paginatedPosts.map((post) => {
              const isExpanded = expandedPosts.has(post.id);
              const hasLongContent = post.selftext && post.selftext.length > 200;
              
              return (
                <div 
                  key={post.id}
                  className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getSubredditColor(post.subreddit)}`}
                      >
                        r/{post.subreddit}
                      </Badge>
                      <div className="flex items-center text-slate-500 text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatPostDate(post.created_utc)}
                      </div>
                      <span className="text-slate-500 text-xs">u/{post.author}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-xs">
                      <div className="flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {post.score}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        {post.num_comments}
                      </div>
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
                    <div className="text-slate-400 text-xs leading-relaxed">
                      <p>
                        {hasLongContent && !isExpanded 
                          ? `${post.selftext.substring(0, 200)}...`
                          : post.selftext
                        }
                      </p>
                      {hasLongContent && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePostExpansion(post.id)}
                          className="mt-2 text-xs text-blue-400 hover:text-blue-300 p-0 h-auto"
                        >
                          {isExpanded ? 'Show less' : 'Read more'}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={previousPage}
                        className={pagination.hasPreviousPage ? 
                          "cursor-pointer hover:bg-slate-700" : 
                          "cursor-not-allowed opacity-50"
                        }
                      />
                    </PaginationItem>
                    
                    {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      const isActive = pageNum === pagination.currentPage;
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink 
                            onClick={() => goToPage(pageNum)}
                            isActive={isActive}
                            className="cursor-pointer hover:bg-slate-700"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={nextPage}
                        className={pagination.hasNextPage ? 
                          "cursor-pointer hover:bg-slate-700" : 
                          "cursor-not-allowed opacity-50"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedRedditInsights;
