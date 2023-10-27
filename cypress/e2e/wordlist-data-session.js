/// <reference types="cypress" />

// Watch the video https://youtu.be/5X4RuyEoQgY

import { countUniqueLetters, pickWordWithMostCommonLetters } from './utils'
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

  console.log('next word is "%s"', word)
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
      if (count === countUniqueLetters(word)) {
        cy.log('**SOLVED**')
        cy.get('#share-button').should('be.visible').wait(1000, silent)
      } else {
        tryNextWord(wordList)
      }
    })
}

describe.skip('Wordle word list using data session', () => {
  beforeEach(() => {
    // load the word list from the site
    // by intercepting it in the JavaScript bundle
    // then store the list in the data session, so it
    // stay there during test restarts and browser reloads
    // https://github.com/bahmutov/cypress-data-session
    cy.dataSession({
      name: 'wordList',
      setup() {
        cy.intercept('GET', '**/main.*.js', (req) => {
          // disable all caching, so we always get a new bundle when needed
          delete req.headers['if-modified-since']

          req.continue((res) => {
            res.headers['cache-control'] = 'no-cache'
            res.headers['pragma'] = 'no-cache'
            delete res.headers.etag

            // by inserting a variable assignment here
            // we will get the reference to the list on the window object
            // which is reachable from this test
            res.body = res.body.replace('=["cigar', '=window.wordList=["cigar')
          })
        })
        // the data session will have the yielded value of the last command
        cy.visit('/').its('wordList')
      },
      validate: true,
      shareAcrossSpecs: true,
    })
    // optionally save the wordlist as a JSON fixture file
    // .then((wordList) => {
    //   cy.writeFile('cypress/fixtures/wordlist.json', wordList)
    // })
  })

  // preserve the local storage to keep the game state, parsed
  let gameState
  // game streak statistics, as a string
  let statistics

  beforeEach(() => {
    if (gameState) {
      // remove the "lastPlayedTs" property from the game state
      gameState.lastPlayedTs = null
      gameState.lastCompletedTs = null
      localStorage.setItem('gameState', JSON.stringify(gameState))
    }
    if (statistics) {
      localStorage.setItem('statistics', statistics)
    }
  })

  afterEach(() => {
    gameState = JSON.parse(localStorage.getItem('nyt-wordle-state') || '')
    statistics = localStorage.getItem('statistics')
  })

  // you could use cypress-each :) to make constructing separate tests better
  Cypress._.range(1, 6).forEach((day) => {
    // this.wordList
    const date = `2022-01-${day}`

    it(`plays the word from ${date}`, function () {
      // set the application clock to desired date,
      // while leaving all other time functions unchanged
      // https://on.cypress.io/clock
      cy.clock(Date.UTC(2022, 0, day), ['Date'])
      cy.visit('/index.html').then(() => {
        console.log(localStorage.getItem('gameState'))
      })

      cy.get('game-icon[icon=close]:visible').click().wait(1000, silent)

      cy.then(() => {
        tryNextWord(this.wordList)
      })
    })
  })
})
