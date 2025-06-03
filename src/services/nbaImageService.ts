
interface PlayerImage {
  playerId: string;
  imageUrl: string;
  source: 'espn' | 'nba' | 'nfl' | 'nhl' | 'mlb' | 'fallback';
}

class PlayerImageService {
  private imageCache = new Map<string, string>();

  // ESPN player image URLs follow a predictable pattern
  private getESPNPlayerImage(playerId: string, sport: string): string {
    const sportEndpoints = {
      'NBA': `https://a.espncdn.com/i/headshots/nba/players/full/${playerId}.png`,
      'NFL': `https://a.espncdn.com/i/headshots/nfl/players/full/${playerId}.png`,
      'NHL': `https://a.espncdn.com/i/headshots/nhl/players/full/${playerId}.png`,
      'MLB': `https://a.espncdn.com/i/headshots/mlb/players/full/${playerId}.png`
    };
    return sportEndpoints[sport] || sportEndpoints['NBA'];
  }

  // Alternative ESPN endpoint with size control
  private getESPNAlternativeImage(playerId: string, sport: string): string {
    const sportCode = sport.toLowerCase();
    return `https://a.espncdn.com/combiner/i?img=/i/headshots/${sportCode}/players/full/${playerId}.png&w=350&h=254`;
  }

  // League-specific official image endpoints
  private getLeagueOfficialImage(playerId: string, sport: string): string {
    switch (sport) {
      case 'NBA':
        return `https://cdn.nba.com/headshots/nba/latest/1040x760/${playerId}.png`;
      case 'NFL':
        return `https://static.www.nfl.com/image/private/f_auto,q_auto/league/player/${playerId}`;
      case 'NHL':
        return `https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${playerId}.jpg`;
      case 'MLB':
        return `https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/${playerId}/headshot/67/current`;
      default:
        return '';
    }
  }

  async getPlayerImage(playerId: string, playerName: string, sport: string = 'NBA'): Promise<string> {
    const cacheKey = `${playerId}-${sport}`;
    
    // Check cache first
    if (this.imageCache.has(cacheKey)) {
      return this.imageCache.get(cacheKey)!;
    }

    const imageSources = [
      this.getESPNPlayerImage(playerId, sport),
      this.getESPNAlternativeImage(playerId, sport),
      this.getLeagueOfficialImage(playerId, sport)
    ];

    // Try each image source
    for (const imageUrl of imageSources) {
      if (!imageUrl) continue;
      
      try {
        const response = await fetch(imageUrl, { method: 'HEAD' });
        if (response.ok) {
          this.imageCache.set(cacheKey, imageUrl);
          return imageUrl;
        }
      } catch (error) {
        console.warn(`Failed to load image from ${imageUrl}:`, error);
      }
    }

    // Try name-based lookup as fallback
    const nameBasedId = this.getPlayerIdFromName(playerName, sport);
    if (nameBasedId && nameBasedId !== playerId) {
      try {
        const fallbackImage = await this.getPlayerImage(nameBasedId, playerName, sport);
        if (fallbackImage) {
          this.imageCache.set(cacheKey, fallbackImage);
          return fallbackImage;
        }
      } catch (error) {
        console.warn('Fallback image lookup failed:', error);
      }
    }

    // Return empty string if no image found
    return '';
  }

  // Enhanced player name to ID mapping for multiple sports
  private getPlayerIdFromName(playerName: string, sport: string): string | null {
    const nameToIdMaps = {
      'NBA': {
        'LeBron James': '1966',
        'Stephen Curry': '3975',
        'Kevin Durant': '3202',
        'Giannis Antetokounmpo': '3032977',
        'Luka Doncic': '4066648',
        'Jayson Tatum': '4066261',
        'Nikola Jokic': '3112335',
        'Joel Embiid': '3059318',
        'Kawhi Leonard': '6450',
        'Paul George': '4251',
        'Anthony Davis': '6583',
        'Damian Lillard': '6606',
        'Jimmy Butler': '6430',
        'Trae Young': '4278073',
        'Ja Morant': '4279888',
        'Zion Williamson': '4396993',
        'Donovan Mitchell': '4066421',
        'Devin Booker': '3917376',
        'Karl-Anthony Towns': '4066259',
        'Rudy Gobert': '3032976'
      },
      'NFL': {
        'Patrick Mahomes': '3139477',
        'Josh Allen': '3918298',
        'Lamar Jackson': '4038941',
        'Aaron Rodgers': '8439',
        'Tom Brady': '2330',
        'Travis Kelce': '15847',
        'Tyreek Hill': '2976499',
        'Davante Adams': '2577417'
      },
      'NHL': {
        'Connor McDavid': '4024716',
        'Nathan MacKinnon': '4024851',
        'Leon Draisaitl': '4024717',
        'Auston Matthews': '4024784',
        'Sidney Crosby': '3900'
      },
      'MLB': {
        'Mike Trout': '545361',
        'Mookie Betts': '605141',
        'Aaron Judge': '592450',
        'Ronald Acuña Jr.': '660670',
        'Shohei Ohtani': '660271'
      }
    };

    const sportMap = nameToIdMaps[sport];
    return sportMap ? (sportMap[playerName] || null) : null;
  }

  async getImageForPlayer(playerId: string, playerName: string, sport: string = 'NBA'): Promise<string> {
    // First try with the provided player ID
    if (playerId && !playerId.includes('manual')) {
      const image = await this.getPlayerImage(playerId, playerName, sport);
      if (image) return image;
    }

    // Try to get league-specific ID from player name
    const leagueId = this.getPlayerIdFromName(playerName, sport);
    if (leagueId) {
      const image = await this.getPlayerImage(leagueId, playerName, sport);
      if (image) return image;
    }

    return '';
  }

  // Clear cache for a specific player or all players
  clearCache(playerId?: string): void {
    if (playerId) {
      // Remove all cached entries for this player (across all sports)
      const keysToDelete = Array.from(this.imageCache.keys()).filter(key => key.startsWith(playerId));
      keysToDelete.forEach(key => this.imageCache.delete(key));
    } else {
      this.imageCache.clear();
    }
  }
}

export const nbaImageService = new PlayerImageService();
