import React from 'react';
import styles from './ControlPanel.module.css';
import { Button } from './ui/Button';

export interface ControlPanelProps {
  gameStarted: boolean;
  onStart: () => void;
  onRestart: () => void;
  onViewLeaderboard: () => void;
  onSelectLevel: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  gameStarted,
  onStart,
  onRestart,
  onViewLeaderboard,
  onSelectLevel,
}) => {
  return (
    <div className={styles.panel}>
      {!gameStarted ? (
        <Button label="Start Game" onClick={onStart} variant="primary" />
      ) : (
        <Button label="Restart Level" onClick={onRestart} variant="secondary" />
      )}
      <Button label="Select Level" onClick={onSelectLevel} variant="secondary" />
      <Button label="View Leaderboard" onClick={onViewLeaderboard} variant="secondary" />
    </div>
  );
};
