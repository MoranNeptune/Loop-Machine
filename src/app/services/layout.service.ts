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

  constructor() { }

  // play all loop pads together
  playAllLoops(playingLoops: LoopPad[]): void {
    this.playingLoops = playingLoops;
    console.log('plaing loops:' + playingLoops.length);
    for (const loop of playingLoops) {
      this.startLoop(loop);
    }
    this.waitingLoops.splice(0, this.waitingLoops.length);
  }

  // updating single loop to on-mode
  private startLoop(loop: LoopPad): void {
    const loopSrc = loop.loopPadSrc;
    this.playAudio(loop.loopName, loopSrc);
  }

  // initialize single audio
  private playAudio(loopName: string, loopSrc: string): void{
    const currAudio = this.audioPerName.get(loopName);
    if (currAudio === undefined) {
      const audio = new Audio();
      audio.src = loopSrc;
      this.audioPerName.set(loopName, audio);
      audio.load();
    }
    this.activateAudio(this.audioPerName.get(loopName));
  }

  // activate single audio
  private activateAudio(audio: any): void{
    audio.play();
    const currAudioPrm = new Promise((res, rej) => {
      audio.onended = () => res('audio finished');
    });
    this.audioPrms.push(currAudioPrm);
    Promise.all(this.audioPrms).then(() => {
      this.startNewLoopCycle();
    });
  }

  private startNewLoopCycle(): any {
    this.playingLoops = this.playingLoops.concat(this.waitingLoops);
    this.audioPrms.splice(0, this.audioPrms.length);
    this.playAllLoops(this.playingLoops);
  }

  // pause all loop pads together
  pauseAllLoops(): void {
    for (const loop of this.playingLoops) {
      this.endLoop(loop.loopName);
    }
    this.audioPrms.splice(0, this.audioPrms.length);
  }

  // updating single loop to off-mode
  endLoop(loopName: string): void {
    const currAudio = this.audioPerName.get(loopName);
    if (currAudio !== undefined) {
      currAudio.pause();
    }
    this.playingLoops = this.playingLoops.filter(loop => loop.loopName !== loopName);
  }

}
