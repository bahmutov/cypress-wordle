// @ts-check
// solves the Vue version of the Wordle game
// https://github.com/yyx990803/vue-wordle

/// <reference types="cypress" />

const silent = { log: false }
import { Playing } from './utils/pages'

// interact with the VueWordle via custom page object
const PlayingVueWordle = {
  enterWord(word) {
    word.split('').forEach((letter) => {
      cy.window(silent).trigger('keyup', { key: letter, log: false })
    })
    cy.window(silent)
      .trigger('keyup', { key: 'Enter', log: false })
      // let the letter animation finish
      .wait(2000, silent)
  },

  /**
   * Looks at the entered word row and collects the status of each letter
   */
  getLetters(word) {
    return cy
      .get('#board .row .tile.filled.revealed .back')
      .should('have.length.gte', word.length)
      .then(($tiles) => {
        // only take the last 5 letters
        return $tiles
          .toArray()
          .slice(-5)
          .map((tile, k) => {
            const letter = tile.innerText.toLowerCase()
            const evaluation = tile.classList.contains('correct')
              ? 'correct'
              : tile.classList.contains('present')
              ? 'present'
              : 'absent'
            console.log('%d: letter %s is %s', k, letter, evaluation)
            return { k, letter, evaluation }
          })
      })
  },
}

describe('Vue Wordle', { baseUrl: 'https://vue-wordle.netlify.app/' }, () => {
  beforeEach(() => {
    cy.fixture('wordlist.json').as('wordList')
  })

  it('finds the word we pass as a query parameter in a single move', () => {
    const word = 'start'
    cy.visit(`/?${btoa(word)}`)
    PlayingVueWordle.enterWord(word)
    // TODO: move to a custom page object
    cy.contains('.message', 'Genius').should('be.visible')
  })

  it('finds the target word starting with another word', () => {
    const word = 'start'
    cy.visit(`/?${btoa(word)}`)
    Playing.solve('super', PlayingVueWordle).should('equal', word)
    // TODO: move to a custom page object
    cy.get('.message').should('be.visible').find('pre').should('be.visible')
  })
})
