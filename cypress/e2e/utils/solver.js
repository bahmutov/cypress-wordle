// @ts-check
/// <reference types="cypress" />

import { pickWordWithUniqueLetters } from '.'

export const evaluations = ['absent', 'present', 'correct']

export function solve(startWord, pageObject) {
  expect(pageObject, 'page object')
    .to.be.an('object')
    .and.to.respondTo('enterWord')
    .and.to.respondTo('getLetters')

  return cy
    .get('@wordList')
    .then((wordList) => tryNextWord(wordList, startWord, pageObject))
}

/**
 * Takes the feedback from the game about each letter,
 * and trims the word list to remove words that don't match.
 */
function updateWordList(wordList, word, letters) {
  letters.forEach((info) => {
    const { letter, evaluation } = info
    if (!evaluations.includes(evaluation)) {
      throw new Error(`Unknown evaluation ${evaluation} for letter ${letter}`)
    }
  })

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
    if (seen.has(letter)) {
      // only consider the status from the characters
      // we see for the first time in this word
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
  return wordList
}

/**
 * Takes the word list and the word and uses the page object
 * to enter the word, get the feedback, and proceed to the next word.
 */
function tryNextWord(wordList, word, pageObject) {
  // we should be seeing the list shrink with each iteration
  cy.log(`Word list has ${wordList.length} words`).then(() => {
    if (!word) {
      word = pickWordWithUniqueLetters(wordList)
      if (!word) {
        throw new Error(
          `Could not pick the next word from a list with ${wordList.length} words`,
        )
      }
    }
    word = word.trim()
    cy.log(`**${word}**`)
    pageObject.enterWord(word)

    return pageObject.getLetters(word).then((letters) => {
      wordList = updateWordList(wordList, word, letters)
      if (wordList === word) {
        // we solved it!
        return word
      }
      return tryNextWord(wordList, null, pageObject)
    })
  })
}
