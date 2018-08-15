export default class Timer {
  constructor(s) {
    this.elapsed = 0
    this.lastFrame = 0
    this.ticking = false
    this.s = s
    this.frameRates = [s.frameRate()]
  }
  start() {
    this.ticking = true
    this.started = Date.now()
  }
  stop() {
    this.ticking = false
  }
  onDraw() {
    if (this.ticking) {
      this.elapsed = Date.now() - this.started
      this.avgFrameRate = avg(this.frameRates)
      this.frameRates.push(this.s.frameRate())
  
      if (this.frameRates.length > 16) {
        this.frameRates.shift()
      }
    }
  }
  frames() {
    return Math.round(this.seconds() * this.avgFrameRate)
  }
  seconds() {
    return this.elapsed / 1000
  }
}

function avg(arr) {
  let total = 0
  for (let n of arr) {
    total += n
  }
  return total / arr.length
}