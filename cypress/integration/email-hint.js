/// <reference types="cypress" />

import { countUniqueLetters, pickWordWithUniqueLetters } from './utils'
const silent = { log: false }

function enterWord(word) {
  word.split('').forEach((letter) => {
    cy.window(silent).trigger('keydown', { key: letter, log: false })
  })
  cy.window(silent)
    .trigger('keydown', { key: 'Enter', log: false })
    // let the letter animation finish
    .wait(2000, silent)
}

function tryNextWord(wordList) {
  // we should be seeing the list shrink with each iteration
  cy.log(`Word list has ${wordList.length} words`)
  const word = pickWordWithUniqueLetters(wordList)
  cy.log(`**${word}**`)
  enterWord(word)

  // count the correct letters. If we have all letters correct, we are done
  let count = 0

  cy.get(`game-row[letters=${word}]`)
    .find('game-tile')
    .should('have.length', word.length)
    .then(($tiles) => {
      return $tiles.toArray().map((tile, k) => {
        const letter = tile.getAttribute('letter')
        const evaluation = tile.getAttribute('evaluation')
        console.log('%d: letter %s is %s', k, letter, evaluation)
        return { k, letter, evaluation }
      })
    })
    .then((letters) => {
      // look at the letters by status: first the correct ones,
      // then the present ones, then the absent ones
      const correctLetters = Cypress._.filter(letters, {
        evaluation: 'correct',
      })
      if (correctLetters.length === 5) {
        return true // solved!
      }

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
          count += 1
          wordList = wordList.filter((w) => w[k] === letter)
        }
      })
    })
    .then((solved) => {
      // after we have entered the word and looked at the feedback
      // we can decide if we solved it, or need to try the next word
      // make sure to compare the "solved" to boolean true
      // because Cypress .then command receives whatever value yielded
      // from the previous command
      if (solved === true) {
        cy.log('**SOLVED**')
        cy.get('#share-button').should('be.visible').wait(1000, silent)
        cy.get('game-icon[icon=close]:visible').click().wait(1000, silent)

        cy.log('**hiding the solved letters**')
        cy.get('game-tile[letter]').each(($gameTile) => {
          cy.wrap($gameTile).find('.tile').invoke('text', '')
        })
        // but keep one of the letters in the solved word
        const randomLetterIndex = Cypress._.random(0, 4)
        const randomLetter = word[randomLetterIndex]
        // prepare text-only hint
        const hint = '01234'
          .replace(randomLetterIndex, randomLetter)
          .replace(/\d/g, '*')

        cy.get(`game-row[letters=${word}]`)
          .find('game-tile[letter]')
          .eq(randomLetterIndex)
          .find('.tile')
          .invoke('text', randomLetter)
          .wait(1500, silent)
        cy.get('#board-container')
          .should('be.visible')
          .screenshot('solved', { overwrite: true })
          .then(() => {
            // the screenshot was saved under the screenshot folder
            // plus the spec filename plus "solved.png"
            const screenshot = `${Cypress.spec.name}/solved.png`
            // use cy.task to email myself the image with the 1 letter hint
            cy.task('sendHintEmail', { screenshot, hint })
          })
      } else {
        tryNextWord(wordList)
      }
    })
}

describe('Wordle', () => {
  beforeEach(() => {
    cy.fixture('wordlist.json').as('wordList')
  })

  it('emails a hint', function () {
    cy.visit('/')
    cy.get('game-icon[icon=close]:visible').click().wait(1000, silent)
    tryNextWord(this.wordList)
  })
})
