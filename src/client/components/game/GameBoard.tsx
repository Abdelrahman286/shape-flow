import React, { useEffect, useState } from 'react';
import styles from './GameBoard.module.css';
import { PuzzlePiece } from './PuzzlePiece';
import { PuzzlePiece as PuzzlePieceType } from '../../services/PuzzleGenerator';

export interface GameBoardProps {
  pieces: PuzzlePieceType[];
  patternShapes: string;
  rotationIncrement: number;
  onPieceRotate: (pieceId: string) => void;
  onComplete: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  pieces,
  patternShapes,
  rotationIncrement,
  onPieceRotate,
  onComplete,
}) => {
  const [isComplete, setIsComplete] = useState(false);

  // Reset completion state when pieces change (new level)
  useEffect(() => {
    setIsComplete(false);
  }, [pieces]);

  useEffect(() => {
    const checkCompletion = () => {
      const allCorrect = pieces.every(
        (piece) => piece.currentRotation % 360 === piece.correctRotation % 360
      );

      if (allCorrect && pieces.length > 0 && !isComplete) {
        setTimeout(() => {
          setIsComplete(true);
          onComplete();
        }, 100);
      }
    };

    checkCompletion();
  }, [pieces, onComplete, isComplete]);

  return (
    <div className={styles.board}>
      <div className={styles.puzzleContainer}>
        {pieces.map((piece) => (
          <PuzzlePiece
            key={piece.id}
            piece={piece}
            patternShapes={patternShapes}
            rotationIncrement={rotationIncrement}
            onRotate={onPieceRotate}
            isComplete={isComplete}
          />
        ))}
      </div>
    </div>
  );
};
