
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

class RedditApiService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

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
    this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Subtract 1 minute for safety

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

  async getSubredditPosts(subreddit: string, query: string, limit: number = 25): Promise<RedditPost[]> {
    const token = await this.getAccessToken();
    
    const response = await fetch(
      `https://oauth.reddit.com/r/${subreddit}/search?q=${encodeURIComponent(query)}&restrict_sr=1&limit=${limit}&sort=hot&t=week`,
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

  async getPostComments(postId: string, limit: number = 50): Promise<RedditComment[]> {
    const token = await this.getAccessToken();
    
    const response = await fetch(
      `https://oauth.reddit.com/comments/${postId}?limit=${limit}`,
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
  }

  async searchPlayerMentions(playerName: string): Promise<{posts: RedditPost[], comments: RedditComment[]}> {
    try {
      console.log(`Searching Reddit for: ${playerName}`);
      
      // Search in NBA subreddit
      const nbaPosts = await this.getSubredditPosts('nba', playerName, 10);
      
      // Search in fantasy basketball subreddit
      const fantasyPosts = await this.getSubredditPosts('fantasybball', playerName, 5);
      
      // Combine posts
      const allPosts = [...nbaPosts, ...fantasyPosts];
      
      // Get comments from top posts
      const comments: RedditComment[] = [];
      for (const post of allPosts.slice(0, 3)) {
        try {
          const postComments = await this.getPostComments(post.id, 25);
          comments.push(...postComments);
        } catch (error) {
          console.warn(`Failed to get comments for post ${post.id}:`, error);
        }
      }
      
      console.log(`Found ${allPosts.length} posts and ${comments.length} comments for ${playerName}`);
      
      return {
        posts: allPosts,
        comments: comments
      };
    } catch (error) {
      console.error('Error searching Reddit:', error);
      throw error;
    }
  }
}

export const redditApi = new RedditApiService();
export type { RedditPost, RedditComment };
