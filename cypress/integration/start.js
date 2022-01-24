// @ts-check
/// <reference types="cypress" />

import { tryNextWord } from './utils'

const silent = { log: false }

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
        cy.screenshot('start-word', { overwrite: true })

        cy.log('**hiding the solution**')
        cy.get(`game-row[letters=${word}]`)
          .find('game-tile[letter]', silent)
          .each(($gameTile) => {
            cy.wrap($gameTile, silent)
              .find('.tile', silent)
              .invoke(silent, 'text', '')
          })

        // emailing the board without the solution
        cy.get('#board-container')
          .wait(1500, silent)
          .should('be.visible')
          .screenshot('almostSolved', { overwrite: true })
          .then(() => {
            const screenshot = `${Cypress.spec.name}/almostSolved.png`
            // use cy.task to email myself the image
            // with the almost solved board
            cy.task('sendAlmostSolved', { screenshot })
          })
      }
    })
  })
})
