import WebMidi from 'webmidi';
import assert from './assert'

let enabled = false
let enabling;
async function ensureEnabled() {
  if (enabling) return enabling
  if (enabled) {
    return
  }
  enabling = new Promise((resolve, reject) => {
    WebMidi.enable(function (err) {
      if (err) return reject(err)
      resolve()
    })
  })
  return enabling
}

class InputDevice {
  static async list() {
    const Type = this
    await ensureEnabled()
    return WebMidi.inputs.map(input => new Type(input))
  }
  static async getByName(name) {
    const all = await InputDevice.list()
    for (let input of all) {
      if (input.name === name) {
        return input
      }
    }
    throw new Error(`Could not find InputDevice with name "${name}"`)
  }
  constructor(input) {
    this.webMidiInput = input
    this.name = input.name
  }
}

/*
Major Scale: R, W, W, H, W, W, W, H.
Natural Minor Scale: R, W, H, W, W, H, W, W.
Harmonic Minor Scale: R, W, H, W, W, H, 1 1/2, H (notice the step and a half)
Melodic Minor Scale: going up is: R, W, H, W, W, W, W, H. ...
Dorian Mode is: R, W, H, W, W, W, H, W.
Mixolydian Mode is: R, W, W, H, W, W, H, W.
*/

const MAJOR = 'maj'
const MINOR = 'min'
const UNISON = 'uni'
const DIM = 'dim'
const PERFECT = 'perfect'
const SHARP = '#'
const FLAT = 'b'
const SCALE_NOTES = 7
const NOTE_MODES = []
const NOTES = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const OCTAVE_NOTES = 12

// other modes
const PHRYGIAN = 'phrygian'
const LYDIAN = 'lydian'
const MIXOLYDIAN = 'mixolydian'
const AEOLIAN = 'aeolian'
const LOCRIAN = 'locrian'

const INTERVALS = [
  new Interval(0, 'unison', UNISON),
  new Interval(1, 'minor 2nd', MINOR),
  new Interval(2, 'major 2nd', MAJOR),
  new Interval(3, 'minor 3rd', MINOR),
  new Interval(4, 'major 3rd', MAJOR),
  new Interval(5, 'perfect 4th', PERFECT),
  new Interval(6, 'tritone', DIM),
  new Interval(7, 'perfect 5th', PERFECT),
  new Interval(8, 'minor 6th', MINOR),
  new Interval(9, 'major 6th', MAJOR),
  new Interval(10, 'minor 7th', MINOR),
  new Interval(11, 'major 7th', MAJOR),
  new Interval(12, 'major 7th', MAJOR)
]

class Interval {
  constructor(halfSteps, name, type) {
    // halfSteps from the tonic
    this.halfSteps = halfSteps
    this.name = name
    this.type = type
  }
  static resolve(a, b) {
    const halfSteps = b.diff(a)
    return INTERVALS[halfSteps % SCALE_NOTES]
  }
  toNote(tonic) {
    const tonicNote = new Note(tonic)
    return tonicNote.transpose(this.halfSteps)
  }
}

function getStepsForMode(mode) {
  switch (mode) {
    case MAJOR:
      return [2, 2, 1, 2, 2, 2, 1]
    case MINOR:
      return [2, 1, 2, 2, 1, 2, 2]
    case PHRYGIAN:
      return [1, 2, 2, 2, 1, 2, 2]
    case LYDIAN:
      return [2, 2, 2, 1, 2, 2, 1]
    case MIXOLYDIAN:
      return [2, 2, 1, 2, 2, 1, 2]
    case AEOLIAN:
      return [2, 1, 2, 2, 1, 2, 2]
    case LOCRIAN:
      return [1, 2, 2, 1, 2, 2, 2]
  }
}

const TYPE_MODS = {
  [SHARP]: 1,
  [FLAT]: -1
}

class Note {
  constructor(letter, octave, type) {
    this.letter = letter.toUpperCase()
    this.octave = octave
    assert(octave > 0, 'octave must be positive')
    this.type = type
    const letterIdx = NOTES.indexOf(this.letter)
    const typeModifier = TYPE_MODS[type] || 0
    assert(letterIdx >= 0, 'invalid note letter ' + letter)
    this.chromaticIdx = letterIdx + typeModifier
  }
  transpose(halfSteps) {
    const n = this.toNoteNumber()
    return Note.fromNoteNumber(n + halfSteps)
  }
  diff(note) {
    return this.toNoteNumber() - note.toNoteNumber()
  }
  toNoteNumber(octave) {
    const octaveIdx = this.chromaticIdx
    const octaveOffset = octave * OCTAVE_NOTES
    return octaveIdx + octaveIdx
  }
  static fromNoteNumber(n) {
    const octaveIdx = n % OCTAVE_NOTES
    const octave = Math.floor(n / OCTAVE_NOTES)
    const a = new Note('A', octave)
    return a.transpose(octaveIdx)
  }
}

const noteToFreq = (x, reference = 440, refIdx = 12 * 5, K = OCTAVE_NOTES) => {
  return Math.pow(2, (x - refIdx) / K) * reference
}

class MidiNote {
  constructor(num, octave) {
    this.num = num
    this.octave = octave
  }
  toMusicNote() {
    return Note.fromNoteNumber(this.num * (this.octave + 1))
  }
}

const VALID_MODES = [MAJOR, MINOR]
class ChromaticScale {
  constructor(flats) {
    this.flats = flasts
  }
  notes() {
    return INTERVALS.map(interval => interval.toNote())
  }
}

class Scale {
  constructor(tonic, mode = MAJOR) {
    this.tonic = tonic // Note
    this.mode = mode
    assert(VALID_MODES.includes(mode), `${mode} is not a valid mode`)
  }
  static fromName(name, octave = 4) {
    let noteLetter = name.substr(0, 1)
    let mode = 'maj'
    let noteMode
    let scaleModeIdx = 1
    if (secondLetter === '#' || secondLetter === 'b') {
      noteMode = secondLetter
      scaleModeIdx += 1
    }
    let secondLetter = name.charAt(1)
    if (name.length > 1) {
      mode = name.substr(scaleModeIdx)
    }
    
    const musicNote = new Note(noteLetter, octave, noteMode)
    return new Scale(musicNote, mode)
  }
  notes() {
    const steps = getStepsForMode(this.mode)
    let last = this.tonic
    const notes = [this.tonic]

    for (let step of steps) {
      last = last.transpose(step)
      notes.push(last)
    }
    return notes
  }
}

class Piano extends InputDevice {

}

class OutputDevice {
  static async list() {
    await ensureEnabled()
    return WebMidi.outputs.map(input => new OutputDevice(input))
  }
  static async getByName(name) {
    const all = await OutputDevice.list()
    for (let output of all) {
      if (output.name === name) {
        return input
      }
    }
    throw new Error(`Could not find OutputDevice with name "${name}"`)
  }
  constructor(output) {
    this.webMidiOutput = output
    this.name = output.name
  }
}

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