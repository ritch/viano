import {
  Note,
  FLAT,
  SHARP,
  Interval
} from './Music'

describe('Note', () => {
  describe('toNoteNumber()', () => {
    it('should return 0 for A0', () => {
      const A4 = new Note('A', 0)
      expect(A4.toNoteNumber()).toEqual(9)
    })
    it('should return 12 for A1', () => {
      const A1 = new Note('A', 1)
      expect(A1.chromaticIdx).toEqual(9)
      expect(A1.toNoteNumber()).toEqual(21)
    })

    it('should return 48 for A4', () => {
      const A4 = new Note('A', 4)
      expect(A4.chromaticIdx).toEqual(9)
      expect(A4.toNoteNumber()).toEqual(57)
    })

    it('should return 2 for B0', () => {
      const B0 = new Note('B', 0)
      expect(B0.chromaticIdx).toEqual(11)
      expect(B0.toNoteNumber()).toEqual(11)
    })

    it('should return -1 for Ab0', () => {
      const A1 = new Note('A', 0, FLAT)
      expect(A1.chromaticIdx).toEqual(8)
      expect(A1.toNoteNumber()).toEqual(8)
    })

    it('should return  for G#0', () => {
      const A1 = new Note('G', 0, SHARP)
      expect(A1.chromaticIdx).toEqual(8)
      expect(A1.toNoteNumber()).toEqual(8)
    })
  })

  describe('diff()', () => {
    it('C5 - A4 = 3 half steps', () => {
      const C5 = new Note('C', 5)
      const A4 = new Note('A', 4)
      expect(C5.diff(A4)).toEqual(3)
    })
  })

  describe('toFreq()', () => {
    it('should return 440 for A4', () => {
      const A4 = new Note('A', 4)
      expect(A4.toFreq()).toEqual(440)
    })

    it('should return 880 for A5', () => {
      const A5 = new Note('A', 5)
      expect(A5.toFreq()).toEqual(880)
    })

    it('should return 97.9989 for G2', () => {
      const G2 = new Note('G', 2)
      expectToApproxEqual(G2.toFreq(), 97.9988589954373)
    })

    it('should return 523.3 for C5', () => {
      const C5 = new Note('C', 5)
      expectToApproxEqual(C5.toFreq(), 523.2511306011974)
    })
  })

  describe('interval(note)', () => {
    it('should return major 3rd for C0 and E0', () => {
      const C0 = new Note('C', 0)
      const E0 = new Note('E', 0)
      const interval = C0.interval(E0)
      expect(interval.name).toEqual('major 3rd')
    })
  })
})

function expectToApproxEqual(a, b, epsilon = 0.0001) {
  if (Math.abs(a - b) > epsilon) {
    throw new Error(`${a} !=~ ${b}`)
  }
}