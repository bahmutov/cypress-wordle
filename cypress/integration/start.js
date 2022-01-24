// @ts-check
/// <reference types="cypress" />

// watch the video "Generate A Daily Wordle Hint Email With Screenshot"
// https://youtu.be/NOwNg-Nhv4o

import { tryNextWord } from './utils'

const silent = { log: false }

const maskLetter = '_'

/**
 * Given a 5 letter word, hides all the letters except for N random hints.
 * Returns `*c***` or similar with the hints revealed and the other letters hidden.
 * @param {string} word
 * @param {number} n
 */
function pickHints(word, n) {
  // but keep one of the letters in the solved word
  const positions = '01234'.split('')
  const hintPositions = Cypress._.sampleSize(positions, n)
  let hint = '01234'
  hintPositions.forEach((position) => {
    hint = hint.replace(String(position), word[position])
  })
  // replace the remaining digits with the mask
  return hint.replace(/\d/g, maskLetter)
}

describe('Wordle', () => {
  beforeEach(() => {
    cy.fixture('wordlist.json').as('wordList')
  })

  it('starts with provided word', function () {
    const word = Cypress.env('startWord') || 'start'
    cy.visit('/')
    cy.get('game-icon[icon=close]:visible').click().wait(1000, silent)

    tryNextWord(this.wordList, word).then((word) => {
      // after we have entered the word and looked at the feedback
      // we can decide if we solved it, or need to try the next word
      if (Cypress._.isString(word)) {
        expect(word).to.have.length(5)

        cy.log('**SOLVED**')
        cy.get('#share-button').should('be.visible').wait(1000, silent)
        cy.get('game-icon[icon=close]:visible').click().wait(1000, silent)

        cy.log('**hiding the solved letters**')
        cy.get('game-tile[letter]', silent).each(($gameTile) => {
          cy.wrap($gameTile, silent)
            .find('.tile', silent)
            .invoke(silent, 'text', '')
        })
      }
    })
  })
})
