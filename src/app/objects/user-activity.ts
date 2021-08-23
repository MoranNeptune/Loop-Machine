import { LoopPad } from './loop-pad';

/**
 * User Activity holds the information needed inorder to follow user activity
 */
export class UserActivity {
  actionTimeSeconds: number;
  loops: LoopPad[];
  actionFunction: string;
  durationLoopTime?: number;

  constructor(actionTimeSeconds: number, loops: LoopPad[], actionFunction: string, durationLoopTime?: number) {
    this.actionTimeSeconds = actionTimeSeconds;
    this.loops = loops;
    this.actionFunction = actionFunction;
    this.durationLoopTime = durationLoopTime;
  }
}
