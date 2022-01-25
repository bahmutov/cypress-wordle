// @ts-check
/// <reference types="cypress" />

// common page operations: closing the modals, etc
import { enterWord, pickWordWithUniqueLetters } from './utils'

const silent = { log: false }

export const Start = {
  close() {
    cy.log('**hiding the initial game modal**')
    return cy.get('game-icon[icon=close]:visible').click().wait(1000, silent)
  },
}

export function tryNextWord(wordList, word) {
  // we should be seeing the list shrink with each iteration
  cy.log(`Word list has ${wordList.length} words`)
  if (!word) {
    word = pickWordWithUniqueLetters(wordList)
  }
  cy.log(`**${word}**`)
  enterWord(word)

  return Playing.getLetters(word).then((letters) => {
    // look at the letters by status: first the correct ones,
    // then the present ones, then the absent ones
    const correctLetters = Cypress._.filter(letters, {
      evaluation: 'correct',
    })
    if (correctLetters.length === 5) {
      return word // solved!
    }

    // immediately exclude the current word from the list
    wordList = wordList.filter((w) => w !== word)

    const ordered = [].concat(
      correctLetters,
      Cypress._.filter(letters, { evaluation: 'present' }),
      Cypress._.filter(letters, { evaluation: 'absent' }),
    )

    console.table(ordered)
    const seen = new Set()
    ordered.forEach(({ k, letter, evaluation }) => {
      // only consider the status from the characters
      // we see for the first time in this word
      if (seen.has(letter)) {
        return
      }
      seen.add(letter)

      if (evaluation === 'absent') {
        wordList = wordList.filter((w) => !w.includes(letter))
      } else if (evaluation === 'present') {
        wordList = wordList
          .filter((w) => w.includes(letter))
          // but remove words where the letter is AT this position
          // because then the letter would be "correct"
          .filter((w) => w[k] !== letter)
      } else if (evaluation === 'correct') {
        wordList = wordList.filter((w) => w[k] === letter)
      }
    })
    return tryNextWord(wordList)
  })
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
    cy.get('#share-button').should('be.visible').wait(1000, silent)
    return cy.get('game-icon[icon=close]:visible').click().wait(1000, silent)
  },
}
