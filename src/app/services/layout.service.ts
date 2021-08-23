import { UserActivityService } from './user-activity.service';
import { LoopPad } from './../objects/loop-pad';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  // holds the connection between loopName(key) to the suitable HTMLAudioElement
  public audioPerName = new Map<string, HTMLAudioElement>();

  // holds the current playing loops
  public playingLoops: LoopPad[] = [];

  // holds the loops that are waiting for new loop cycle to start
  public waitingLoops: LoopPad[] = [];

  // holds a promise for each loop in playingLoops that will resolve when the loop ends
  private audioPrms: Promise<any>[] = [];

  private audioPrmsPerLoop: Map<LoopPad, Promise<any>> = new Map<LoopPad, Promise<any>>();

  constructor(private userActivityService: UserActivityService) {
  }

  // play all loop pads together
  playAllLoops(playingLoops: LoopPad[]): void {
    if (this.userActivityService.getUserActivityMode()) {
      this.userActivityService.addUserActivity(playingLoops, 'playAllLoops');
    }
    this.playingLoops = playingLoops;
    console.log('playing loops:' + playingLoops.length);
    for (const loop of playingLoops) {
      this.startLoop(loop);
    }
    this.waitingLoops.splice(0, this.waitingLoops.length);
  }

  // updating single loop to on-mode
  private startLoop(loop: LoopPad): void {
    const loopSrc = loop.loopPadSrc;
    this.playAudio(loop, loopSrc);
  }

  // initialize single audio
  private playAudio(loop: LoopPad, loopSrc: string): void{
    const currAudio = this.audioPerName.get(loop.loopName);
    if (currAudio === undefined) {
      const audio = new Audio();
      audio.src = loopSrc;
      this.audioPerName.set(loop.loopName, audio);
      audio.load();
    }
    if (!this.isPlaying(this.audioPerName.get(loop.loopName))) {
      this.activateAudio(this.audioPerName.get(loop.loopName), loop);
    }
  }

  private isPlaying(audio: any): boolean {
    return !audio.paused;
  }

  // activate single audio
  private activateAudio(audio: any, loop: LoopPad): void{
    audio.play();
    const currAudioPrm = new Promise((res, rej) => {
      audio.onended = () => {
        res('audio finished');
      };
    });
    this.audioPrms.push(currAudioPrm);
    this.audioPrmsPerLoop.set(loop, currAudioPrm);
    Promise.all(this.audioPrms).then(() => {
      this.startNewLoopCycle();
    });
  }

  private startNewLoopCycle(): any {
    // this.playingLoops = this.playingLoops.concat(this.waitingLoops);
    for (const loop of this.waitingLoops) {
      if (!this.playingLoops.includes(loop)) {
        this.playingLoops.push(loop);
      }
    }
    this.audioPrms.splice(0, this.audioPrms.length);
    this.audioPrmsPerLoop.clear();
    this.playAllLoops(this.playingLoops);
  }

  // pause all loop pads together
  pauseAllLoops(): void {
    if (this.userActivityService.getUserActivityMode()) {
      this.userActivityService.addUserActivity(this.playingLoops, 'pauseAllLoops');
    }
    for (const loop of this.playingLoops) {
      this.pauseSingleLoop(loop, false);
    }
  }

  pauseSomeLoops(loops: LoopPad[]): void {
    if (this.userActivityService.getUserActivityMode()) {
      this.userActivityService.addUserActivity(loops, 'pauseAllLoops');
    }
    for (const loop of loops) {
      this.pauseSingleLoop(loop, false);
    }
  }

  // updating single loop to off-mode
  pauseSingleLoop(loop: LoopPad, isEndLoopSingleSrc: boolean): void {
    const currAudio = this.audioPerName.get(loop.loopName);
    if (this.userActivityService.getUserActivityMode() && isEndLoopSingleSrc) {
      if (currAudio !== undefined) {
         this.userActivityService.addUserActivity([loop], 'pauseSingleLoop');
      }
    }
    if (this.waitingLoops.includes(loop)) {
      this.waitingLoops = this.waitingLoops.filter(loopPad => loopPad !== loop);
    }
    if (currAudio !== undefined) {
      currAudio.pause();
      currAudio.currentTime = 0;
    }
    this.playingLoops = this.playingLoops.filter(loopPad => loopPad.loopName !== loop.loopName);

    const audioPrm = this.audioPrmsPerLoop.get(loop);
    this.audioPrms = this.audioPrms.filter(promise => promise !== audioPrm);
    this.audioPrmsPerLoop.delete(loop);

    if (this.audioPrms.length > 0) {
      Promise.all(this.audioPrms).then(() => {
        this.startNewLoopCycle();
      });
    }
  }

  startRecordSession(): void {
    this.userActivityService.startRecordSession();
  }

  endRecordSession(): void {
    this.userActivityService.endRecordSession();
  }

  playSession(): void {
    this.initLayout();
    this.userActivityService.playSession();
  }

  updateLoadSingleLoopUserActivity(loop: LoopPad): void {
    if (this.userActivityService.getUserActivityMode()) {
      this.userActivityService.addUserActivity([loop], 'loadSingleLoop');
    }
  }

  public initLayout(): void {
    this.audioPerName.clear();
    this.audioPrmsPerLoop.clear();
    this.waitingLoops.splice(0, this.waitingLoops.length);
    this.playingLoops.splice(0, this.playingLoops.length);
    this.audioPrms.splice(0, this.audioPrms.length);
  }
}
