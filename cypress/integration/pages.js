/// <reference types="cypress" />

// common page operations: closing the modals, etc
import { enterWord, tryNextWord } from './utils'

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
   * Tries to solve the Wordle game starting with the optional word.
   * If the game is solved, yields the solution word. Assumes, the
   * word list is under the alias "wordList".
   * @param {string} startWord Optional 5 letter word to start with.
   */
  solve(startWord) {
    return cy
      .get('@wordList')
      .then((wordList) => tryNextWord(wordList, startWord))
  },
}

export const Solved = {
  /** Closing the "Solved" dialog */
  close() {
    cy.get('#share-button').should('be.visible').wait(1000, silent)
    return cy.get('game-icon[icon=close]:visible').click().wait(1000, silent)
  },
}
