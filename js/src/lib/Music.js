import assert from './assert'

/*
Major Scale: R, W, W, H, W, W, W, H.
Natural Minor Scale: R, W, H, W, W, H, W, W.
Harmonic Minor Scale: R, W, H, W, W, H, 1 1/2, H (notice the step and a half)
Melodic Minor Scale: going up is: R, W, H, W, W, W, W, H. ...
Dorian Mode is: R, W, H, W, W, W, H, W.
Mixolydian Mode is: R, W, W, H, W, W, H, W.
*/

export const MAJOR = 'maj'
export const MINOR = 'min'
export const UNISON = 'uni'
export const DIM = 'dim'
export const PERFECT = 'perfect'
export const SHARP = '#'
export const FLAT = 'b'
export const NATURAL = 'nat'
const SCALE_NOTES = 7
const NOTE_MODES = []
const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const SHARPS = [0, 1, 2, 2, 3, 4, 5]
const OCTAVE_NOTES = 12

// other modes
const PHRYGIAN = 'phrygian'
const LYDIAN = 'lydian'
const MIXOLYDIAN = 'mixolydian'
const AEOLIAN = 'aeolian'
const LOCRIAN = 'locrian'

export class Interval {
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
    return tonic.transpose(this.halfSteps)
  }
}

const UNISON_INT =  new Interval(0, 'unison', UNISON)
const MINOR_2ND = new Interval(1, 'minor 2nd', MINOR)
const MAJOR_2ND = new Interval(2, 'major 2nd', MAJOR)
const MINOR_3RD = new Interval(3, 'minor 3rd', MINOR)
const MAJOR_3RD = new Interval(4, 'major 3rd', MAJOR)
const PERFECT_4TH = new Interval(5, 'perfect 4th', PERFECT)
const TRITONE =  new Interval(6, 'tritone', DIM)
const PERFECT_5TH = new Interval(7, 'perfect 5th', PERFECT)
const MINOR_6TH = new Interval(8, 'minor 6th', MINOR)
const MAJOR_6TH = new Interval(9, 'major 6th', MAJOR)
const MINOR_7TH = new Interval(10, 'minor 7th', MINOR)
const MAJOR_7TH = new Interval(11, 'major 7th', MAJOR)
const MINOR_9TH = new Interval(13, 'minor 9th', MINOR)
const MAJOR_9TH = new Interval(14, 'major 9th', MAJOR)
const MINOR_11TH = new Interval(16, 'minor 11th', MINOR)
const MAJOR_11TH = new Interval(17, 'major 11th', MAJOR)
const MINOR_13TH = new Interval(20, 'minor 13th', MAJOR)
const MAJOR_13TH = new Interval(21, 'major 13th', MAJOR)

const INTERVALS = [
  UNISON,
  MINOR_2ND,
  MAJOR_2ND,
  MINOR_3RD,
  MAJOR_3RD,
  PERFECT_4TH,
  TRITONE,
  PERFECT_5TH,
  MINOR_6TH,
  MAJOR_6TH,
  MINOR_7TH,
  MAJOR_7TH
]

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

export class Note {
  constructor(letter, octave = 3, type = NATURAL) {
    this.letter = letter.toUpperCase()
    this.octave = octave
    assert(octave >= 0, 'octave must be positive or 0')
    this.type = type
    const letterIdx = NOTES.indexOf(this.letter)
    const previousSharpsOrFlats = SHARPS[letterIdx]
    const typeModifier = TYPE_MODS[type] || 0
    assert(letterIdx >= 0, 'invalid note letter ' + letter)
    this.chromaticIdx = letterIdx + typeModifier + previousSharpsOrFlats
  }
  toString() {
    if (this.isNatural()) return this.letter
    return `${this.letter}${this.type}`
  }
  scale(mode) {
    return new Scale(this, mode)
  }
  isSharp() {
    return this.type === SHARP
  }
  isFlat() {
    return this.type === FLAT
  }
  isNatural() {
    return this.type === NATURAL
  }
  transpose(halfSteps) {
    const n = this.toNoteNumber()
    return Note.fromNoteNumber(n + halfSteps)
  }
  changeOctave(octave) {
    return new Note(this.letter, octave, this.type)
  }
  diff(note) {
    return this.toNoteNumber() - note.toNoteNumber()
  }
  interval(note) {
    return Interval.resolve(this, note)
  }
  toNoteNumber() {
    const octaveIdx = this.chromaticIdx
    const octaveOffset = this.octave * OCTAVE_NOTES
    return octaveIdx + octaveOffset
  }
  static fromNoteNumber(n) {
    const octaveIdx = n % OCTAVE_NOTES
    const octave = Math.floor(n / OCTAVE_NOTES)
    const a = CHROMATIC_SCALE[octaveIdx]
    return a.changeOctave(octave)
  }
  toFreq() {
    const n = this.toNoteNumber() + OCTAVE_NOTES
    const refNote = new Note('A', 4)
    const refFreq = 440
    const halfSteps = this.diff(refNote)
    const a = Math.pow(2, 1/12)
    return refFreq * Math.pow(a, halfSteps)
  }
}

const CHROMATIC_SCALE = [
  new Note('C', 0),
  new Note('C', 0, SHARP),
  new Note('D', 0),
  new Note('D', 0, SHARP),
  new Note('E', 0),
  new Note('F', 0),
  new Note('F', 0, SHARP),
  new Note('G', 0),
  new Note('G', 0, SHARP),
  new Note('A', 0),
  new Note('A', 0, SHARP),
  new Note('B', 0)
]

const noteToFreq = (x, reference = 440, refIdx = 12 * 5, K = OCTAVE_NOTES) => {
  return Math.pow(2, (x - refIdx) / K) * reference
}

const VALID_MODES = [MAJOR, MINOR]

export class Scale {
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

class Chord {
  constructor(intervals, name) {
    this.intervals = intervals // Interval[]
    this.name = name
  }
  add(interval, name) {
    return new Chord([...this.intervals, interval], name)
  }
  toNotes(root) {
    const others = this.intervals.map(interval => interval.toNote(root))
    return [root, ...others]
  }
}

// C - C major
const CH_MAJOR = new Chord([MAJOR_3RD, PERFECT_5TH], MAJOR)
// Cm - C minor 
const CH_MINOR = new Chord([MINOR_3RD, PERFECT_5TH], MINOR)
// C7 - C dominant seventh
const CH_7 = CH_MAJOR.add(MINOR_7TH, '7')
// Cm7 - C minor seventh
const CH_MIN_7 = CH_MINOR.add(MINOR_7TH, 'm7')
// Cmaj7 - C major seventh
const CH_MAJ_7 = CH_MAJOR.add(MAJOR_7TH, 'maj7')
// C6 - C major sixth
const CH_MAJ_6 = CH_MAJOR.add(MAJOR_6TH, '6')
// Cm6 - C minor sixth
const CH_MIN_6 = CH_MINOR.add(MINOR_6TH, 'm6')
// C6/9 - C sixth/ninth
const CH_SIXTH_NINTH = CH_MAJ_6.add(MINOR_9TH, '6/9')
// C5 - C fifth
const CH_5 = new Chord([PERFECT_5TH], '5')
// C9 - C dominant ninth
const CH_9 = CH_7.add(MAJOR_9TH, '9')
// Cm9 - C minor ninth
const CH_MIN_9 = CH_MIN_7.add(MINOR_9TH, 'm9')
// Cmaj9 - C major ninth
const CH_MAJ_9 = CH_MAJ_7.add(MAJOR_9TH, 'maj9')
// C11 - C eleventh
const CH_11 = CH_9.add(MAJOR_11TH, '11')
// C13 - C thirteenth
const CH_13 = CH_11.add(MAJOR_13TH, '13')
// Cadd - C add
const CH_ADD_9 = CH_MAJOR.add(MAJOR_9TH, 'add9')
const CH_ADD_2 = CH_MAJOR.add(MAJOR_2ND, 'add2')
// C7-5 - C seven minus five
const CH_7_FLAT_5 = new Chord([MAJOR_3RD, TRITONE, MINOR_7TH], '7b5')
// C7+5 - C seven plus five
const CH_7_SHARP_5 = new Chord([MAJOR_3RD, MINOR_6TH, MINOR_7TH], '7#5')
// Csus - C suspended
const CH_SUS2 = CH_5.add(MAJOR_2ND, 'sus2')
const CH_SUS4 = CH_5.add(PERFECT_4TH, 'sus4')
// Cdim - C diminished
const CH_DIM = new Chord([MINOR_3RD, TRITONE], 'dim')
// Caug - C augmented
const CH_AUG = new Chord([MAJOR_3RD, MINOR_6TH], 'aug')

export const CHORDS = [
  CH_MAJOR,
  CH_MINOR,
  CH_7,
  CH_MIN_7,
  CH_MAJ_7,
  CH_MAJ_6,
  CH_MIN_6,
  CH_SIXTH_NINTH,
  CH_5,
  CH_9,
  CH_MIN_9,
  CH_MAJ_9,
  CH_11,
  CH_13,
  CH_ADD_9,
  CH_ADD_2,
  CH_7_FLAT_5,
  CH_7_SHARP_5,
  CH_SUS2,
  CH_SUS4,
  CH_DIM,
  CH_AUG
]