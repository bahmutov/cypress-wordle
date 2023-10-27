/// <reference types="cypress" />

it.skip('fills this test', () => {
  cy.clock(new Date('2022-01-25T18:55:15.554Z'), ['Date'])
  cy.visit('/index.html')
  /* ==== Generated with Cypress Studio ==== */
  cy.get('[data-testid="icon-close"]').click()
  cy.get('[data-key="s"]').click()
  cy.get('[data-key="u"]').click()
  cy.get('[data-key="p"]').click()
  cy.get('[data-key="e"]').click()
  cy.get('[data-key="r"]').click()
  cy.get('[data-key="↵"]').click()
  cy.get(
    '[data-testid=tile][data-animation=idle]:not([data-state="empty"])',
  ).should('have.length', 5)
  cy.get('[data-key="s"]').click()
  cy.get('[data-key="u"]').click()
  cy.get('[data-key="g"]').click()
  cy.get('[data-key="a"]').click()
  cy.get('[data-key="r"]').click()
  cy.get('[data-key="↵"]').click()
  cy.get(
    '[data-testid=tile][data-animation=idle]:not([data-state="empty"])',
  ).should('have.length', 10)
  cy.get('[data-testid="icon-close"]').wait(1000).click()
  /* ==== End Cypress Studio ==== */
})
