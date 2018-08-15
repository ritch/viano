import p5 from 'p5';
import pos from '../lib/pos';
let v;

// credit:
// https://creative-coding.decontextualize.com/video/

export default function video(s) {
  s.setup = () => {
    s.createCanvas(s.windowWidth, s.windowHeight);
    v = s.createVideo(['video.mp4'], () => v.play());
    let {x, y} = pos(s)
    v.size(x(1), y(1))
    v.hide()
    v.loop()
    v.volume(0)
    s.noStroke()
  }
  s.windowResized = () => {
    s.resizeCanvas(s.windowWidth, s.windowHeight);
  }
  s.draw = () => {
    s.background(0)
    v.loadPixels()
    for (let y = 0; y < s.height; y += 10) {
      for (let x = 0; x < s.width; x += 5) {
        let offset = ((y * s.width) + x) * 4;
        s.rect(x, y, 10, 10 * (v.pixels[offset + 1] / 255));
      }
    }
  }
}