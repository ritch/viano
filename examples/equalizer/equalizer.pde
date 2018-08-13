import processing.sound.*;
SoundFile file;
FFT fft;
Equalizer eq;

int bands = 512;
float[] spectrum = new float[bands];

void setup() {
  frameRate(30);
  size(512, 360);

  //fullScreen();
   // Load a soundfile from the /data folder of the sketch and play it back
  file = new SoundFile(this, "stinger.wav");
  file.play();
  fft = new FFT(this, bands);
  fft.input(file);
  eq = new Equalizer(fft, bands);
}

void draw() {
  println("playing " + file.isPlaying());

  // float volume = amp.analyze();
  float centerX = (width / 2);
  float centerY = (height / 2);
  background(0);
  
  if (file.isPlaying() == 1) {
    eq.update();
  }
  
  for (int i = 0; i < bands; i++) {
    stroke(0);
    // The FFT range is between 0 and 1, we map it to pixels
    float bandHeight = map(eq.normal(i), 0, 1, 0, height);

    float x1 = i;
    float y1 = height;
    
    float x2 = i;
    float y2 = height - bandHeight;
    
    stroke(i % 255, 255, 255);
    line(x1, y1, x2, y2);
  }
}


void stop() {
  file.stop();
}

class Equalizer {
  int bands;
  FFT _fft;
  float[] spectrum;
  Equalizer(FFT fft, int bands) {
    _fft = fft;
    spectrum = new float[bands];
  }
  void update() {
    fft.analyze(spectrum);
  }
  float raw(int band) {
    return spectrum[band];
  }
  float db(int band) {
    return (float)(20 * java.lang.Math.log10(raw(band) + 0.0001));
  }
  float normal(int band) {
    float db = db(band);
    return map(db, -80, 0, 0, 1);
  }
}
