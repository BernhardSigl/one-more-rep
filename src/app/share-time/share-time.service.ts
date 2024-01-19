import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareTimeService {
  value = 0;
  secAlert: number = 0;
  running = false;

  preIntervalConvert!: any;
  startTimerAlert: any;
  intervalConvert!: any;

  firstIntervalMin!: number;
  secondIntervalMin!: number;
  firstPreIntervalMin!: number;
  secondPreIntervalMin!: number;

  firstIntervalSec!: number;
  secondIntervalSec!: number;
  firstPreIntervalSec!: number;
  secondPreIntervalSec!: number;

  activeFirstInterval = false;
  activeSecondInterval = false;
  activeFirstPreInterval = false;
  activeSecondPreInterval = false;

  AUDIO_MAIN_ALERT = new Audio('./../../assets/sounds/main-alert.mp3');
  AUDIO_PRE_ALERT = new Audio('./../../assets/sounds/pre-alert.mp3');

  constructor() {
  }

  logCurrentTime() {
    if (this.checkActiveInterval()) {
      this.startTimerAlert = setInterval(() => {
        this.intervalCalc();
        this.preIntervalCalc();
        this.playIntervalSound();
        this.playPreIntervalSound();
      }, 10);
    }
  }

  checkActiveInterval() {
    return (this.activeFirstInterval || this.activeSecondInterval) && this.running;
  }

  intervalCalc() {
    if (this.activeFirstInterval) {
      this.intervalConvert = this.firstIntervalMin * 60 + this.firstIntervalSec;
      this.circleProgressBehaviour();
    } else if (this.activeSecondInterval) {
      this.intervalConvert = this.secondIntervalMin * 60 + this.secondIntervalSec;
      this.circleProgressBehaviour();
    } else {
      this.value = 0;
    }
  }

  circleProgressBehaviour() {
    this.value = this.secAlert * (100 / this.intervalConvert);
    if (this.value == 100) {
      this.secAlert = 0;
    }
    if (this.value > 100) {
      this.value = +('' + this.value % 100);
    }
  }

  preIntervalCalc() {
    if (this.activeFirstPreInterval) {
      this.preIntervalConvert = this.intervalConvert - (this.firstPreIntervalMin * 60 + this.firstPreIntervalSec);
    } else if (this.activeSecondPreInterval) {
      this.preIntervalConvert = this.intervalConvert - (this.secondPreIntervalMin * 60 + this.secondPreIntervalSec);
    }
  }

  playIntervalSound() {
    if (this.secAlert % this.intervalConvert === 0 && (this.activeFirstInterval || this.activeSecondInterval) && this.running) {
      this.intervalSoundBehaviour(this.AUDIO_MAIN_ALERT);
    }
  }

  playPreIntervalSound() {
    if (this.secAlert % this.intervalConvert === this.preIntervalConvert && (this.activeFirstPreInterval || this.activeSecondPreInterval) && this.running) {
      this.intervalSoundBehaviour(this.AUDIO_PRE_ALERT);
    }
  }

  intervalSoundBehaviour(AUDIO_NAME: HTMLAudioElement) {
    AUDIO_NAME.play();
    AUDIO_NAME.onended = () => {
      AUDIO_NAME.pause();
      AUDIO_NAME.currentTime = 0;
    };
  }

  //
  setInterval(interval: string) {
    this.toggleInterval(interval);
    this.togglePreInterval(interval);
  }

  toggleInterval(interval: string) {
    this.value = 0;
    this.secAlert = 0;
    if (interval === 'firstInterval') {
      this.activeFirstInterval = !this.activeFirstInterval;
      this.activeSecondInterval = false;
    } else if (interval === 'secondInterval') {
      this.activeSecondInterval = !this.activeSecondInterval;
      this.activeFirstInterval = false;
    }
    if (!this.activeFirstInterval && !this.activeSecondInterval) {
      this.activeFirstPreInterval = false;
      this.activeSecondPreInterval = false;
    }
  }

  togglePreInterval(interval: string) {
    if (this.firstPreIntervalIsClicked(interval)) {
      this.activeFirstPreInterval = !this.activeFirstPreInterval;
      this.activeSecondPreInterval = false;
    } else if (this.secondPreIntervalIsClicked(interval)) {
      this.activeSecondPreInterval = !this.activeSecondPreInterval;
      this.activeFirstPreInterval = false;
    }
    this.intervalComparison();
  }

  firstPreIntervalIsClicked(interval: string) {
    return interval === 'firstPreInterval' && (this.activeFirstInterval || this.activeSecondInterval);
  }

  secondPreIntervalIsClicked(interval: string) {
    return interval === 'secondPreInterval' && (this.activeFirstInterval || this.activeSecondInterval);
  }

  intervalComparison() {
    const firstPreIntervalTime = this.firstPreIntervalMin * 60 + this.firstPreIntervalSec;
    const secondPreIntervalTime = this.secondPreIntervalMin * 60 + this.secondPreIntervalSec;

    this.inervalComparisonCalc(firstPreIntervalTime, this.activeFirstPreInterval);
    this.inervalComparisonCalc(secondPreIntervalTime, this.activeSecondPreInterval);
  }

  inervalComparisonCalc(preIntervalTime: number, activePreInterval: Boolean) {
    if (this.firstIntervalSmallerThanPreInterval(preIntervalTime, activePreInterval)) {
      console.log('first pre interval must be smaller than selected interval');
      this.disablePreIntervalBtns();
    } else if (this.secondIntervalSmallerThanPreInterval(preIntervalTime, activePreInterval)) {
      console.log('first pre interval must be smaller than selected interval');
      this.disablePreIntervalBtns();
    }
  }

  firstIntervalSmallerThanPreInterval(preIntervalTime: number, activePreInterval: Boolean) {
    const firstIntervalTime = this.firstIntervalMin * 60 + this.firstIntervalSec;
    return this.activeFirstInterval && activePreInterval && firstIntervalTime < preIntervalTime + 1;
  }

  secondIntervalSmallerThanPreInterval(preIntervalTime: number, activePreInterval: Boolean) {
    const secondIntervalTime = this.secondIntervalMin * 60 + this.secondIntervalSec;
    return this.activeSecondInterval && activePreInterval && secondIntervalTime < preIntervalTime + 1;
  }

  disablePreIntervalBtns() {
    this.activeFirstPreInterval = false;
    this.activeSecondPreInterval = false;
  }
}
