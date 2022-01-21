/// <reference types="cypress" />

import { pickWordWithMostCommonLetters } from './utils'
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
  // prefer words that have the most distinct letters
  // so we collect more information with each guess
  const word = pickWordWithMostCommonLetters(wordList)
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
      const ordered = [].concat(
        Cypress._.filter(letters, { evaluation: 'correct' }),
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
    .then(() => {
      // after we have entered the word and looked at the feedback
      // we can decide if we solved it, or need to try the next word
      if (count === word.length) {
        cy.log('**SOLVED**')
        cy.get('#share-button').should('be.visible').wait(1000, silent)
        cy.get('game-icon[icon=close]:visible').click().wait(1000, silent)
        cy.get('#board-container')
          .should('be.visible')
          .screenshot('solved', { overwrite: true })
      } else {
        tryNextWord(wordList)
      }
    })
}

describe('Wordle', () => {
  it('uses accessible colors and night mode', () => {
    // look up the word list in the JavaScript bundle
    // served by the application
    cy.intercept('GET', '**/main.*.js', (req) => {
      req.continue((res) => {
        // by inserting a variable assignment here
        // we will get the reference to the list on the window object
        // which is reachable from this test
        res.body = res.body.replace('=["cigar', '=window.wordList=["cigar')
      })
    }).as('words')
    cy.visit('/')
    cy.get('game-icon[icon=close]:visible').click().wait(1000, silent)
    cy.get('#settings-button').click().wait(1000)

    cy.get('game-switch#hard-mode').find('.container').click()
    cy.get('game-switch#hard-mode').should('have.attr', 'checked')
    cy.get('game-switch#dark-theme').find('.container').click()
    cy.get('game-switch#dark-theme').should('have.attr', 'checked')
    cy.get('game-switch#color-blind-theme').find('.container').click()
    cy.get('game-switch#color-blind-theme')
      .should('have.attr', 'checked')
      .wait(1000, silent)
    cy.get('game-icon[icon=close]:visible').click().wait(1000)

    cy.window()
      // the "window.wordList" variable is now available
      // that will be our initial list of words
      .its('wordList')
      .then((wordList) => {
        tryNextWord(wordList)
      })
  })
})
