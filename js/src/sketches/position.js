import p5 from 'p5';
import pos from '../lib/pos';

export default function position(s) {
  let x, y;

  s.setup = () => {
    s.createCanvas(s.windowWidth, s.windowHeight);
  }
  s.windowResized = () => {
    s.resizeCanvas(s.windowWidth, s.windowHeight);
  }
  s.draw = () => {
    let {x, y} = pos(s)
    s.rect(x(0), y(0), x(0.5), y(0.5))
    s.rect(x(0.5), y(0), x(0.5), y(0.5))
    s.rect(x(0.5), y(0.5), x(0.5), y(0.5))
    s.rect(x(0.5), y(0), x(0.5), y(0.5))
  }

  return s
}