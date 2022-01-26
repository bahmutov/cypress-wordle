// @ts-check
/// <reference types="cypress" />

// common page operations: closing the modals, etc
import { enterWord } from '.'

const silent = { log: false }

export const Start = {
  close() {
    cy.log('**hiding the initial game modal**')
    return cy.get('game-icon[icon=close]:visible').click().wait(1000, silent)
  },
}

export const Playing = {
  // we can reuse utilities by adding them to the page object
  enterWord,

  /**
   * Looks at the entered word row and collects the status of each letter
   */
  getLetters(word) {
    return cy
      .get(`game-row[letters=${word}]`)
      .find('game-tile', silent)
      .should('have.length', word.length)
      .then(($tiles) => {
        return $tiles.toArray().map((tile, k) => {
          const letter = tile.getAttribute('letter')
          const evaluation = tile.getAttribute('evaluation')
          console.log('%d: letter %s is %s', k, letter, evaluation)
          return { k, letter, evaluation }
        })
      })
  },
}

export const Solved = {
  /** Closing the "Solved" dialog */
  close() {
    cy.log('**hiding the solved game modal**')
    cy.get('#share-button').should('be.visible').wait(1000, silent)
    return cy.get('game-icon[icon=close]:visible').click().wait(1000, silent)
  },
}
