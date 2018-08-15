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
const DIM = 'dim'
const SCALE_NOTES = 7
const NOTES = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const STEPS = {
  [MAJOR]: [2, 2, 1, 2, 2, 2, 1],
  [MINOR]: [2, 1, 2, 2, 1, 2, 2]
}

function getStepsForMode(mode) {
  switch (mode) {
    case MAJOR:
      return [2, 2, 1, 2, 2, 2, 1]
    case MINOR:
      return [2, 1, 2, 2, 1, 2, 2]
  }
}

class Note {
  constructor(letter, mode) {
    this.letter = letter
    this.mode = mode
  }
  step(n) {
    // this should return the note n steps from this note
    assert(false, 'Note#step() isnt impld')
  }
}

class MidiNote {
  constructor(num, octave) {
    this.num = num
    this.octave = octave
  }
  toMusicNote() {

  }
}

const VALID_MODES = [MAJOR, MINOR]

class Scale {
  constructor(tonic, mode = MAJOR) {
    this.tonic = tonic // Note
    this.mode = mode
    assert(VALID_MODES.includes(mode), `${mode} is not a valid mode`)
  }
  static fromName(name) {
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
    
    const musicNote = new Note(noteLetter, noteMode)
    return new Scale(musicNote, mode)
  }
  notes() {
    const steps = getStepsForMode(this.mode)
    let last = this.tonic
    const notes = [this.tonic]

    for (let step of steps) {
      last = last.step(step)
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