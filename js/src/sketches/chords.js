import p5 from 'p5';
import pos from '../lib/pos';
import Piano from '../lib/Piano';
import {Note, CHORDS} from '../lib/Music'

let piano
let song
let chordName

let animatedNotes = []

export default function piano(s) {
  s.setup = () => {
    s.createCanvas(s.windowWidth, s.windowHeight)
    piano = new Piano(88, s)
    let current = 0
    let chordNotes
    let curNote = 'C'

    const CMaj = CHORDS[0]

    setInterval(() => {
      if (chordNotes) {
        piano.keysUp(chordNotes)
      }
      chordNotes = CHORDS[current].toNotes(new Note(curNote))
      chordName = `${curNote}${CHORDS[current].name}`
      current++
      if (current > CHORDS.length - 1) current = 0
      piano.keysDown(chordNotes)
    }, 2000)


  }
  s.windowResized = () => {
    s.resizeCanvas(s.windowWidth, s.windowHeight);
  }
  s.draw = () => {
    s.background(123)
    piano.draw(20, 50, 100, s)

    if (chordName) {
      s.textSize(72)
      s.text(chordName, s.windowWidth / 2 - 100, s.windowHeight / 2 + 200)
      s.textSize(12)
    }
  }
}
