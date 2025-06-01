
const REDDIT_CLIENT_ID = '-7EV03N1xVXY3vda_h_Dzw';
const REDDIT_CLIENT_SECRET = 'jat9LYjzT_G52kMIpPcTIUdLIqBdhA';

interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  score: number;
  num_comments: number;
  created_utc: number;
  subreddit: string;
  author: string;
  url: string;
  permalink: string;
}

interface RedditComment {
  id: string;
  body: string;
  score: number;
  created_utc: number;
  author: string;
  permalink: string;
}

import { ESPNPlayer } from '@/services/espnPlayerDatabase';
import { subredditDiscovery } from '@/services/subredditDiscovery';

class RedditApiService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private cache: Map<string, { data: any; expiry: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private getCacheKey(playerName: string, type: string): string {
    return `${playerName.toLowerCase()}-${type}`;
  }

  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() < cached.expiry) {
      console.log(`Using cached data for ${key}`);
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key); // Remove expired cache
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + this.CACHE_DURATION
    });
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const auth = btoa(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`);
    
    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'SentiBet/1.0'
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error(`Failed to get Reddit access token: ${response.statusText}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000;

    return this.accessToken;
  }

  async searchPosts(query: string, limit: number = 25): Promise<RedditPost[]> {
    const token = await this.getAccessToken();
    
    const response = await fetch(
      `https://oauth.reddit.com/search?q=${encodeURIComponent(query)}&limit=${limit}&sort=hot&t=week`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Agent': 'SentiBet/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.children.map((child: any) => child.data);
  }

  async getSubredditPosts(subreddit: string, query: string, limit: number = 10): Promise<RedditPost[]> {
    const token = await this.getAccessToken();
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    try {
      const response = await fetch(
        `https://oauth.reddit.com/r/${subreddit}/search?q=${encodeURIComponent(query)}&restrict_sr=1&limit=${limit}&sort=hot&t=week`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-Agent': 'SentiBet/1.0'
          },
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Reddit API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data.children.map((child: any) => child.data);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error(`Timeout accessing r/${subreddit}`);
      }
      throw error;
    }
  }

  async getPostComments(postId: string, limit: number = 20): Promise<RedditComment[]> {
    const token = await this.getAccessToken();
    
    // Add timeout for comment fetching
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
    
    try {
      const response = await fetch(
        `https://oauth.reddit.com/comments/${postId}?limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-Agent': 'SentiBet/1.0'
          },
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Reddit API error: ${response.statusText}`);
      }

      const data = await response.json();
      const comments: RedditComment[] = [];
      
      const extractComments = (items: any[]) => {
        items.forEach(item => {
          if (item.data && item.data.body && item.data.body !== '[deleted]' && item.data.body !== '[removed]') {
            comments.push(item.data);
          }
          if (item.data && item.data.replies && item.data.replies.data) {
            extractComments(item.data.replies.data.children);
          }
        });
      };

      if (data[1] && data[1].data && data[1].data.children) {
        extractComments(data[1].data.children);
      }

      return comments;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.warn(`Comment fetch timeout for post ${postId}`);
        return [];
      }
      throw error;
    }
  }

  async searchPlayerMentions(playerName: string, playerData?: ESPNPlayer): Promise<{posts: RedditPost[], comments: RedditComment[], searchedSubreddits: string[]}> {
    try {
      // Check cache first
      const cacheKey = this.getCacheKey(playerName, 'player-mentions');
      const cachedResult = this.getCachedData(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      console.log(`AI-powered subreddit discovery for: ${playerName}`);
      
      // Use intelligent subreddit discovery
      const targetSubreddits = subredditDiscovery.discoverSubreddits(playerName, playerData);
      
      if (playerData) {
        console.log(`Analyzing ${playerData.sport} player across ${targetSubreddits.length} intelligent subreddits`);
      } else {
        console.log(`Multi-sport analysis across ${targetSubreddits.length} subreddits`);
      }
      
      const allPosts: RedditPost[] = [];
      const searchedSubreddits: string[] = [];
      
      // OPTIMIZATION: Search subreddits in parallel instead of sequentially
      const subredditPromises = targetSubreddits.slice(0, 8).map(async (subreddit) => {
        try {
          const posts = await this.getSubredditPosts(subreddit, playerName, 4); // Reduced from 6 to 4
          if (posts.length > 0) {
            // Filter posts to only include those that actually mention the player
            const relevantPosts = posts.filter(post => 
              post.title.toLowerCase().includes(playerName.toLowerCase()) ||
              (post.selftext && post.selftext.toLowerCase().includes(playerName.toLowerCase()))
            );
            
            if (relevantPosts.length > 0) {
              // Add subreddit info to posts for sport detection
              const postsWithSubreddit = relevantPosts.map(post => ({
                ...post,
                subreddit: subreddit
              }));
              
              return { posts: postsWithSubreddit, subreddit };
            }
          }
          return { posts: [], subreddit: null };
        } catch (error) {
          console.warn(`Failed to search r/${subreddit}:`, error);
          return { posts: [], subreddit: null };
        }
      });

      // Wait for all subreddit searches to complete in parallel
      const results = await Promise.allSettled(subredditPromises);
      
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value.posts.length > 0) {
          allPosts.push(...result.value.posts);
          if (result.value.subreddit) {
            searchedSubreddits.push(result.value.subreddit);
          }
        }
      });
      
      // Sort by relevance using sport detection and subreddit priority
      const sortedPosts = allPosts.sort((a, b) => {
        const aPriority = subredditDiscovery.getSubredditPriority(a.subreddit, playerData?.sport);
        const bPriority = subredditDiscovery.getSubredditPriority(b.subreddit, playerData?.sport);
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority; // Higher priority first
        }
        
        return b.score - a.score; // Then by score
      });
      
      // Remove duplicates
      const uniquePosts = sortedPosts.filter((post, index, self) => 
        index === self.findIndex(p => p.id === post.id)
      );
      
      // OPTIMIZATION: Get comments from fewer posts and in parallel
      const comments: RedditComment[] = [];
      const topPosts = uniquePosts.slice(0, 3); // Reduced from 6 to 3
      
      if (topPosts.length > 0) {
        const commentPromises = topPosts.map(async (post) => {
          try {
            const postComments = await this.getPostComments(post.id, 10); // Reduced from 20 to 10
            // Filter comments to only include those mentioning the player
            return postComments.filter(comment =>
              comment.body.toLowerCase().includes(playerName.toLowerCase())
            );
          } catch (error) {
            console.warn(`Failed to get comments for post ${post.id}:`, error);
            return [];
          }
        });

        const commentResults = await Promise.allSettled(commentPromises);
        commentResults.forEach((result) => {
          if (result.status === 'fulfilled') {
            comments.push(...result.value);
          }
        });
      }
      
      const result = {
        posts: uniquePosts,
        comments: comments,
        searchedSubreddits: searchedSubreddits
      };

      // Cache the result
      this.setCachedData(cacheKey, result);
      
      console.log(`AI Discovery Results: ${uniquePosts.length} posts, ${comments.length} comments across ${searchedSubreddits.length} subreddits`);
      console.log(`Analyzed subreddits: ${searchedSubreddits.join(', ')}`);
      
      return result;
    } catch (error) {
      console.error('Error in AI-powered Reddit search:', error);
      throw error;
    }
  }

  // Method to clear cache if needed
  clearCache(): void {
    this.cache.clear();
    console.log('Reddit API cache cleared');
  }
}

export const redditApi = new RedditApiService();
export type { RedditPost, RedditComment };
