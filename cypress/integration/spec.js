/// <reference types="cypress" />

// Watch the video "Solve Wordle Game Using Cypress"
// https://youtu.be/pzFzOKEV-eo

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
