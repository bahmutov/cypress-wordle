// @ts-check
/// <reference types="cypress" />

const silent = { log: false }

// interact with the VueWordle via custom page object
export const Playing = {
  enterWord(word) {
    word.split('').forEach((letter) => {
      cy.window(silent).trigger('keyup', { key: letter, log: false })
    })
    cy.window(silent)
      .trigger('keyup', { key: 'Enter', log: false })
      // let the letter animation finish
      .wait(2000, silent)
  },

  /**
   * Looks at the entered word row and collects the status of each letter
   */
  getLetters(word) {
    return cy
      .get('#board .row .tile.filled.revealed .back')
      .should('have.length.gte', word.length)
      .then(($tiles) => {
        // only take the last 5 letters
        return $tiles
          .toArray()
          .slice(-5)
          .map((tile, k) => {
            const letter = tile.innerText.toLowerCase()
            const evaluation = tile.classList.contains('correct')
              ? 'correct'
              : tile.classList.contains('present')
              ? 'present'
              : 'absent'
            console.log('%d: letter %s is %s', k, letter, evaluation)
            return { k, letter, evaluation }
          })
      })
  },

  /** Checks if the Wordle was solved */
  solved(greeting) {
    // contains the given greeting (like "Genius") ig any
    ;(greeting ? cy.contains('.message', greeting) : cy.get('.message'))
      .should('be.visible')
      // contain the solved tiles minimap
      .find('pre')
      .should('be.visible')
  },
}
