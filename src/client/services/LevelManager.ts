export interface LevelConfig {
  level: number;
  pieceCount: number;
  rotationIncrement: number;
  complexity: 'simple' | 'medium' | 'complex';
}

export class LevelManager {
  private static readonly LEVEL_PROGRESSION: LevelConfig[] = [
    // Levels 1-4: 3-6 pieces, 90-degree rotation
    { level: 1, pieceCount: 3, rotationIncrement: 90, complexity: 'simple' },
    { level: 2, pieceCount: 4, rotationIncrement: 90, complexity: 'simple' },
    { level: 3, pieceCount: 5, rotationIncrement: 90, complexity: 'simple' },
    { level: 4, pieceCount: 6, rotationIncrement: 90, complexity: 'simple' },
    
    // Levels 5-9: 7-11 pieces, 45-degree rotation
    { level: 5, pieceCount: 7, rotationIncrement: 45, complexity: 'medium' },
    { level: 6, pieceCount: 8, rotationIncrement: 45, complexity: 'medium' },
    { level: 7, pieceCount: 9, rotationIncrement: 45, complexity: 'medium' },
    { level: 8, pieceCount: 10, rotationIncrement: 45, complexity: 'medium' },
    { level: 9, pieceCount: 11, rotationIncrement: 45, complexity: 'medium' },
    
    // Levels 10+: 12+ pieces, 30-degree rotation
    { level: 10, pieceCount: 12, rotationIncrement: 30, complexity: 'complex' },
    { level: 11, pieceCount: 13, rotationIncrement: 30, complexity: 'complex' },
    { level: 12, pieceCount: 14, rotationIncrement: 30, complexity: 'complex' },
    { level: 13, pieceCount: 15, rotationIncrement: 30, complexity: 'complex' },
    { level: 14, pieceCount: 16, rotationIncrement: 30, complexity: 'complex' },
    { level: 15, pieceCount: 17, rotationIncrement: 30, complexity: 'complex' },
  ];

  static getLevelConfig(level: number): LevelConfig {
    // If level is beyond predefined configs, generate dynamically
    if (level <= this.LEVEL_PROGRESSION.length) {
      return this.LEVEL_PROGRESSION[level - 1];
    }
    
    // For levels beyond 15, continue increasing piece count
    const pieceCount = 17 + (level - 15);
    return {
      level,
      pieceCount,
      rotationIncrement: 30,
      complexity: 'complex',
    };
  }

  static getMaxLevel(): number {
    return 100; // Arbitrary max level
  }
}
