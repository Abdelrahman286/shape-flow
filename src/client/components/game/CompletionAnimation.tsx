import React, { useEffect, useState } from 'react';
import styles from './CompletionAnimation.module.css';

export interface CompletionAnimationProps {
  nextLevel: number;
  onComplete: () => void;
}

export const CompletionAnimation: React.FC<CompletionAnimationProps> = ({
  nextLevel,
  onComplete,
}) => {
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; y: number; delay: number; color: string }>>([]);

  useEffect(() => {
    // Generate confetti particles
    const particles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      delay: Math.random() * 0.5,
      color: ['#4ade80', '#22c55e', '#10b981', '#34d399', '#6ee7b7'][Math.floor(Math.random() * 5)],
    }));
    setConfetti(particles);

    // Trigger completion callback after animation
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div className={styles.successIcon}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="35" fill="#22c55e" className={styles.circle} />
            <path
              d="M 25 40 L 35 50 L 55 30"
              stroke="white"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.checkmark}
            />
          </svg>
        </div>
        <h2 className={styles.title}>Puzzle Complete!</h2>
        <p className={styles.subtitle}>Get ready for Level {nextLevel}</p>
      </div>
      
      {confetti.map((particle) => (
        <div
          key={particle.id}
          className={styles.confetti}
          style={{
            left: `${particle.x}%`,
            animationDelay: `${particle.delay}s`,
            backgroundColor: particle.color,
          }}
        />
      ))}
    </div>
  );
};
