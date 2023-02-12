// @ts-check
/// <reference types="cypress" />

// watch the video "Generate A Daily Wordle Hint Email With Screenshot"
// https://youtu.be/NOwNg-Nhv4o

import { tryNextWord } from './utils'

const silent = { log: false }

const maskLetter = '_'

/**
 * Given a 5 letter word, hides all the letters except for N random hints.
 * Returns `*c***` or similar with the hints revealed and the other letters hidden.
 * @param {string} word
 * @param {number} n
 */
function pickHints(word, n) {
  // but keep one of the letters in the solved word
  const positions = '01234'.split('')
  const hintPositions = Cypress._.sampleSize(positions, n)
  let hint = '01234'
  hintPositions.forEach((position) => {
    hint = hint.replace(String(position), word[position])
  })
  // replace the remaining digits with the mask
  return hint.replace(/\d/g, maskLetter)
}

describe('Wordle', () => {
  beforeEach(() => {
    cy.fixture('wordlist.json').as('wordList')
  })

  it('prepares one hint', () => {
    const hint = pickHints('table', 1)
    expect(hint).to.have.length(5)
    // other letters should be hidden
    expect(hint.replace(/[table]/g, '')).to.have.length(4)
  })

  it('prepares two hints', () => {
    const hint = pickHints('table', 2)
    expect(hint).to.have.length(5)
    // other letters should be hidden
    expect(hint.replace(/[table]/g, '')).to.have.length(3)
  })

  it('prepares three hints', () => {
    const hint = pickHints('table', 3)
    expect(hint).to.have.length(5)
    // other letters should be hidden
    expect(hint.replace(/[table]/g, '')).to.have.length(2)
  })

  it('emails a hint', function () {
    const numberOfHints = Cypress.env('hints') || 1
    expect(numberOfHints, 'number of hints').to.be.within(1, 5)

    const closeSelector = '[data-testid=icon-close]'
    cy.visit('/index.html')
    cy.get(closeSelector).click().wait(1000, silent)
    cy.get('#top.ad')
      .should(Cypress._.noop)
      .then(($ad) => {
        if ($ad.length) {
          $ad.remove()
          cy.log('removed top ad')
        }
      })

    tryNextWord(this.wordList).then((word) => {
      // after we have entered the word and looked at the feedback
      // we can decide if we solved it, or need to try the next word
      if (Cypress._.isString(word)) {
        expect(word).to.have.length(5)

        cy.log('**SOLVED**')
        cy.get('[data-testid=modal-overlay][aria-label="stats Modal"]')
          .should('be.visible')
          .scrollIntoView()
          .should('be.visible')
          .wait(1000, silent)
          .find('button[aria-label=Close]')
          .click()
          .wait(1000, silent)

        cy.log('**hiding the solved letters**')
        cy.get('[data-testid=tile]', silent).each(($gameTile) => {
          cy.wrap($gameTile, silent)
            // .find('.tile', silent)
            .invoke(silent, 'text', '')
        })

        const hint = pickHints(word, numberOfHints)
        cy.log(`hint **${hint}**`)
        cy.task('print', `hint **${hint}**`)
        // the hint will be something like "__c_a"
        // let's reveal the tiles containing the letters
        hint.split('').forEach((letter, index) => {
          if (letter !== maskLetter) {
            cy.get('[data-testid=tile]')
              .not('[data-state=empty]')
              .then(($tiles) => $tiles.slice($tiles.length - 5))
              .eq(index)
              .invoke('text', letter)
          }
        })

        // cy.get('#board-container')
        cy.get('[class*=boardContainer]')
          .wait(1500, silent)
          .should('be.visible')
          .screenshot('solved', { overwrite: true })
          .then(() => {
            // the screenshot was saved under the screenshot folder
            // plus the spec filename plus "solved.png"
            const screenshot = `${Cypress.spec.name}/solved.png`
            // use cy.task to email myself the image with the 1 letter hint
            cy.task('sendHintEmail', { screenshot, hint })
          })
      }
    })
  })
})
