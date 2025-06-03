
import { useState, useMemo } from 'react';
import { RedditPost } from '@/services/redditApi';

interface PaginationState {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface FilterState {
  sortBy: string;
  filterBy: string;
  subredditFilter: string;
}

export const useRedditPagination = (
  posts: RedditPost[],
  postsPerPage: number = 10
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'hot',
    filterBy: 'all',
    subredditFilter: 'all'
  });

  const filteredPosts = useMemo(() => {
    let filtered = [...posts];

    // Apply subreddit filter
    if (filters.subredditFilter !== 'all') {
      filtered = filtered.filter(post => post.subreddit === filters.subredditFilter);
    }

    // Apply category filter (basic content-based filtering)
    if (filters.filterBy !== 'all') {
      filtered = filtered.filter(post => {
        const content = (post.title + ' ' + post.selftext).toLowerCase();
        switch (filters.filterBy) {
          case 'fantasy':
            return content.includes('fantasy') || content.includes('draft') || content.includes('lineup');
          case 'injury':
            return content.includes('injury') || content.includes('hurt') || content.includes('out');
          case 'performance':
            return content.includes('stats') || content.includes('points') || content.includes('game');
          case 'team':
            return content.includes('trade') || content.includes('roster') || content.includes('coach');
          default:
            return true;
        }
      });
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'new':
        filtered.sort((a, b) => b.created_utc - a.created_utc);
        break;
      case 'top':
        filtered.sort((a, b) => b.score - a.score);
        break;
      case 'relevance':
        // Sort by combination of score and recency
        filtered.sort((a, b) => {
          const scoreA = a.score * (1 + (Date.now() / 1000 - a.created_utc) / 86400);
          const scoreB = b.score * (1 + (Date.now() / 1000 - b.created_utc) / 86400);
          return scoreB - scoreA;
        });
        break;
      default: // 'hot'
        filtered.sort((a, b) => b.score - a.score);
    }

    return filtered;
  }, [posts, filters]);

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, currentPage, postsPerPage]);

  const pagination: PaginationState = useMemo(() => {
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    return {
      currentPage,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1
    };
  }, [filteredPosts.length, currentPage, postsPerPage]);

  const uniqueSubreddits = useMemo(() => {
    const subreddits = [...new Set(posts.map(post => post.subreddit))];
    return subreddits.sort();
  }, [posts]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (pagination.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const previousPage = () => {
    if (pagination.hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  return {
    paginatedPosts,
    pagination,
    filters,
    uniqueSubreddits,
    totalFilteredPosts: filteredPosts.length,
    goToPage,
    nextPage,
    previousPage,
    updateFilters
  };
};
