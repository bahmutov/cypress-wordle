// @ts-check
// solves the Greener Wordle version
// https://agreenerworldle.org/

/// <reference types="cypress" />

import { Start, Playing, Solved } from '../utils/pages'
import { solve } from '../utils/solver'

const baseUrl = 'https://agreenerworldle.org/'

describe.skip('A greener Wordle', { baseUrl }, () => {
  beforeEach(() => {
    // look up the word list in the JavaScript bundle
    // served by the application
    cy.intercept('GET', '**/main.js', (req) => {
      req.continue((res) => {
        // by inserting a variable assignment here
        // we will get the reference to the list on the window object
        // which is reachable from this test. Note that the code is
        // terse, but has newlines
        res.body = res.body.replace(
          /=\s\[\s+"earth"/,
          '=window.wordList=["earth"',
        )
      })
    }).as('words')
    cy.visit('/')
      .its('wordList')
      .as('wordList')
      .its('length')
      .then((n) => cy.log(`${n} words`))
  })

  it('solves it', () => {
    Start.close()
    cy.contains('.title', 'A GREENER WORLDLE')
    solve('earth', Playing)
    Solved.close()
  })
})
