/// <reference types="cypress" />

it('replaces the page title', () => {
  cy.intercept('GET', '**/index.html', (req) => {
    req.continue((res) => {
      res.body = res.body.replace(
        '<title>Wordle - The New York Times</title>',
        '<title>Solve</title>',
      )
    })
  }).as('doc')
  cy.visit('/index.html')
  cy.title().should('equal', 'Solve')
})
