# cypress-wordle [![ci](https://github.com/bahmutov/cypress-wordle/actions/workflows/ci.yml/badge.svg?branch=main&event=push)](https://github.com/bahmutov/cypress-wordle/actions/workflows/ci.yml)

> Solve the Wordle game using Cypress test

![Really solved game](./images/really-solved.png)

## Specs

- [solve.js](./cypress/integration/solve.js) shows a real recursive solution to the Wordle game, watch the video "[Solve Wordle Game For Real Using Cypress](https://youtu.be/zQGLR6qXtq0)".
- [solve-hard-mode.js](./cypress/integration/solve-hard-mode.js) shows how to solve Wordle in Hard mode by optimizing our word picks, watch the video ["Solve Wordle In Hard Mode"](https://youtu.be/SeRLrdtr3Vs).
- [spec.js](./cypress/integration/spec.js) takes a shortcut and looks up the solution in the game state object the application saves in the local storage. Watch the video "[Solve Wordle Game Using Cypress](https://www.youtube.com/watch?v=pzFzOKEV-eo)".
- [control-the-date.js](./cypress/integration/control-the-date.js) overwrites the current date using [cy.clock](https://on.cypress.io/clock) command and plays the Wordle from other dates. Watch the video ["Play Wordle From Any Date Using cy.clock"](https://youtu.be/ZmcOFr2UzZU).
- [play-every-day.js](./cypress/integration/play-every-day.js) sets synthetic Date in each test to accumulate a long winning streak playing every word from Jan 1st to Jan 17th 2022. Find the recording [here](https://youtu.be/5X4RuyEoQgY).
- [colors.js](./cypress/integration/colors.js) plays the game using color accessible mode using the dark theme. Saves the screenshot of the solution in the "cypress/screenshots" folder.
- [wordlist-data-session.js](./cypress/integration/wordlist-data-session.js) uses [cypress-data-session](https://github.com/bahmutov/cypress-data-session) plugin to download and keep the word list array cached in memory. Watch the video ["Use cypress-data-session To Store The Word List"](https://youtu.be/UZwE1KTz-98).
- [email-hint.js](./cypress/integration/email-hint.js) hides all letters in the solution but one and emails the screenshot of the solved puzzle daily to myself. Watch the video ["Generate A Daily Wordle Hint Email With Screenshot"](https://youtu.be/NOwNg-Nhv4o).

## Videos

You can find several videos explaining how to play and solve Wordle using Cypress in my playlist [Cypress Wordle](https://www.youtube.com/playlist?list=PLP9o9QNnQuAaihgCPlXyzlj_P-1TTbj-O).
