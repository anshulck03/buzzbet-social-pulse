
interface NicknameMapping {
  [key: string]: string;
}

interface TeamAbbreviationMapping {
  [key: string]: string;
}

interface SearchShortcut {
  pattern: RegExp;
  handler: (match: string[]) => { type: 'team_roster' | 'position_filter' | 'status_filter'; value: string };
}

class SmartSearchService {
  private nicknames: NicknameMapping = {
    // NBA nicknames
    'the king': 'LeBron James',
    'king james': 'LeBron James',
    'chef curry': 'Stephen Curry',
    'steph curry': 'Stephen Curry',
    'greek freak': 'Giannis Antetokounmpo',
    'kd': 'Kevin Durant',
    'the joker': 'Nikola Jokic',
    'dame': 'Damian Lillard',
    'dame lillard': 'Damian Lillard',
    'pg13': 'Paul George',
    'ant': 'Anthony Edwards',
    'ant edwards': 'Anthony Edwards',
    'wemby': 'Victor Wembanyama',
    'kat': 'Karl-Anthony Towns',
    'sga': 'Shai Gilgeous-Alexander',
    'ad': 'Anthony Davis',
    
    // NFL nicknames
    'tb12': 'Tom Brady',
    'mahomes': 'Patrick Mahomes',
    'josh allen': 'Josh Allen',
    'lamar jackson': 'Lamar Jackson',
    'aaron rodgers': 'Aaron Rodgers',
    'dak': 'Dak Prescott',
    'tua': 'Tua Tagovailoa',
    'joe burrow': 'Joe Burrow',
    'herbert': 'Justin Herbert',
    'cmc': 'Christian McCaffrey',
    
    // MLB nicknames
    'mike trout': 'Mike Trout',
    'mookie': 'Mookie Betts',
    'aaron judge': 'Aaron Judge',
    'acuna': 'Ronald Acuña Jr.',
    'soto': 'Juan Soto',
    'tatis': 'Fernando Tatis Jr.',
    'vlad jr': 'Vladimir Guerrero Jr.',
    'ohtani': 'Shohei Ohtani',
    'lindor': 'Francisco Lindor',
    'freeman': 'Freddie Freeman'
  };

  private teamAbbreviations: TeamAbbreviationMapping = {
    // NBA teams
    'lal': 'Los Angeles Lakers',
    'gsw': 'Golden State Warriors',
    'bos': 'Boston Celtics',
    'mia': 'Miami Heat',
    'chi': 'Chicago Bulls',
    'nyk': 'New York Knicks',
    'bkn': 'Brooklyn Nets',
    'phi': 'Philadelphia 76ers',
    'mil': 'Milwaukee Bucks',
    'tor': 'Toronto Raptors',
    'atl': 'Atlanta Hawks',
    'cha': 'Charlotte Hornets',
    'orl': 'Orlando Magic',
    'was': 'Washington Wizards',
    'ind': 'Indiana Pacers',
    'det': 'Detroit Pistons',
    'cle': 'Cleveland Cavaliers',
    'den': 'Denver Nuggets',
    'min': 'Minnesota Timberwolves',
    'okc': 'Oklahoma City Thunder',
    'por': 'Portland Trail Blazers',
    'uta': 'Utah Jazz',
    'phx': 'Phoenix Suns',
    'sac': 'Sacramento Kings',
    'lac': 'LA Clippers',
    'mem': 'Memphis Grizzlies',
    'nop': 'New Orleans Pelicans',
    'sas': 'San Antonio Spurs',
    'dal': 'Dallas Mavericks',
    'hou': 'Houston Rockets',
    
    // NFL teams
    'buf': 'Buffalo Bills',
    'mia_nfl': 'Miami Dolphins',
    'ne': 'New England Patriots',
    'nyj': 'New York Jets',
    'bal': 'Baltimore Ravens',
    'cin': 'Cincinnati Bengals',
    'cle_nfl': 'Cleveland Browns',
    'pit': 'Pittsburgh Steelers',
    'hou_nfl': 'Houston Texans',
    'ind_nfl': 'Indianapolis Colts',
    'jax': 'Jacksonville Jaguars',
    'ten': 'Tennessee Titans',
    'den_nfl': 'Denver Broncos',
    'kc': 'Kansas City Chiefs',
    'lv': 'Las Vegas Raiders',
    'lac_nfl': 'Los Angeles Chargers',
    'dal_nfl': 'Dallas Cowboys',
    'nyg': 'New York Giants',
    'phi_nfl': 'Philadelphia Eagles',
    'was_nfl': 'Washington Commanders',
    'chi_nfl': 'Chicago Bears',
    'det_nfl': 'Detroit Lions',
    'gb': 'Green Bay Packers',
    'min_nfl': 'Minnesota Vikings',
    'atl_nfl': 'Atlanta Falcons',
    'car': 'Carolina Panthers',
    'no': 'New Orleans Saints',
    'tb': 'Tampa Bay Buccaneers',
    'ari': 'Arizona Cardinals',
    'lar': 'Los Angeles Rams',
    'sf': 'San Francisco 49ers',
    'sea': 'Seattle Seahawks'
  };

  private shortcuts: SearchShortcut[] = [
    {
      pattern: /^(\w+)\s+roster$/i,
      handler: (match) => ({ type: 'team_roster', value: match[1] })
    },
    {
      pattern: /^(nba|nfl|mlb|nhl)\s+(centers?|guards?|forwards?|qbs?|quarterbacks?|rbs?|wrs?)$/i,
      handler: (match) => ({ type: 'position_filter', value: `${match[1]}_${match[2]}` })
    },
    {
      pattern: /^injured\s+(qbs?|quarterbacks?|players?)$/i,
      handler: (match) => ({ type: 'status_filter', value: 'injured' })
    }
  ];

  enhanceQuery(query: string): {
    enhancedQuery: string;
    isShortcut: boolean;
    shortcutData?: any;
  } {
    const lowerQuery = query.toLowerCase().trim();
    
    // Check for shortcuts first
    for (const shortcut of this.shortcuts) {
      const match = lowerQuery.match(shortcut.pattern);
      if (match) {
        return {
          enhancedQuery: query,
          isShortcut: true,
          shortcutData: shortcut.handler(match)
        };
      }
    }
    
    // Check for team abbreviations
    if (this.teamAbbreviations[lowerQuery]) {
      return {
        enhancedQuery: this.teamAbbreviations[lowerQuery],
        isShortcut: false
      };
    }
    
    // Check for nicknames
    if (this.nicknames[lowerQuery]) {
      return {
        enhancedQuery: this.nicknames[lowerQuery],
        isShortcut: false
      };
    }
    
    // Check for partial nickname matches
    for (const [nickname, playerName] of Object.entries(this.nicknames)) {
      if (nickname.includes(lowerQuery) && lowerQuery.length >= 3) {
        return {
          enhancedQuery: playerName,
          isShortcut: false
        };
      }
    }
    
    return {
      enhancedQuery: query,
      isShortcut: false
    };
  }

  getPopularSearches(): string[] {
    return [
      'LeBron James', 'Patrick Mahomes', 'Aaron Judge', 
      'Stephen Curry', 'Josh Allen', 'Mike Trout',
      'Luka Dončić', 'Joe Burrow', 'Mookie Betts',
      'Giannis Antetokounmpo', 'Lamar Jackson', 'Shohei Ohtani'
    ];
  }

  getTrendingPlayers(): { name: string; trend: 'up' | 'hot' | 'new' }[] {
    return [
      { name: 'Victor Wembanyama', trend: 'hot' },
      { name: 'Anthony Edwards', trend: 'up' },
      { name: 'Ja Morant', trend: 'up' },
      { name: 'Tua Tagovailoa', trend: 'new' },
      { name: 'Juan Soto', trend: 'hot' }
    ];
  }
}

export const smartSearchService = new SmartSearchService();
