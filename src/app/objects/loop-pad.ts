/**
 * Loop Pad represents a single loop pad in the system
 */
export class LoopPad {
  loopName: string;
  loopPadSrc: string;

  constructor(loopName: string) {
      this.loopName = loopName;
      this.loopPadSrc = './assets/loops/' + loopName;
  }
}
