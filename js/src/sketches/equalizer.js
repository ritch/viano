import p5 from 'p5';

export default function equalizer(s) {
  let soundFile;
  let fft;
  const fftBands = 512;
  let frequencySpectrum;

  s.preload = () => {
    soundFile = s.loadSound('stinger.wav')
    s.masterVolume(0.2);
    fft = new p5.FFT()
  }

  s.setup = () => {
    s.createCanvas(s.windowWidth, s.windowHeight);
    soundFile.play();
  }
  s.windowResized = () => {
    s.resizeCanvas(s.windowWidth, s.windowHeight);
  }
  s.draw = () => {
    s.background(0);
    frequencySpectrum = fft.analyze()
    s.ellipse(10, 10, 10, 10);
    s.noStroke();
    for (let i = 0; i< fftBands; i++){
      let x = s.map(i, 0, fftBands, 0, s.width);
      let h = -s.height + s.map(frequencySpectrum[i], 0, 255, s.height, 0);
      s.rect(x, s.height, s.width/fftBands, h) ;
    }
    console.log(s.frameRate());
  }

  return s
}