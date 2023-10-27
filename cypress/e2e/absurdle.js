/// <reference types="cypress" />

// https://qntm.org/wordle
// https://qntm.org/files/wordle/index.html
describe('Absurdle', { baseUrl: 'https://qntm.org/files/wordle/' }, () => {
  beforeEach(() => {
    cy.fixture('wordlist.json').as('wordList')
  })

  it('solves it', function () {
    cy.visit('/')
    cy.get('[class*=absurdle__guess-box--input]')
      .should('have.length', 5)
      .wait(100)
    const word = 'hello'
    word.split('').forEach((key, k) => {
      cy.document().trigger('keydown', { key }).wait(100)
    })
    // cy.document().wait(1000).trigger('keydown', { key: 'Enter' }).wait(100)
    cy.contains('button', 'enter').click()
  })
})
