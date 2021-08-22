import { Component, OnInit, ViewChild } from '@angular/core';
import { LoopPad } from 'src/app/objects/loop-pad';
import { LayoutService } from 'src/app/services/layout.service';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  imageSrc = 'https://c.tenor.com/spyhJRVI474AAAAi/musical-notes-joypixels.gif';

  public loopPadsActivity: Map<LoopPad, boolean> = new Map<LoopPad, boolean>();
  public loopPads: LoopPad[] = [];
  public currToggleMode = false;

  constructor(
    public layoutService: LayoutService
  ) { }

  ngOnInit(): void {
    // initialize all loop pads
    this.addLoopItem(new LoopPad('120_future_funk_beats_25.mp3'));
    this.addLoopItem(new LoopPad('120_stutter_breakbeats_16.mp3'));
    this.addLoopItem(new LoopPad('Bass Warwick heavy funk groove on E 120 BPM.mp3'));
    this.addLoopItem(new LoopPad('electric guitar coutry slide 120bpm - B.mp3'));
    this.addLoopItem(new LoopPad('FUD_120_StompySlosh.mp3'));
    this.addLoopItem(new LoopPad('GrooveB_120bpm_Tanggu.mp3'));
    this.addLoopItem(new LoopPad('MazePolitics_120_Perc.mp3'));
    this.addLoopItem(new LoopPad('PAS3GROOVE1.03B.mp3'));
    this.addLoopItem(new LoopPad('SilentStar_120_Em_OrganSynth.mp3'));
  }

  // drop function in drag&drop
  drop(event: any): void {
    moveItemInArray(this.loopPads, event.previousIndex, event.currentIndex);
  }

  // cuts the last 4 chars in a loopName that represents the audio type (.mp3)
  getCutLoopName(loop: LoopPad): string {
    return loop.loopName.substr(0, loop.loopName.length - 4);
  }

  // checks if the current loop playing now
  isLoopOnPlay(loop: LoopPad): boolean {
    return this.layoutService.playingLoops.includes(loop);
  }

  // updates the loop playing state according to the toggle button
  updateLoopState(event: any, loop: LoopPad): void {
    if (event.checked) {
      this.playSingleLoop(loop);
    } else {
      this.pauseSingleLoop(loop);
    }
  }

  // play all loop pads together
  playAllLoops(): void {
    const playingLoops: LoopPad[] = [];
    for (const loop of this.loopPadsActivity.keys()) {
      if (this.loopPadsActivity.get(loop)) {
        playingLoops.push(loop);
      }
    }
    this.layoutService.playAllLoops(playingLoops);
  }

  // pause all loop pads together
  pauseAllLoops(): void {
    this.layoutService.pauseAllLoops();
  }

  // record a session with tracking user activity
  recordSession(): void {
  }

  // updating single loop to on-mode
  private playSingleLoop(loop: LoopPad): void {
    this.layoutService.waitingLoops.push(loop);
    this.loopPadsActivity.set(loop, true);
  }

  // updating single loop to off-mode
  private pauseSingleLoop(loop: LoopPad): void {
    this.layoutService.endLoop(loop.loopName);
    this.loopPadsActivity.set(loop, false);
  }

  // initialize single loop item
  private addLoopItem(loop: LoopPad): void {
    this.loopPadsActivity.set(loop, false);
    this.loopPads.push(loop);
  }
}
