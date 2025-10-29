import React from 'react';
import styles from './LevelSelector.module.css';

export interface LevelSelectorProps {
  currentLevel: number;
  highestLevel: number;
  onLevelSelect: (level: number) => void;
  onClose: () => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  currentLevel,
  highestLevel,
  onLevelSelect,
  onClose,
}) => {
  const maxDisplayLevels = 20; // Show up to 20 levels
  const levels = Array.from({ length: maxDisplayLevels }, (_, i) => i + 1);

  const handleLevelClick = (level: number) => {
    if (level <= highestLevel) {
      onLevelSelect(level);
      onClose();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Select Level</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className={styles.levelGrid}>
          {levels.map((level) => {
            const isUnlocked = level <= highestLevel;
            const isCurrent = level === currentLevel;
            const isCompleted = level < currentLevel;
            
            return (
              <button
                key={level}
                className={`${styles.levelButton} ${
                  isUnlocked ? styles.unlocked : styles.locked
                } ${isCurrent ? styles.current : ''} ${
                  isCompleted ? styles.completed : ''
                }`}
                onClick={() => handleLevelClick(level)}
                disabled={!isUnlocked}
              >
                <span className={styles.levelNumber}>{level}</span>
                {isCompleted && <span className={styles.checkmark}>✓</span>}
                {isCurrent && <span className={styles.currentIndicator}>●</span>}
              </button>
            );
          })}
        </div>
        
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendIcon} ${styles.completed}`}>✓</div>
            <span>Completed</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendIcon} ${styles.current}`}>●</div>
            <span>Current</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendIcon} ${styles.locked}`}>🔒</div>
            <span>Locked</span>
          </div>
        </div>
      </div>
    </div>
  );
};