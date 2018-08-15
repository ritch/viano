import Timer from './Timer'

export default class Song {
  constructor(bpm, key, s, barBeats = 4) {
    this.bpm = bpm
    this.key = key
    this.bar
    this.timer = new Timer(s)
    this.s = s
    this.barBeats = barBeats
  }
  play() {
    this.timer.start();
  }
  pause() {
    this.timer.stop();
  }
  onDraw() {
    this.timer.onDraw()
  }
  beats() {
    return Math.floor((this.timer.seconds() * this.bpm) / 60) + 1
  }
  beat() {
    return (this.beats() % this.barBeats) || this.barBeats
  }
  bars() {
    return Math.floor(this.beats() / this.barBeats) + 1
  }
}
