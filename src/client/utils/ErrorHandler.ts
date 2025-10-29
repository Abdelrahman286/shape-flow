export interface GameError {
  type: 'devvit' | 'game' | 'audio' | 'unknown';
  message: string;
  recoverable: boolean;
}

export class ErrorHandler {
  private retryAttempts: Map<string, number> = new Map();
  private maxRetries = 3;
  private baseDelay = 1000;

  handle(error: GameError): void {
    console.error(`[${error.type}] ${error.message}`);

    if (!error.recoverable) {
      this.showFatalError(error);
    } else {
      this.showRecoverableError(error);
      this.attemptRecovery(error);
    }
  }

  private showFatalError(error: GameError): void {
    // In a real implementation, this would show a modal or toast
    console.error('Fatal error:', error.message);
    alert(`Fatal Error: ${error.message}\n\nPlease refresh the page.`);
  }

  private showRecoverableError(error: GameError): void {
    // In a real implementation, this would show a toast notification
    console.warn('Recoverable error:', error.message);
  }

  private async attemptRecovery(error: GameError): Promise<void> {
    const key = `${error.type}-${error.message}`;
    const attempts = this.retryAttempts.get(key) || 0;

    if (attempts >= this.maxRetries) {
      this.showFatalError({
        ...error,
        recoverable: false,
        message: `${error.message} (max retries exceeded)`,
      });
      return;
    }

    this.retryAttempts.set(key, attempts + 1);

    switch (error.type) {
      case 'devvit':
        await this.retryWithBackoff(attempts);
        break;
      case 'game':
        // Reset to last known good state
        console.log('Attempting to reset game state...');
        break;
      case 'audio':
        // Disable audio and continue
        console.log('Disabling audio system...');
        break;
      default:
        console.log('Unknown error type, no recovery action available');
    }
  }

  private async retryWithBackoff(attempt: number): Promise<void> {
    const delay = this.baseDelay * Math.pow(2, attempt);
    console.log(`Retrying in ${delay}ms...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  clearRetryAttempts(errorKey: string): void {
    this.retryAttempts.delete(errorKey);
  }

  static createError(
    type: GameError['type'],
    message: string,
    recoverable: boolean = true
  ): GameError {
    return { type, message, recoverable };
  }
}
