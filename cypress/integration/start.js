// @ts-check
/// <reference types="cypress" />

// use page objects to close the modals, solve the puzzle, etc
import { Start, Playing, Solved } from './utils/pages'
import { solve } from './utils/solver'

const silent = { log: false }

describe.skip('Wordle', () => {
  beforeEach(() => {
    cy.fixture('wordlist.json').as('wordList')
  })

  it('starts with provided word', function () {
    const word = Cypress.env('startWord') || 'start'
    expect(word).to.be.a('string').and.to.have.length(5)

    cy.visit('/')
    Start.close()
    solve(word, Playing).then((word) => {
      // after we have entered the word and looked at the feedback
      // we can decide if we solved it, or need to try the next word
      if (Cypress._.isString(word)) {
        expect(word).to.have.length(5)

        cy.log('**SOLVED**')
        Solved.close()
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
