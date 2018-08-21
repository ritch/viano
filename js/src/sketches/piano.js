import p5 from 'p5';
import pos from '../lib/pos';
import Piano from '../lib/Piano';
import Song from '../lib/Song'
import {Scale, MAJOR, MINOR} from '../lib/Music'

let piano
let song

let animatedNotes = []

export default function piano(s) {
  s.setup = () => {
    s.createCanvas(s.windowWidth, s.windowHeight)
    piano = new Piano(88, s)
    const all = piano.notes()
    const some = piano.notes().slice(60, all.length - 1)
    for (let note of some) {
      for (let scaleNote of note.scale(MAJOR).notes()) {
        // animatedNotes.push(scaleNote)
      }
    }

    let lastNote
    setInterval(() => {
      if (lastNote) {
        piano.keyUp(lastNote)
      }
      const n = animatedNotes.shift()
      if (n) {
        piano.keyDown(n, 127)
        lastNote = n
      }
    }, 250)

    song = new Song(120, 'Cmaj', s)
    const scale = Scale.fromName('Cmaj')
  }
  s.windowResized = () => {
    s.resizeCanvas(s.windowWidth, s.windowHeight);
  }
  s.draw = () => {
    s.background(123)
    piano.draw(20, 50, 100, s)
    // song.onDraw()


  }
}
