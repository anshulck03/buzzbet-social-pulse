
export interface RedditConfiguration {
  postsPerPage: number;
  maxSubredditsToSearch: number;
  cacheExpirationMinutes: number;
  fallbackPostCount: number;
  enablePagination: boolean;
  sortOptions: Array<{ value: string; label: string }>;
  filterOptions: Array<{ value: string; label: string }>;
}

export interface SubredditGroup {
  name: string;
  description: string;
  subreddits: string[];
  priority: number;
  enabled: boolean;
}

class RedditConfigurationService {
  private config: RedditConfiguration = {
    postsPerPage: 20,
    maxSubredditsToSearch: 15,
    cacheExpirationMinutes: 10,
    fallbackPostCount: 5,
    enablePagination: true,
    sortOptions: [
      { value: 'hot', label: 'Hot' },
      { value: 'new', label: 'New' },
      { value: 'top', label: 'Top' },
      { value: 'relevance', label: 'Most Relevant' }
    ],
    filterOptions: [
      { value: 'all', label: 'All Discussions' },
      { value: 'team', label: 'Team Discussions' },
      { value: 'fantasy', label: 'Fantasy Analysis' },
      { value: 'performance', label: 'Performance Talk' },
      { value: 'injury', label: 'Injury Reports' }
    ]
  };

  private subredditGroups: SubredditGroup[] = [
    {
      name: 'NBA Communities',
      description: 'Basketball discussion and analysis',
      subreddits: ['nba', 'basketball', 'nbadiscussion', 'nbatalk', 'fantasybball'],
      priority: 5,
      enabled: true
    },
    {
      name: 'NFL Communities',
      description: 'Football discussion and analysis',
      subreddits: ['nfl', 'football', 'fantasyfootball', 'nflanalysis', 'dynastyff'],
      priority: 5,
      enabled: true
    },
    {
      name: 'MLB Communities',
      description: 'Baseball discussion and analysis',
      subreddits: ['baseball', 'mlb', 'fantasybaseball', 'sabermetrics', 'dynastybaseball'],
      priority: 5,
      enabled: true
    },
    {
      name: 'NHL Communities',
      description: 'Hockey discussion and analysis',
      subreddits: ['hockey', 'nhl', 'fantasyhockey', 'hockeyanalysis', 'dynastyhockey'],
      priority: 5,
      enabled: true
    },
    {
      name: 'General Sports',
      description: 'Cross-sport discussions',
      subreddits: ['sports', 'espn', 'sportscenter', 'sportsbook', 'fantasysports'],
      priority: 3,
      enabled: true
    },
    {
      name: 'Team-Specific',
      description: 'Individual team communities',
      subreddits: [], // Dynamically populated based on player team
      priority: 4,
      enabled: true
    }
  ];

  getConfiguration(): RedditConfiguration {
    return { ...this.config };
  }

  updateConfiguration(updates: Partial<RedditConfiguration>): void {
    this.config = { ...this.config, ...updates };
  }

  getSubredditGroups(): SubredditGroup[] {
    return this.subredditGroups.filter(group => group.enabled);
  }

  getEnabledSubreddits(): string[] {
    return this.subredditGroups
      .filter(group => group.enabled)
      .flatMap(group => group.subreddits)
      .filter((subreddit, index, array) => array.indexOf(subreddit) === index);
  }

  updateSubredditGroup(groupName: string, updates: Partial<SubredditGroup>): void {
    const groupIndex = this.subredditGroups.findIndex(g => g.name === groupName);
    if (groupIndex !== -1) {
      this.subredditGroups[groupIndex] = { 
        ...this.subredditGroups[groupIndex], 
        ...updates 
      };
    }
  }

  addCustomSubreddit(groupName: string, subreddit: string): void {
    const group = this.subredditGroups.find(g => g.name === groupName);
    if (group && !group.subreddits.includes(subreddit)) {
      group.subreddits.push(subreddit);
    }
  }

  removeSubreddit(groupName: string, subreddit: string): void {
    const group = this.subredditGroups.find(g => g.name === groupName);
    if (group) {
      group.subreddits = group.subreddits.filter(s => s !== subreddit);
    }
  }

  getSubredditsByPriority(): string[] {
    return this.subredditGroups
      .filter(group => group.enabled)
      .sort((a, b) => b.priority - a.priority)
      .flatMap(group => group.subreddits)
      .filter((subreddit, index, array) => array.indexOf(subreddit) === index);
  }
}

export const redditConfig = new RedditConfigurationService();
