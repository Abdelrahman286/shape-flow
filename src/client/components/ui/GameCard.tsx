import React from 'react';
import styles from './GameCard.module.css';

export interface GameCardProps {
  children: React.ReactNode;
  glowColor?: string;
  padding?: string;
}

export const GameCard: React.FC<GameCardProps> = ({
  children,
  glowColor = '#4ade80',
  padding = '24px',
}) => {
  return (
    <div
      className={styles.card}
      style={{
        boxShadow: `0 0 20px ${glowColor}40, inset 0 2px 4px rgba(0, 0, 0, 0.1)`,
        padding,
      }}
    >
      {children}
    </div>
  );
};
