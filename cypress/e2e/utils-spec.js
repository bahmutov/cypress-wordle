import { countLetters, pickWordWithMostCommonLetters } from './utils'

describe('Utils', () => {
  context('countLetters', () => {
    it('returns zeroes without any words', () => {
      const result = countLetters()
      expect(result).to.deep.include({
        a: 0,
        b: 0,
        // skip the rest
        z: 0,
      })
    })

    it('returns counts', () => {
      const result = countLetters(['abc', 'bc'])
      expect(result).to.deep.include({
        a: 1,
        b: 2,
        c: 2,
        // skip the rest
        z: 0,
      })
    })

    it('ignores duplicates', () => {
      const result = countLetters(['aaa'])
      expect(result).to.deep.include({
        a: 1,
        b: 0,
        // skip the rest
        z: 0,
      })
    })
  })

  context('pickWordWithMostCommonLetters', () => {
    it('picks the word with common letters', () => {
      const picked = pickWordWithMostCommonLetters(['abc', 'bcc', 'bcc'])
      expect(picked).to.equal('abc')
    })

    it('picks the word with common letters hello', () => {
      const picked = pickWordWithMostCommonLetters(['hello', 'abc', 'hello'])
      expect(picked).to.equal('hello')
    })
  })
})
