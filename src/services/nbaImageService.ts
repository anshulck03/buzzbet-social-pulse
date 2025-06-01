
interface NBAPlayerImage {
  playerId: string;
  imageUrl: string;
  source: 'espn' | 'nba' | 'fallback';
}

class NBAImageService {
  private imageCache = new Map<string, string>();

  // ESPN player image URLs follow a predictable pattern
  private getESPNPlayerImage(playerId: string): string {
    return `https://a.espncdn.com/i/headshots/nba/players/full/${playerId}.png`;
  }

  // NBA.com also has player images
  private getNBAPlayerImage(playerId: string): string {
    return `https://cdn.nba.com/headshots/nba/latest/1040x760/${playerId}.png`;
  }

  // Alternative ESPN endpoint
  private getESPNAlternativeImage(playerId: string): string {
    return `https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/${playerId}.png&w=350&h=254`;
  }

  async getPlayerImage(playerId: string, playerName: string): Promise<string> {
    // Check cache first
    if (this.imageCache.has(playerId)) {
      return this.imageCache.get(playerId)!;
    }

    const imageSources = [
      this.getESPNPlayerImage(playerId),
      this.getESPNAlternativeImage(playerId),
      this.getNBAPlayerImage(playerId)
    ];

    // Try each image source
    for (const imageUrl of imageSources) {
      try {
        const response = await fetch(imageUrl, { method: 'HEAD' });
        if (response.ok) {
          this.imageCache.set(playerId, imageUrl);
          return imageUrl;
        }
      } catch (error) {
        console.warn(`Failed to load image from ${imageUrl}:`, error);
      }
    }

    // Return empty string if no image found
    return '';
  }

  // For manual overrides, we can map known player names to their ESPN IDs
  private getPlayerIdFromName(playerName: string): string | null {
    const nameToIdMap: Record<string, string> = {
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
    };

    return nameToIdMap[playerName] || null;
  }

  async getImageForPlayer(playerId: string, playerName: string): Promise<string> {
    // First try with the provided player ID
    if (playerId && !playerId.includes('manual')) {
      const image = await this.getPlayerImage(playerId, playerName);
      if (image) return image;
    }

    // Try to get ESPN ID from player name
    const espnId = this.getPlayerIdFromName(playerName);
    if (espnId) {
      const image = await this.getPlayerImage(espnId, playerName);
      if (image) return image;
    }

    return '';
  }
}

export const nbaImageService = new NBAImageService();
