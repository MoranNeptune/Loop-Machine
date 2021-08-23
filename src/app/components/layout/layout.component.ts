import { Component, OnInit } from '@angular/core';
import { LoopPad } from 'src/app/objects/loop-pad';
import { LayoutService } from 'src/app/services/layout.service';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { UserActivityService } from 'src/app/services/user-activity.service';

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
  private recordBtnColor = '';

  constructor(
    public layoutService: LayoutService,
    public userActivityService: UserActivityService
  ) {
   }

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

    // suppotrs the communication between this component to userActivityService
    this.userActivityService.onLoadSingleLoop(this.loadSingleLoop.bind(this));
    this.userActivityService.onPlayAllLoops(this.playSomeLoops.bind(this));
    this.userActivityService.onPauseSingleLoop(this.pauseSingleLoop.bind(this));
    this.userActivityService.onPauseAllLoops(this.pauseSomeLoops.bind(this));
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
      this.loadSingleLoop(loop);
    } else {
      this.pauseSingleLoop(loop);
    }
  }

  playAllLoopsCover(): void {
    if (this.userActivityService.isRecordExists()) {
      this.layoutService.initLayout();
      this.userActivityService.userActivities = [];
    }
    this.playAllLoops();
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

  pauseAllLoopsCover(): void {
    if (this.userActivityService.isRecordExists()) {
      this.layoutService.initLayout();
      this.userActivityService.userActivities = [];
    }
    this.pauseAllLoops();
  }

  // pause all loop pads together
  pauseAllLoops(): void {
    this.layoutService.pauseAllLoops();
  }

  // play all loop pads together
  playSomeLoops(loops: LoopPad[]): void {
    this.layoutService.playAllLoops(loops);
  }

  // pause all loop pads together
  pauseSomeLoops(loops: LoopPad[]): void {
    this.layoutService.pauseSomeLoops(loops);
  }

  // record a session with tracking user activity
  recordSession(): void {
    const recordBtn = document.getElementById('recordBtn');
    if (!this.getUserActivityMode()) {
      if (recordBtn !== null) {
        this.recordBtnColor = recordBtn.style.color;
        recordBtn.style.color = 'red';
      }
      this.layoutService.startRecordSession();
    } else {
      if (recordBtn !== null) {
        recordBtn.style.color = this.recordBtnColor;
      }
      this.layoutService.endRecordSession();
    }
  }

  // returns true if record mode on, else false
  getUserActivityMode(): boolean {
    return this.userActivityService.getUserActivityMode();
  }

  // reuturns true if record is over, else false
  isRecordOver(): boolean {
    return this.userActivityService.isRecordOver();
  }

  // play the session that was recorded
  playSession(): void {
    this.layoutService.playSession();
    for (const loop of this.loopPads) {
        this.loopPadsActivity.set(loop, false);
    }
    // after a playSeesion over -> initialize all states
    const playSessionElem = document.getElementById('playSessionBtn');
    if (playSessionElem !== null) {
      playSessionElem.style.display = 'none';
    }
  }

  // updating single loop to on-mode
  private loadSingleLoop(loop: LoopPad): void {
    this.layoutService.waitingLoops.push(loop);
    this.loopPadsActivity.set(loop, true);
    this.layoutService.updateLoadSingleLoopUserActivity(loop);
  }

  // updating single loop to off-mode
  private pauseSingleLoop(loop: LoopPad): void {
    this.layoutService.pauseSingleLoop(loop, true);
    this.loopPadsActivity.set(loop, false);
  }

  // initialize single loop item
  private addLoopItem(loop: LoopPad): void {
    this.loopPadsActivity.set(loop, false);
    this.loopPads.push(loop);
  }
}
