import { useEffect, useRef, useState } from 'react';
import { SoundManager } from '../services/SoundManager';

const SOUND_PREFERENCE_KEY = 'puzzle_game_sound_enabled';

export const useSound = () => {
  const soundManagerRef = useRef<SoundManager | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    // Load sound preference from localStorage
    const saved = localStorage.getItem(SOUND_PREFERENCE_KEY);
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    const initSound = async () => {
      soundManagerRef.current = new SoundManager();
      await soundManagerRef.current.initialize({
        rotate: '',
        success: '',
        mute: '',
        unmute: '',
        backgroundMusic: '',
      });
      
      // Apply saved preference
      soundManagerRef.current.setEnabled(soundEnabled);
    };

    initSound();
  }, [soundEnabled]);

  const playRotateSound = () => {
    soundManagerRef.current?.playSound('rotate');
  };

  const playSuccessSound = () => {
    soundManagerRef.current?.playSound('success');
  };

  const playMuteSound = () => {
    soundManagerRef.current?.playSound('mute');
  };

  const playUnmuteSound = () => {
    soundManagerRef.current?.playSound('unmute');
  };

  const toggleBackgroundMusic = (enabled: boolean) => {
    soundManagerRef.current?.toggleBackgroundMusic(enabled);
  };

  const setEnabled = (enabled: boolean) => {
    soundManagerRef.current?.setEnabled(enabled);
    setSoundEnabled(enabled);
    
    // Persist to localStorage
    localStorage.setItem(SOUND_PREFERENCE_KEY, enabled.toString());
    
    if (enabled) {
      playUnmuteSound();
    } else {
      playMuteSound();
    }
  };

  const isEnabled = () => {
    return soundEnabled;
  };

  return {
    playRotateSound,
    playSuccessSound,
    playMuteSound,
    playUnmuteSound,
    toggleBackgroundMusic,
    setEnabled,
    isEnabled,
    soundEnabled,
  };
};
