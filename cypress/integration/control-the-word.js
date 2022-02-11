// @ts-check
/// <reference types="cypress" />

// use page objects to close the modals, solve the puzzle, etc
import { Start, Playing, Solved } from './utils/pages'
import { solve } from './utils/solver'

describe('Wordle', () => {
  beforeEach(() => {
    cy.fixture('wordlist.json').as('wordList')
  })

  it('sets the solution word using the clock', function () {
    cy.clock(new Date('2022-01-25T18:55:15.554Z'), ['Date'])
    cy.visit('/index.html')
      .its('localStorage.nyt-wordle-state')
      .then(JSON.parse)
      .should('have.property', 'solution', 'sugar')
    Start.close()
    solve('grasp', Playing).should('equal', 'sugar')
    Solved.close()
  })
})
