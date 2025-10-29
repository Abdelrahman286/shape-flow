import React from 'react';
import styles from './RotationIndicator.module.css';

export interface RotationIndicatorProps {
  currentRotation: number;
  correctRotation: number;
  rotationIncrement: number;
}

export const RotationIndicator: React.FC<RotationIndicatorProps> = ({
  currentRotation,
  correctRotation,
  rotationIncrement,
}) => {
  const normalizeRotation = (rotation: number): number => {
    return ((rotation % 360) + 360) % 360;
  };

  const current = normalizeRotation(currentRotation);
  const correct = normalizeRotation(correctRotation);
  
  const diff = Math.min(
    Math.abs(current - correct),
    360 - Math.abs(current - correct)
  );

  const getColor = (): string => {
    if (diff === 0) return '#22c55e'; // Green - correct
    if (diff <= rotationIncrement) return '#eab308'; // Yellow - close
    return '#ef4444'; // Red - far
  };

  const progress = ((360 - diff) / 360) * 100;

  return (
    <div className={styles.indicator}>
      <svg width="60" height="60" viewBox="0 0 60 60">
        <circle
          cx="30"
          cy="30"
          r="24"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="4"
        />
        <circle
          cx="30"
          cy="30"
          r="24"
          fill="none"
          stroke={getColor()}
          strokeWidth="4"
          strokeDasharray={`${2 * Math.PI * 24}`}
          strokeDashoffset={`${2 * Math.PI * 24 * (1 - progress / 100)}`}
          strokeLinecap="round"
          transform="rotate(-90 30 30)"
          className={styles.progressCircle}
        />
      </svg>
    </div>
  );
};
