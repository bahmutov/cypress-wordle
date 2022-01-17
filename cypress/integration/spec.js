/// <reference types="cypress" />

describe('Wordle', () => {
  it('loads', () => {
    cy.visit('/')
      .its('localStorage.gameState')
      .then(JSON.parse)
      .its('solution')
      .then((word) => {
        cy.get('game-icon[icon=close]:visible').click()
        word.split('').forEach((letter) => {
          cy.window().trigger('keydown', { key: letter })
        })
        cy.window().trigger('keydown', { key: 'Enter' })
      })
  })
})
