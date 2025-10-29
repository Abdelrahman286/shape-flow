export interface UserProfile {
  username: string;
  avatar: string;
  karma: number;
}

export interface ProgressData {
  userId: string;
  currentLevel: number;
  highestLevel: number;
  totalCompletions: number;
  bestTime: number;
  soundEnabled: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  score: number;
  completionTime: number;
}

export class DevvitService {
  private baseUrl: string;
  private postId: string;

  constructor(postId: string) {
    this.postId = postId;
    this.baseUrl = '/api';
  }

  async getUserProfile(): Promise<UserProfile> {
    try {
      const response = await fetch(`${this.baseUrl}/user-profile`);
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Return default placeholder
      return {
        username: 'Player',
        avatar: '/default-avatar.png',
        karma: 0,
      };
    }
  }

  async saveProgress(data: ProgressData): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/save-progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save progress');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      // Fallback to localStorage
      localStorage.setItem('puzzle_game_progress', JSON.stringify(data));
    }
  }

  async loadProgress(): Promise<ProgressData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/load-progress`);
      if (!response.ok) {
        throw new Error('Failed to load progress');
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading progress:', error);
      // Fallback to localStorage
      const saved = localStorage.getItem('puzzle_game_progress');
      return saved ? JSON.parse(saved) : null;
    }
  }

  async updateLeaderboard(score: number, time: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/update-leaderboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score, time }),
      });

      if (!response.ok) {
        throw new Error('Failed to update leaderboard');
      }
    } catch (error) {
      console.error('Error updating leaderboard:', error);
    }
  }

  async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const response = await fetch(`${this.baseUrl}/leaderboard?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  }

  async shareAchievement(level: number, time: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/share-achievement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ level, time }),
      });

      if (!response.ok) {
        throw new Error('Failed to share achievement');
      }
    } catch (error) {
      console.error('Error sharing achievement:', error);
    }
  }
}
