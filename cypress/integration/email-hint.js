// @ts-check
/// <reference types="cypress" />

// watch the video "Generate A Daily Wordle Hint Email With Screenshot"
// https://youtu.be/NOwNg-Nhv4o

import { tryNextWord } from './utils'

const silent = { log: false }

describe('Wordle', () => {
  beforeEach(() => {
    cy.fixture('wordlist.json').as('wordList')
  })

  it('emails a hint', function () {
    cy.visit('/')
    cy.get('game-icon[icon=close]:visible').click().wait(1000, silent)

    tryNextWord(this.wordList).then((word) => {
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
        // but keep one of the letters in the solved word
        const randomLetterIndex = Cypress._.random(0, 4)
        const randomLetter = word[randomLetterIndex]
        // prepare text-only hint
        const hint = '01234'
          .replace(String(randomLetterIndex), randomLetter)
          .replace(/\d/g, '*')

        cy.get(`game-row[letters=${word}]`)
          .find('game-tile[letter]')
          .eq(randomLetterIndex)
          .find('.tile')
          .invoke('text', randomLetter)
          .wait(1500, silent)

        cy.get('#board-container')
          .should('be.visible')
          .screenshot('solved', { overwrite: true })
          .then(() => {
            // the screenshot was saved under the screenshot folder
            // plus the spec filename plus "solved.png"
            const screenshot = `${Cypress.spec.name}/solved.png`
            // use cy.task to email myself the image with the 1 letter hint
            cy.task('sendHintEmail', { screenshot, hint })
          })
      }
    })
  })
})
