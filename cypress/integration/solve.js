/// <reference types="cypress" />

// Watch video "Solve Wordle Game For Real Using Cypress"
// https://youtu.be/zQGLR6qXtq0

function enterWord(word) {
  word.split('').forEach((letter) => {
    cy.window().trigger('keydown', { key: letter })
  })
  cy.window()
    .trigger('keydown', { key: 'Enter' })
    // let the letter animation finish
    .wait(2000)
}

function tryNextWord(wordList) {
  // we should be seeing the list shrink with each iteration
  console.log('word list with %d words', wordList.length)
  if (wordList.length < 20) {
    console.log(wordList)
  }
  const word = Cypress._.sample(wordList)
  enterWord(word)

  // count the correct letters. If we have all letters correct, we are done
  let count = 0
  // WORDLE implementation only reports the status for the first letter appearance
  // thus we cannot simple filter out the letters if we have seen them already
  const seen = new Set()
  cy.get(`game-row[letters=${word}]`)
    .find('game-tile')
    .should('have.length', word.length)
    .each(($tile, k) => {
      const letter = $tile.attr('letter')
      // only consider the status from the characters
      // we see for the first time in this word
      if (seen.has(letter)) {
        return
      }
      seen.add(letter)
      const evaluation = $tile.attr('evaluation')

      if (evaluation === 'absent') {
        wordList = wordList.filter((w) => !w.includes(letter))
      } else if (evaluation === 'present') {
        wordList = wordList.filter((w) => w.includes(letter))
      } else if (evaluation === 'correct') {
        count += 1
        wordList = wordList.filter((w) => w[k] === letter)
      }
    })
    .then(() => {
      // after we have entered the word and looked at the feedback
      // we can decide if we solved it, or need to try the next word
      if (count === word.length) {
        cy.log('**SOLVED**')
      } else {
        tryNextWord(wordList)
      }
    })
}

describe('Wordle', () => {
  it('solves it', () => {
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
      // the "window.wordList" variable is now available
      // that will be our initial list of words
      .its('wordList')
      .then((wordList) => {
        cy.get('game-icon[icon=close]:visible').click().wait(1000)

        tryNextWord(wordList)
      })
  })
})
