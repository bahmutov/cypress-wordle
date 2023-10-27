/// <reference types="cypress" />

it('fills this test', () => {
  cy.clock(new Date('2022-01-25T18:55:15.554Z'), ['Date'])
  cy.visit('/index.html')
})
