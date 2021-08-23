/**
 * User Activity holds the information needed inorder to follow user activity
 */
 export class Timer {
  totalSeconds: number;
  interval: any;

  constructor() {
    this.totalSeconds = 0;
  }

  setInterval(): void {
    this.interval = setInterval(() => this.increaseTimer(), 1000);
  }

  increaseTimer(): void{
    this.totalSeconds++;
  }

  getTotalSeconds(): number {
    return this.totalSeconds;
  }

  clearTimer(): void {
    if (this.interval) {
      clearInterval(this.interval);
   }
  }
}
