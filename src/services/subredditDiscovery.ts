
import { ESPNPlayer } from '@/services/espnPlayerDatabase';

export interface SportSubreddits {
  primary: string[];
  team: string[];
  fantasy: string[];
  analysis: string[];
  insider: string[];
}

export class SubredditDiscoveryService {
  private sportSubreddits: Record<string, SportSubreddits>;
  private teamSubreddits: Record<string, Record<string, string>>;

  constructor() {
    this.sportSubreddits = {
      NBA: {
        primary: ['nba', 'basketball'],
        team: ['lakers', 'warriors', 'celtics', 'heat', 'bulls', 'knicks', 'nets', 'sixers', 'raptors', 'magic', 'hawks', 'hornets', 'pistons', 'pacers', 'cavaliers', 'bucks', 'nuggets', 'timberwolves', 'thunder', 'blazers', 'jazz', 'mavericks', 'rockets', 'spurs', 'pelicans', 'grizzlies', 'suns', 'kings', 'clippers', 'lakers'],
        fantasy: ['fantasybball', 'fantasybball', 'dynastybball'],
        analysis: ['nbadiscussion', 'nbatalk', 'nbaanalysis'],
        insider: ['nbainsiders', 'nbatradediscussion']
      },
      NFL: {
        primary: ['nfl', 'football'],
        team: ['patriots', 'bills', 'dolphins', 'jets', 'steelers', 'ravens', 'browns', 'bengals', 'titans', 'colts', 'texans', 'jaguars', 'chiefs', 'chargers', 'broncos', 'raiders', 'cowboys', 'giants', 'eagles', 'commanders', 'packers', 'bears', 'lions', 'vikings', 'falcons', 'panthers', 'saints', 'buccaneers', 'cardinals', 'rams', 'seahawks', 'niners'],
        fantasy: ['fantasyfootball', 'dynastyff', 'redraftfantasyfootball'],
        analysis: ['nflanalysis', 'nfldiscussion', 'nflnoobs'],
        insider: ['nflinsiders', 'nfltradediscussion']
      },
      NHL: {
        primary: ['hockey', 'nhl'],
        team: ['bruins', 'sabres', 'detroitredwings', 'floridapanthers', 'habs', 'ottawasenators', 'tampabaylightning', 'leafs', 'canes', 'bluejackets', 'devils', 'newyorkislanders', 'rangers', 'flyers', 'penguins', 'caps', 'blackhawks', 'coloradoavalanche', 'dallasstars', 'wildhockey', 'predators', 'stlouisblues', 'winnipegjets', 'anaheimducks', 'calgaryflames', 'edmontonoilers', 'losangeleskings', 'sanjosesharks', 'canucks', 'goldenknights', 'seattlekraken'],
        fantasy: ['fantasyhockey', 'dynastyhockey'],
        analysis: ['hockeyanalysis', 'hockeyinsiders', 'nhlanalysis'],
        insider: ['hockeyinsiders', 'nhltradediscussion']
      },
      MLB: {
        primary: ['baseball', 'mlb'],
        team: ['redsox', 'nyyankees', 'orioles', 'rays', 'bluejays', 'whitesox', 'guardians', 'tigers', 'royals', 'twins', 'astros', 'angels', 'athletics', 'mariners', 'rangers', 'braves', 'marlins', 'mets', 'phillies', 'nationals', 'cubs', 'reds', 'brewers', 'pirates', 'cardinals', 'diamondbacks', 'rockies', 'dodgers', 'padres', 'giants'],
        fantasy: ['fantasybaseball', 'dynastybaseball'],
        analysis: ['mlbanalysis', 'baseballanalysis', 'sabermetrics'],
        insider: ['baseballinsiders', 'mlbtradediscussion']
      }
    };

    this.teamSubreddits = {
      NBA: {
        'Los Angeles Lakers': 'lakers',
        'Golden State Warriors': 'warriors',
        'Boston Celtics': 'bostonceltics',
        'Miami Heat': 'heat',
        'Chicago Bulls': 'chicagobulls',
        // Add more team mappings as needed
      },
      NFL: {
        'Kansas City Chiefs': 'kansascitychiefs',
        'New England Patriots': 'patriots',
        'Green Bay Packers': 'greenbaypackers',
        // Add more team mappings as needed
      },
      NHL: {
        'Boston Bruins': 'bostonbruins',
        'Toronto Maple Leafs': 'leafs',
        // Add more team mappings as needed
      },
      MLB: {
        'New York Yankees': 'nyyankees',
        'Boston Red Sox': 'redsox',
        // Add more team mappings as needed
      }
    };
  }

  discoverSubreddits(playerName: string, playerData?: ESPNPlayer): string[] {
    const subreddits: string[] = [];
    
    if (playerData && playerData.sport) {
      const sport = playerData.sport;
      const sportSubs = this.sportSubreddits[sport];
      
      if (sportSubs) {
        // Add primary sport subreddits
        subreddits.push(...sportSubs.primary);
        
        // Add fantasy subreddits
        subreddits.push(...sportSubs.fantasy);
        
        // Add analysis subreddits
        subreddits.push(...sportSubs.analysis.slice(0, 2));
        
        // Add team-specific subreddit if available
        if (playerData.team) {
          const teamSub = this.getTeamSubreddit(playerData.team, sport);
          if (teamSub) {
            subreddits.unshift(teamSub); // Add team sub at the beginning for priority
          }
        }
      }
    } else {
      // If no player data, search across all major sports
      subreddits.push(
        ...this.sportSubreddits.NBA.primary,
        ...this.sportSubreddits.NFL.primary,
        ...this.sportSubreddits.NHL.primary,
        ...this.sportSubreddits.MLB.primary,
        'sports'
      );
    }
    
    // Remove duplicates and limit to reasonable number
    return [...new Set(subreddits)].slice(0, 15);
  }

  private getTeamSubreddit(teamName: string, sport: string): string | null {
    const sportTeams = this.teamSubreddits[sport];
    if (!sportTeams) return null;
    
    // Direct lookup
    if (sportTeams[teamName]) {
      return sportTeams[teamName];
    }
    
    // Fuzzy matching for common team names
    const normalized = teamName.toLowerCase().replace(/[^a-z]/g, '');
    for (const [team, subreddit] of Object.entries(sportTeams)) {
      const normalizedTeam = team.toLowerCase().replace(/[^a-z]/g, '');
      if (normalizedTeam.includes(normalized) || normalized.includes(normalizedTeam)) {
        return subreddit;
      }
    }
    
    return null;
  }

  getSubredditPriority(subreddit: string, sport?: string): number {
    if (!sport) return 1;
    
    const sportSubs = this.sportSubreddits[sport];
    if (!sportSubs) return 1;
    
    if (sportSubs.primary.includes(subreddit)) return 5;
    if (sportSubs.team.includes(subreddit)) return 4;
    if (sportSubs.fantasy.includes(subreddit)) return 3;
    if (sportSubs.analysis.includes(subreddit)) return 2;
    if (sportSubs.insider.includes(subreddit)) return 2;
    
    return 1;
  }

  getSportFromSubreddit(subreddit: string): string | null {
    const sub = subreddit.toLowerCase();
    
    for (const [sport, subs] of Object.entries(this.sportSubreddits)) {
      const allSubs = [
        ...subs.primary,
        ...subs.team,
        ...subs.fantasy,
        ...subs.analysis,
        ...subs.insider
      ];
      
      if (allSubs.includes(sub)) {
        return sport;
      }
    }
    
    return null;
  }
}

export const subredditDiscovery = new SubredditDiscoveryService();
