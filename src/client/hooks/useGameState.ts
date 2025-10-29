import { useState, useCallback } from 'react';
import { PuzzlePiece } from '../services/PuzzleGenerator';

export interface GameState {
  currentLevel: number;
  pieces: PuzzlePiece[];
  isComplete: boolean;
  isSoundEnabled: boolean;
  startTime: number;
  completionTime: number | null;
  moves: number;
}

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 1,
    pieces: [],
    isComplete: false,
    isSoundEnabled: true,
    startTime: Date.now(),
    completionTime: null,
    moves: 0,
  });

  const setPieces = useCallback((pieces: PuzzlePiece[]) => {
    setGameState((prev) => ({
      ...prev,
      pieces,
      isComplete: false,
      startTime: Date.now(),
      completionTime: null,
      moves: 0,
    }));
  }, []);

  const handlePieceRotate = useCallback((pieceId: string, rotationIncrement: number) => {
    setGameState((prev) => {
      const updatedPieces = prev.pieces.map((piece) => {
        if (piece.id === pieceId) {
          const newRotation = piece.currentRotation + rotationIncrement;
          const isCorrectRotation = newRotation % 360 === piece.correctRotation % 360;
          
          return {
            ...piece,
            currentRotation: newRotation,
            // Move to correct position if rotation is correct, otherwise keep current position
            position: isCorrectRotation ? piece.correctPosition : piece.position,
          };
        }
        return piece;
      });

      // Check if puzzle is complete
      const allCorrect = updatedPieces.every(
        (piece) => piece.currentRotation % 360 === piece.correctRotation % 360
      );

      return {
        ...prev,
        pieces: updatedPieces,
        moves: prev.moves + 1,
        isComplete: allCorrect,
        completionTime: allCorrect ? Date.now() - prev.startTime : null,
      };
    });
  }, []);

  const setLevel = useCallback((level: number) => {
    setGameState((prev) => ({
      ...prev,
      currentLevel: level,
    }));
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setGameState((prev) => ({
      ...prev,
      isSoundEnabled: enabled,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      currentLevel: 1,
      pieces: [],
      isComplete: false,
      isSoundEnabled: gameState.isSoundEnabled,
      startTime: Date.now(),
      completionTime: null,
      moves: 0,
    });
  }, [gameState.isSoundEnabled]);

  const restartLevel = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isComplete: false,
      startTime: Date.now(),
      completionTime: null,
      moves: 0,
    }));
  }, []);

  const advanceLevel = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      currentLevel: prev.currentLevel + 1,
      pieces: [], // Clear pieces to force regeneration
      isComplete: false,
      startTime: Date.now(),
      completionTime: null,
      moves: 0,
    }));
  }, []);

  return {
    gameState,
    setPieces,
    handlePieceRotate,
    setLevel,
    setSoundEnabled,
    resetGame,
    restartLevel,
    advanceLevel,
  };
};
