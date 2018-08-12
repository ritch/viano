SceneList scenes = new SceneList();
Scene red;
Scene green;
Scene blue;


void setup() {
  size(800, 600);
  red = scenes.createScene();
  green = scenes.createScene();
  blue = scenes.createScene();

  scenes.play();
}

void draw() {
  int BPM = 120;
  scenes.draw();
  Scene scene = scenes.current();
  background(0);

  if(scene == red) {
    background(255, 100, 100);
    if (scene.beats(BPM) >= 5) {
      scenes.change(green);
      return;
    }
  }
  if (scene == green) {
    background(100, 255, 100);
    if (scene.beats(BPM) >= 5) {
      scenes.change(red);
      return;
    }
  }

  drawInfo(scene);

  textSize(72);

  text(floor(scene.beats(BPM)), 100, 100);
}

int INFO_LINE_HEIGHT = 20;
int INFO_HEIGHT = INFO_LINE_HEIGHT * 4;

void drawInfo(Scene scene) {

  textSize(14);
  int top = height - INFO_HEIGHT;
  text("Frame Rate: " + round(frameRate), 0, top);
  text("Frame Count: " + frameCount, 0, top + INFO_LINE_HEIGHT);
  text("Scene Seconds: " + scene.seconds(), 0, top + INFO_LINE_HEIGHT * 2);
  text("Scene Frames: " + scene.frames(), 0, top + INFO_LINE_HEIGHT * 3);
}

class CurrentFrame {
  int lastFrame = 0;
  CurrentFrame() {

  }
  void draw() {
    lastFrame = frameCount;
  }
  Boolean changed() {
    return frameCount != lastFrame;
  }
}

class FrameTimer {
  int elapsed;
  Boolean ticking = false;
  FrameTimer(int current) {
    elapsed = current;
  }
  void start() {
    ticking = true;
  }
  void stop() {
    ticking = false;
  }
  void onFrame() {
    if (ticking) {
      elapsed += 1;
    }
  }
}

class SceneList {
  public ArrayList<Scene> scenes;
  public CurrentFrame frame;
  public Boolean playing;
  int currentSceneIdx = 0;
  SceneList() {
    scenes = new ArrayList<Scene>();
    frame = new CurrentFrame();
  }
  Scene createScene() {
    Scene scene = new Scene();
    scenes.add(scene);
    return scene;
  }
  void play() {
    playing = true;
    Scene scene = current();
    scene.play();
  }
  void finish() {
    playing = false;
  }
  void pause() {
    playing = false;
    Scene scene = current();
    scene.pause();
  }
  Scene current() {
    return scenes.get(currentSceneIdx);
  }
  Boolean last() {
    int numScenes = scenes.size();
    int maxIdx = numScenes - 1;
    int nextIdx = currentSceneIdx + 1;
    return nextIdx > maxIdx;
  }
  void next() {
    if (last()) {
      finish();
    } else {
      currentSceneIdx++;
      play();
    }
  }
  void change(Scene scene) {
    int idx = scenes.indexOf(scene);
    if (idx == -1) {
      println("make sure to create scenes with createScene()");
    } else {
      currentSceneIdx = idx;
      scene.restart();
    }
  }
  void draw() {
    Scene scene = current();

    if (playing) {
      Boolean isFrameChange = frame.changed();
      if (isFrameChange) {
        scene.onFrame();
      }
    }
  }
}

public class Scene {
  FrameTimer timer;
  Scene() {
    timer = new FrameTimer(0);
  }
  void cue(int frame) {
    timer = new FrameTimer(frame);
  }
  void cueSeconds(int seconds) {
    int frame = seconds * (int)frameRate;
    cue(frame);
  }
  int frames() {
    return this.timer.elapsed;
  }
  float seconds() {
    return this.timer.elapsed / frameRate;
  }
  float beats(int bpm) {
    return ((seconds() * bpm) / 60) + 1;
  }
  void onFrame() {
    timer.onFrame();
  }
  void play() {
    timer.start();
  }
  void restart() {
    cue(0);
    play();
  }
  void pause() {
    timer.stop();
  }
}