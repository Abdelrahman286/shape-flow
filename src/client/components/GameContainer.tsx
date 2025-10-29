import React, { useEffect, useState } from 'react';
import styles from './GameContainer.module.css';
import { useGameState } from '../hooks/useGameState';
import { useSound } from '../hooks/useSound';
import { PuzzleGenerator } from '../services/PuzzleGenerator';
import { LevelManager } from '../services/LevelManager';
import { DevvitService } from '../services/DevvitService';
import { GameBoard } from './game/GameBoard';
import { CompletionAnimation } from './game/CompletionAnimation';
import { Header } from './Header';
import { ControlPanel } from './ControlPanel';
import { LeaderboardPanel } from './ui/LeaderboardPanel';
import { LevelSelector } from './ui/LevelSelector';

export interface GameContainerProps {
  postId: string;
}

export const GameContainer: React.FC<GameContainerProps> = ({ postId }) => {
  const {
    gameState,
    setPieces,
    handlePieceRotate,
    setLevel,
    restartLevel,
    advanceLevel,
    resetGame,
  } = useGameState();

  const {
    playRotateSound,
    playSuccessSound,
    setEnabled: setSoundEnabled,
    soundEnabled,
  } = useSound();

  const [puzzleGenerator] = useState(() => new PuzzleGenerator());
  const [devvitService] = useState(() => new DevvitService(postId));
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState({ username: 'Player', avatar: '', karma: 0 });
  const [showCompletion, setShowCompletion] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [patternShapes, setPatternShapes] = useState<string>('');
  const [showLevelSelector, setShowLevelSelector] = useState(false);
  const [highestLevel, setHighestLevel] = useState(1);

  // Load user profile and progress
  useEffect(() => {
    const loadData = async () => {
      const profile = await devvitService.getUserProfile();
      setUserProfile(profile);

      const progress = await devvitService.loadProgress();
      if (progress) {
        setLevel(progress.currentLevel);
        setHighestLevel(progress.highestLevel || progress.currentLevel);
      }
    };

    loadData();
  }, [devvitService, setLevel]);

  // Generate puzzle when level changes
  useEffect(() => {
    if (!gameStarted) return;

    const config = LevelManager.getLevelConfig(gameState.currentLevel);
    const puzzle = puzzleGenerator.generate({
      ...config,
      seed: gameState.currentLevel * 42,
    });

    setPieces(puzzle.pieces);
    setPatternShapes(puzzle.patternShapes);
  }, [gameState.currentLevel, puzzleGenerator, setPieces, gameStarted]);

  const handleStartGame = () => {
    setGameStarted(true);
    resetGame();
  };

  const handleRestartLevel = () => {
    // Reset game state first (without clearing pieces)
    restartLevel();
    
    // Then regenerate the puzzle with fresh pieces
    const config = LevelManager.getLevelConfig(gameState.currentLevel);
    const puzzle = puzzleGenerator.generate({
      ...config,
      seed: gameState.currentLevel * 42,
    });
    
    setPieces(puzzle.pieces);
    setPatternShapes(puzzle.patternShapes);
  };

  const handlePieceClick = (pieceId: string) => {
    const config = LevelManager.getLevelConfig(gameState.currentLevel);
    handlePieceRotate(pieceId, config.rotationIncrement);
    playRotateSound();
  };

  const handlePuzzleComplete = () => {
    playSuccessSound();
    setShowCompletion(true);

    // Save progress
    if (gameState.completionTime) {
      const newHighestLevel = Math.max(highestLevel, gameState.currentLevel + 1);
      setHighestLevel(newHighestLevel);
      
      devvitService.saveProgress({
        userId: userProfile.username,
        currentLevel: gameState.currentLevel + 1,
        highestLevel: newHighestLevel,
        totalCompletions: gameState.currentLevel,
        bestTime: gameState.completionTime,
        soundEnabled,
      });

      // Update leaderboard
      devvitService.updateLeaderboard(gameState.currentLevel, gameState.completionTime);

      // Share achievement for milestone levels
      if (gameState.currentLevel % 5 === 0) {
        devvitService.shareAchievement(gameState.currentLevel, gameState.completionTime);
      }
    }
  };

  const handleCompletionAnimationEnd = () => {
    setShowCompletion(false);
    advanceLevel();
  };

  const handleViewLeaderboard = async () => {
    const data = await devvitService.getLeaderboard(10);
    setLeaderboardData(data);
    setShowLeaderboard(true);
  };

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
  };

  const handleSelectLevel = () => {
    setShowLevelSelector(true);
  };

  const handleLevelSelect = (level: number) => {
    setLevel(level);
    if (gameStarted) {
      // Regenerate puzzle for the selected level
      const config = LevelManager.getLevelConfig(level);
      const puzzle = puzzleGenerator.generate({
        ...config,
        seed: level * 42,
      });
      setPieces(puzzle.pieces);
      setPatternShapes(puzzle.patternShapes);
      restartLevel();
    }
  };

  const config = LevelManager.getLevelConfig(gameState.currentLevel);

  return (
    <div className={styles.container}>
      <Header
        userProfile={userProfile}
        currentLevel={gameState.currentLevel}
        soundEnabled={soundEnabled}
        onSoundToggle={handleSoundToggle}
      />

      {!gameStarted ? (
        <div className={styles.welcome}>
          <h1 className={styles.welcomeTitle}>Shape Flow</h1>
          <p className={styles.welcomeSubtitle}>A Relaxing Stress Relief Puzzle Game</p>
          <div className={styles.instructions}>
            <h3 className={styles.instructionsTitle}>How to Play:</h3>
            <div className={styles.instructionsList}>
              <div className={styles.instructionItem}>
                <div className={styles.instructionTitle}>🎯 <strong>Press on puzzle pieces to rotate them</strong></div>
              </div>
              
              <div className={styles.instructionItem}>
                <div className={styles.instructionTitle}>🧩 <strong>Create beautiful shapes by aligning all pieces correctly</strong></div>
              
              </div>
              
              <div className={styles.instructionItem}>
                <div className={styles.instructionTitle}>✨ <strong>Relax and unwind as pieces flow into place</strong></div>
              </div>
              
              <div className={styles.instructionItem}>
                <div className={styles.instructionTitle}>🌟 <strong>Complete levels to unlock new abstract designs</strong></div>
              </div>
            </div>
          </div>
          <ControlPanel
            gameStarted={false}
            onStart={handleStartGame}
            onRestart={handleRestartLevel}
            onViewLeaderboard={handleViewLeaderboard}
            onSelectLevel={handleSelectLevel}
          />
        </div>
      ) : (
        <>
          <GameBoard
            pieces={gameState.pieces}
            patternShapes={patternShapes}
            rotationIncrement={config.rotationIncrement}
            onPieceRotate={handlePieceClick}
            onComplete={handlePuzzleComplete}
          />

          <ControlPanel
            gameStarted={true}
            onStart={handleStartGame}
            onRestart={handleRestartLevel}
            onViewLeaderboard={handleViewLeaderboard}
            onSelectLevel={handleSelectLevel}
          />
        </>
      )}

      {showCompletion && (
        <CompletionAnimation
          nextLevel={gameState.currentLevel + 1}
          onComplete={handleCompletionAnimationEnd}
        />
      )}

      {showLeaderboard && (
        <LeaderboardPanel
          entries={leaderboardData}
          currentUser={userProfile.username}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {showLevelSelector && (
        <LevelSelector
          currentLevel={gameState.currentLevel}
          highestLevel={highestLevel}
          onLevelSelect={handleLevelSelect}
          onClose={() => setShowLevelSelector(false)}
        />
      )}
    </div>
  );
};
