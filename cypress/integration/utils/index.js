// @ts-check

const silent = { log: false }
const evaluations = ['absent', 'present', 'correct']

export function getLetters() {
  return Cypress._.range(0, 26).map((i) => String.fromCharCode(i + 97))
}

export function countLetters(wordList = []) {
  const counts = {}
  Cypress._.range(0, 26).forEach((i) => {
    counts[String.fromCharCode(i + 97)] = 0
  })

  wordList.forEach((word) => {
    const letters = uniqueLetters(word)
    letters.forEach((letter) => {
      counts[letter]++
    })
  })

  return counts
}

export function uniqueLetters(word) {
  return new Set(word)
}

export function countUniqueLetters(word) {
  return new Set(word).size
}

export function pickWordWithMostCommonLetters(wordList) {
  const letterCounts = countLetters(wordList)

  const wordScores = wordList.map((word) => {
    let score = 0
    const unique = uniqueLetters(word).values()
    for (let letter of unique) {
      score += letterCounts[letter]
    }
    return score
  })
  const wordsWithScores = Cypress._.zip(wordList, wordScores)
  const maxWord = Cypress._.maxBy(wordsWithScores, 1)
  return maxWord[0]
}

export function pickWordWithUniqueLetters(wordList) {
  const partitioned = Cypress._.groupBy(wordList, countUniqueLetters)
  const mostWords = Cypress._.last(Cypress._.values(partitioned))
  console.log(partitioned)
  return Cypress._.sample(mostWords)
}

export function enterWord(word) {
  word.split('').forEach((letter) => {
    cy.window(silent).trigger('keydown', { key: letter, log: false })
  })
  cy.window(silent)
    .trigger('keydown', { key: 'Enter', log: false })
    // let the letter animation finish
    .wait(1000, silent)
}

export function tryNextWord(wordList, word) {
  // we should be seeing the list shrink with each iteration
  cy.log(`Word list has ${wordList.length} words`)
  if (!word) {
    word = pickWordWithUniqueLetters(wordList)
  }
  cy.log(`**${word}**`)
  enterWord(word)
  cy.wait(1000)

  const characters = word.split('')
  // get the last 5 letters
  return cy
    .get('[data-testid=tile]')
    .not('[data-state=empty]')
    .then(($tiles) => $tiles.slice($tiles.length - 5))
    .should('have.length', word.length)
    .then(($tiles) => {
      return $tiles.toArray().map((tile, k) => {
        const letter = tile.innerText.toLowerCase()
        const evaluation = tile.getAttribute('data-state') || 'absent'
        console.log('%d: letter %s is %s', k, letter, evaluation, tile)

        // make sure the letter from the picked word
        if (letter !== characters[k]) {
          throw new Error(
            `Incorrect letter ${k + 1}, found ${letter}, expected ${
              characters[k]
            }`,
          )
        }
        // make sure the evaluation makes sense
        if (!evaluations.includes(evaluation)) {
          throw new Error(`Unknown evaluation ${evaluation}`)
        }
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
