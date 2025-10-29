import React from 'react';
import styles from './LeaderboardPanel.module.css';

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  score: number;
  completionTime: number;
}

export interface LeaderboardPanelProps {
  entries: LeaderboardEntry[];
  currentUser: string;
  onClose: () => void;
}

export const LeaderboardPanel: React.FC<LeaderboardPanelProps> = ({
  entries,
  currentUser,
  onClose,
}) => {
  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Leaderboard</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>
        <div className={styles.entries}>
          {entries.map((entry) => (
            <div
              key={entry.rank}
              className={`${styles.entry} ${
                entry.username === currentUser ? styles.currentUser : ''
              }`}
            >
              <div className={styles.rank}>#{entry.rank}</div>
              <div className={styles.avatar}>
                <img src={entry.avatar} alt={entry.username} />
              </div>
              <div className={styles.info}>
                <div className={styles.username}>{entry.username}</div>
                <div className={styles.time}>{formatTime(entry.completionTime)}</div>
              </div>
              <div className={styles.score}>{entry.score}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
