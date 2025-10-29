import React from 'react';
import styles from './SoundToggle.module.css';

export interface SoundToggleProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const SoundToggle: React.FC<SoundToggleProps> = ({ isEnabled, onToggle }) => {
  return (
    <button
      className={`${styles.toggle} ${isEnabled ? styles.enabled : styles.disabled}`}
      onClick={() => onToggle(!isEnabled)}
      aria-label={isEnabled ? 'Mute sound' : 'Unmute sound'}
    >
      <div className={styles.lever}>
        <div className={styles.handle} />
      </div>
      <div className={styles.icon}>
        {isEnabled ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
            <path d="M15.54 8.46a5 5 0 010 7.07M18.07 5.93a9 9 0 010 12.73" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
            <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </div>
    </button>
  );
};
