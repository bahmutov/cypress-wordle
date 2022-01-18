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
