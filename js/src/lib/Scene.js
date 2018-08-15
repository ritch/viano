
class CurrentFrame {
  constructor() {
    this.lastFrame = 0
  }
  draw(frameCount) {
    this.lastFrame = frameCount;
  }
  changed(frameCount) {
    return frameCount != this.lastFrame;
  }
}

class FrameTimer {
  FrameTimer(current) {
    this.elapsed = current;
  }
  start() {
    this.ticking = true;
  }
  stop() {
    this.ticking = false;
  }
  onFrame() {
    if (this.ticking) {
      this.elapsed += 1;
    }
  }
}

class SceneList {
  constructor() {
    this.scenes = [];
    this.frame = new CurrentFrame();
  }
  createScene() {
    const scene = new Scene();
    this.scenes.add(scene);
    return scene;
  }
  play() {
    this.playing = true;
    const scene = this.current();
    scene.play();
  }
  finish() {
    this.playing = false;
  }
  pause() {
    this.playing = false;
    const scene = this.current();
    scene.pause();
  }
  current() {
    return scenes[this.currentSceneIdx];
  }
  last() {
    const numScenes = scenes.length;
    const maxIdx = numScenes - 1;
    const nextIdx = currentSceneIdx + 1;
    return nextIdx > maxIdx;
  }
  next() {
    if (this.last()) {
      this.finish();
    } else {
      this.currentSceneIdx++;
      this.play();
    }
  }
  change(scene) {
    const idx = this.scenes.indexOf(scene);
    if (idx === -1) {
      console.log("make sure to create scenes with createScene()");
    } else {
      this.currentSceneIdx = idx;
      scene.restart();
    }
  }
  draw(frameCount) {
    const scene = this.current();

    if (playing) {
      const isFrameChange = this.frame.changed(frameCount);
      if (isFrameChange) {
        scene.onFrame();
      }
    }
  }
}

class Scene {
  constructor() {
    this.timer = new FrameTimer(0);
  }
  cue(frame) {
    this.timer = new FrameTimer(frame);
  }
  cueSeconds(seconds) {
    const frame = seconds * frameRate;
    this.cue(parseInt(frame));
  }
  frames() {
    return this.timer.elapsed;
  }
  seconds() {
    return this.timer.elapsed / frameRate;
  }
  beats(bpm) {
    return ((seconds() * bpm) / 60) + 1;
  }
  onFrame() {
    this.timer.onFrame();
  }
  play() {
    timer.start();
  }
}
