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


export class Piano extends InputDevice {
  keys() {
    
  }
}

export class OutputDevice {
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