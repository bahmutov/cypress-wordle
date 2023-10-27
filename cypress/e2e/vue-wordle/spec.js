// @ts-check
// solves the Vue version of the Wordle game
// https://github.com/yyx990803/vue-wordle

/// <reference types="cypress" />

import { Playing } from './pages'
import { solve } from '../utils/solver'

describe('Vue Wordle', { baseUrl: 'https://vue-wordle.netlify.app/' }, () => {
  beforeEach(() => {
    cy.fixture('wordlist.json').as('wordList')
  })

  it('finds the word we pass as a query parameter in a single move', () => {
    const word = 'start'
    cy.visit(`/?${btoa(word)}`)
    Playing.enterWord(word)
    Playing.solved('Genius')
  })

  it('finds the target word starting with another word', () => {
    // the word to guess
    const word = 'quick'
    cy.visit(`/?${btoa(word)}`)
    solve('start', Playing).should('equal', word)
  })
})
