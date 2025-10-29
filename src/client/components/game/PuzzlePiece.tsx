import React from 'react';
import styles from './PuzzlePiece.module.css';
import { PuzzlePiece as PuzzlePieceType } from '../../services/PuzzleGenerator';

export interface PuzzlePieceProps {
  piece: PuzzlePieceType;
  patternShapes: string;
  onRotate: (pieceId: string) => void;
  isComplete: boolean;
}

export const PuzzlePiece: React.FC<PuzzlePieceProps> = ({
  piece,
  patternShapes,
  onRotate,
  isComplete,
}) => {
  const handleClick = () => {
    if (!isComplete) {
      onRotate(piece.id);
    }
  };

  const isCorrect = piece.currentRotation % 360 === piece.correctRotation % 360;
  const isInCorrectPosition = isCorrect && 
    Math.abs(piece.position.x - piece.correctPosition.x) < 5 && 
    Math.abs(piece.position.y - piece.correctPosition.y) < 5;

  return (
    <div
      className={`${styles.piece} ${isComplete ? styles.locked : ''} ${
        isCorrect ? styles.correct : ''
      } ${isInCorrectPosition ? styles.correctPosition : ''}`}
      style={{
        left: `${(piece.position.x / 400) * 100}%`,
        top: `${(piece.position.y / 400) * 100}%`,
        pointerEvents: 'none', // Disable click on container
      }}
    >
      {/* Single SVG that rotates as a whole */}
      <div
        className={styles.rotatingOverlay}
        style={{
          transform: `rotate(${piece.currentRotation}deg)`,
          pointerEvents: 'none', // Disable click on rotating container
        }}
      >
        <svg
          viewBox="0 0 400 400"
          className={styles.overlaySvg}
          style={{ pointerEvents: 'none' }} // Disable click on SVG
        >
          <defs>
            <clipPath id={`clip-${piece.id}`}>
              <path d={piece.svgPath} />
            </clipPath>
          </defs>
          
          {/* Background pattern clipped to piece shape */}
          <g clipPath={`url(#clip-${piece.id})`}>
            <rect width="400" height="400" fill="#f0fdf4" />
            <g dangerouslySetInnerHTML={{ __html: patternShapes }} />
          </g>
          
          {/* Clickable piece shape - this is what responds to clicks */}
          <path
            d={piece.svgPath}
            fill={isCorrect ? 'rgba(34, 197, 94, 0.1)' : 'rgba(100, 116, 139, 0.1)'}
            stroke={isCorrect ? '#22c55e' : '#64748b'}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{ 
              pointerEvents: isComplete ? 'none' : 'all',
              cursor: isComplete ? 'default' : 'pointer'
            }}
            onClick={handleClick}
          />
        </svg>
      </div>
    </div>
  );
};
