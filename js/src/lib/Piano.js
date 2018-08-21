import {Note} from './Music'
import p5 from 'p5';

const LETTER_WIDTH = 3

export default class Piano {
  constructor(numKeys = 88, s) {
    this.numKeys = numKeys
    this.downKeys = new Map()
    this.osc = new p5.Oscillator()
    this.osc.setType('sine')
    this.osc.amp(0)
    this.osc.start()
  }
  draw(x, y, h, s) {
    const noteY = y
    // s.noStroke()
    // draw white keys
    const naturalNotes = this.notes().filter(n => n.isNatural())
    const naturalNoteWidth = s.windowWidth / naturalNotes.length
    const naturalNoteHeight = (s.windowHeight / 5) * 2
    let natNoteIdx = 0
    const natXs = {}
    for (let note of naturalNotes) {
      const noteNum = note.toNoteNumber()
      s.fill(this.getNoteColor(note, s, 255))
      s.rect(natNoteIdx * naturalNoteWidth, noteY, naturalNoteWidth, naturalNoteHeight)
      natXs[note.letter + note.octave] = natNoteIdx * naturalNoteWidth
      s.fill(0)
      s.text(note.toString(), natNoteIdx * naturalNoteWidth + (naturalNoteWidth / 2) - 5, noteY + naturalNoteHeight - 10)
      natNoteIdx++
    }
    const sharpNotes = this.notes().filter(n => n.isSharp())
    const sharpNoteWidth = naturalNoteWidth * 0.75
    const sharpNoteHeight = s.windowHeight / 5
    for (let note of sharpNotes) {
      let sharpNoteIdx = noteNum
      const sharpNoteX = natXs[note.letter + note.octave] + 20
      const noteNum = note.toNoteNumber()
      s.fill(this.getNoteColor(note, s, 0))
      s.rect(sharpNoteX, noteY, sharpNoteWidth, sharpNoteHeight)
      s.fill(255)
      s.text(note.toString(), sharpNoteX + (sharpNoteWidth / 2) - LETTER_WIDTH * 2, noteY + sharpNoteHeight - 20)
      sharpNoteIdx++
    }
  }
  getNoteColor(note, s, def) {
    const BLUE = s.color(66, 134, 244)
    const v = this.velocity(note)
    const d = s.color(def)
    return s.lerpColor(d, BLUE, s.map(v, 0, 127, 0, 1))
  }
  notes() {
    const result = []
    for (let noteNum = 0; noteNum < this.numKeys; noteNum++) {
      result.push(Note.fromNoteNumber(noteNum))
    }
    return result
  }
  velocity(note) {
    const n = note.toNoteNumber()
    const isDown = this.downKeys.has(n)
    if (!isDown) return 0
    return this.downKeys.get(n)
  }
  keyDown(note, velocity = 127) {
    this.downKeys.set(note.toNoteNumber(), velocity)
    this.osc.freq(note.toFreq())
    this.osc.amp(0.1)
  }
  keyUp(note) {
    this.downKeys.delete(note.toNoteNumber())
    this.osc.amp(0)
  }
  keysDown(notes, velocity = 127) {
    for (let note of notes) {
      this.keyDown(note, velocity)
    }
  }
  keysUp(notes, velocity = 127) {
    for (let note of notes) {
      this.keyUp(note, velocity)
    }
  }
}
