import React from 'react';
import styles from './Header.module.css';
import { SoundToggle } from './ui/SoundToggle';
import { UserProfile } from '../services/DevvitService';

export interface HeaderProps {
  userProfile: UserProfile;
  currentLevel: number;
  soundEnabled: boolean;
  onSoundToggle: (enabled: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  currentLevel,
  soundEnabled,
  onSoundToggle,
}) => {
  return (
    <header className={styles.header}>
      <div className={styles.gameTitle}>
        <h1 className={styles.title}>Shape Flow</h1>
      </div>

      <div className={styles.levelIndicator}>
        <span className={styles.levelLabel}>Level</span>
        <span className={styles.levelNumber}>{currentLevel}</span>
      </div>

      <SoundToggle isEnabled={soundEnabled} onToggle={onSoundToggle} />
    </header>
  );
};
