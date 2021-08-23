import { UserActivity } from './../objects/user-activity';
import { LayoutService } from 'src/app/services/layout.service';
import { Injectable } from '@angular/core';
import { Timer } from '../objects/timer';
import { LoopPad } from '../objects/loop-pad';

@Injectable({
  providedIn: 'root'
})
export class UserActivityService {

  private timer!: Timer;

  private recordModeOn = false;

  private switchStates = false;

  public userActivities: UserActivity[] = [];

  private pauseAllLoops!: (loops: LoopPad[]) => void;
  private pauseSingleLoop!: (loop: LoopPad) => void;
  private playAllLoops!: (loops: LoopPad[]) => void;
  private loadSingleLoop!: (loop: LoopPad) => void;

  constructor(private layoutService: LayoutService) { }

  onPauseAllLoops(fn: (loops: LoopPad[]) => void): void {
    this.pauseAllLoops = fn;
  }

  onPauseSingleLoop(fn: (loop: LoopPad) => void): void {
    this.pauseSingleLoop = fn;
  }

  onPlayAllLoops(fn: (loops: LoopPad[]) => void): void {
    this.playAllLoops = fn;
  }

  onLoadSingleLoop(fn: (loop: LoopPad) => void): void {
    this.loadSingleLoop = fn;
  }

  startRecordSession(): void {
    this.userActivities = [];
    this.timer = new Timer();
    this.timer.setInterval();
    this.recordModeOn = true;
    this.switchStates = true;
  }

  addUserActivity(loops: LoopPad[], funcName: string): void {
    this.userActivities.push(new UserActivity(this.timer.getTotalSeconds(), loops, funcName));
  }

  endRecordSession(): void {
    this.timer.clearTimer();
    this.recordModeOn = false;
  }

  isRecordOver(): boolean {
    return !this.recordModeOn && this.switchStates;
  }

  getUserActivityMode(): boolean {
    return this.recordModeOn;
  }

  isRecordExists(): boolean {
    return this.userActivities.length > 0;
  }

  playSession(): void {
    const loadSingleLoopStack: LoopPad[] = [];

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.userActivities.length; i++) {
      const userActivity = this.userActivities[i];
      const tempThis = this;
      if (userActivity.loops.length > 0) {
        switch (userActivity.actionFunction) {
          case 'pauseAllLoops' :
            for (const loop of userActivity.loops) {
              this.loadLoopIfNeeded(loadSingleLoopStack, loop);
            }
            let timeOut = 0;
            if (i === 0) {
              this.playAllLoops(userActivity.loops);
              timeOut = userActivity.actionTimeSeconds * 1000;
            } else {
              timeOut = (userActivity.actionTimeSeconds - this.userActivities[i - 1].actionTimeSeconds) * 1000;
            }
            setTimeout(
              () => {
              tempThis.pauseAllLoops(userActivity.loops);
            }, timeOut);
            break;
          case 'pauseSingleLoop':
            const loopPad: LoopPad = userActivity.loops[0];
            this.loadLoopIfNeeded(loadSingleLoopStack, loopPad);
            timeOut = 0;
            if (i === 0) {
              this.playAllLoops(userActivity.loops);
              timeOut = userActivity.actionTimeSeconds * 1000;
            } else {
              timeOut = (userActivity.actionTimeSeconds - this.userActivities[i - 1].actionTimeSeconds) * 1000;
            }
            setTimeout(
              () => {
              tempThis.pauseSingleLoop(loopPad);
            }, timeOut);
            break;
          case 'playAllLoops':
            for (const loop of userActivity.loops) {
              this.loadLoopIfNeeded(loadSingleLoopStack, loop);
            }
            this.playAllLoops(userActivity.loops);
            break;
          case 'loadSingleLoop':
            const lp: LoopPad = userActivity.loops[0];
            this.loadLoopIfNeeded(loadSingleLoopStack, lp);
            break;
        }
      }
    }
  }

  private loadLoopIfNeeded(loadSingleLoopStack: LoopPad[], loop: LoopPad): void {
    if (!loadSingleLoopStack.includes(loop)) {
      if (this.layoutService.playingLoops === undefined ||
        !this.layoutService.playingLoops.includes(loop)) { // the loop wasn't played
        loadSingleLoopStack.push(loop);
        this.loadSingleLoop(loop);
      }
    }
  }
}
