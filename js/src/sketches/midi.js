import p5 from 'p5';
import pos from '../lib/pos';
import WebMidi from 'webmidi';


export default function midi(s) {
  let x, y;
  let messages = []

  s.setup = () => {
    s.createCanvas(s.windowWidth, s.windowHeight);
    WebMidi.enable(function (err) {
      console.log(WebMidi.inputs);
      console.log(WebMidi.outputs);
      const PORT_NAME = 'Keystation 88 Port 1';
      let input = WebMidi.getInputByName(PORT_NAME);
      if (input) {
        input.addListener('noteon', 'all', e => {
          console.log(e)
          messages.push(e)
          if (messages.length > 10) {
            messages.shift()
          }
        })
      }
    })
  }
  s.windowResized = () => {
    s.resizeCanvas(s.windowWidth, s.windowHeight);
  }
  s.draw = () => {
    let {x, y} = pos(s)
    s.background(255)
    s.textSize(24)
    let max = messages.length
    for (let i = 0; i < max; i++) {
      let msg = messages[i]
      s.text(`Note: ${msg.note.name}`, x(0.5), y(i / max))
      s.text(`Octave: ${msg.note.octave}`, x(0.5), y(i / max) + 20)
    }
  }

  return s
}