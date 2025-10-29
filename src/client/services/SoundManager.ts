export interface SoundConfig {
  volume: number;
  enabled: boolean;
}

export interface SoundAssets {
  rotate: string;
  success: string;
  mute: string;
  unmute: string;
  backgroundMusic: string;
}

export class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private backgroundMusic: HTMLAudioElement | null = null;
  private config: SoundConfig = { volume: 0.7, enabled: true };
  private initialized = false;

  async initialize(assets: SoundAssets): Promise<void> {
    if (this.initialized) return;

    try {
      // Initialize Web Audio API for sound effects
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // For now, we'll use simple beep sounds generated programmatically
      // In production, you'd load actual audio files
      await this.createSynthSounds();

      // Initialize background music (silent for now, can be replaced with actual music)
      this.backgroundMusic = new Audio();
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = this.config.volume * 0.3; // Lower volume for background

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize sound system:', error);
      this.config.enabled = false;
    }
  }

  private async createSynthSounds(): Promise<void> {
    if (!this.audioContext) return;

    // Create simple synthesized sounds
    const sampleRate = this.audioContext.sampleRate;

    // Rotate sound - short click
    this.sounds.set('rotate', this.createClickSound(sampleRate, 0.05));

    // Success sound - ascending tones
    this.sounds.set('success', this.createSuccessSound(sampleRate, 0.5));

    // Mute/unmute sounds - short beeps
    this.sounds.set('mute', this.createBeepSound(sampleRate, 0.1, 400));
    this.sounds.set('unmute', this.createBeepSound(sampleRate, 0.1, 600));
  }

  private createClickSound(sampleRate: number, duration: number): AudioBuffer {
    if (!this.audioContext) throw new Error('AudioContext not initialized');

    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      data[i] = Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 20);
    }

    return buffer;
  }

  private createSuccessSound(sampleRate: number, duration: number): AudioBuffer {
    if (!this.audioContext) throw new Error('AudioContext not initialized');

    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    const noteDuration = duration / notes.length;

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const noteIndex = Math.floor(t / noteDuration);
      const freq = notes[Math.min(noteIndex, notes.length - 1)];
      const envelope = Math.exp(-(t % noteDuration) * 5);
      data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.3;
    }

    return buffer;
  }

  private createBeepSound(sampleRate: number, duration: number, frequency: number): AudioBuffer {
    if (!this.audioContext) throw new Error('AudioContext not initialized');

    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 10) * 0.3;
    }

    return buffer;
  }

  playSound(soundName: string): void {
    if (!this.config.enabled || !this.audioContext || !this.initialized) return;

    const buffer = this.sounds.get(soundName);
    if (!buffer) {
      console.warn(`Sound "${soundName}" not found`);
      return;
    }

    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = buffer;
      gainNode.gain.value = this.config.volume;

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      source.start(0);
    } catch (error) {
      console.error('Failed to play sound:', error);
    }
  }

  toggleBackgroundMusic(enabled: boolean): void {
    if (!this.backgroundMusic) return;

    if (enabled && this.config.enabled) {
      this.backgroundMusic.play().catch((error) => {
        console.error('Failed to play background music:', error);
      });
    } else {
      this.backgroundMusic.pause();
    }
  }

  setVolume(volume: number): void {
    this.config.volume = Math.max(0, Math.min(1, volume));

    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.config.volume * 0.3;
    }
  }

  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;

    if (!enabled && this.backgroundMusic) {
      this.backgroundMusic.pause();
    }
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }
}
