import {
  Note
} from './Music'

describe('Note', () => {
  describe('toNoteNumber()', () => {
    it('should return 0 for A0', () => {
      const A4 = new Note('A', 0)
      expect(A4.toNoteNumber()).toEqual(0)
    })
    it('should return 12 for A1', () => {
      const A1 = new Note('A', 1)
      expect(A1.chromaticIdx).toEqual(0)
      expect(A1.toNoteNumber(), 'foo').toEqual(12)
    })
  })
  describe('toFreq()', () => {
    it('should return 440 for A4', () => {
      const A4 = new Note('A', 4)
      expect(A4.toFreq()).toEqual(440)
    })

    it('should return 880 for A5', () => {
      const A4 = new Note('A', 5)
      expect(A4.toFreq()).toEqual(880)
    })

    it('should return 97.9989 for G2', () => {
      const A4 = new Note('G', 2)
      expect(A4.toFreq()).toEqual(97.9989)
    })
  })
})
