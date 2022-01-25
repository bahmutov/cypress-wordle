// @ts-check
/// <reference types="cypress" />

// use page objects to close the modals, solve the puzzle, etc
import { Start, Playing } from './pages'

describe('Wordle', () => {
  beforeEach(() => {
    cy.fixture('wordlist.json').as('wordList')
  })

  it('sets the solution word using the clock', function () {
    cy.clock(new Date('2022-01-25T18:55:15.554Z'), ['Date'])
    cy.visit('/')
      .its('localStorage.gameState')
      .then(JSON.parse)
      .should('have.property', 'solution', 'sugar')
    Start.close()
    Playing.solve('grasp').should('equal', 'sugar')
  })
})
