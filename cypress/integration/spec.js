/// <reference types="cypress" />

// Watch the video "Solve Wordle Game Using Cypress"
// https://youtu.be/pzFzOKEV-eo

describe('Wordle', () => {
  it('loads', () => {
    cy.visit('/index.html')
      .its('localStorage.nyt-wordle-state')
      .then(JSON.parse)
      .its('solution')
      .then((word) => {
        cy.get('game-icon[icon=close]:visible').click()
        word.split('').forEach((letter) => {
          cy.window().trigger('keydown', { key: letter })
        })
        cy.window().trigger('keydown', { key: 'Enter' })
      })

    cy.log('**we solved it**')
    // to catch the toast element, we could freeze
    // the timers on the page using cy.clock command
    // see "Freeze The Page Using cy.clock Command"
    // https://youtu.be/2Q6L6bzqQRY
    cy.get('#game-toaster').contains('Genius').should('be.visible')
    cy.get('game-stats')
      .find('.container')
      .should('be.visible')
      .wait(1000, { log: false })
  })
})
