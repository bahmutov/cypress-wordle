# cypress-wordle [![ci](https://github.com/bahmutov/cypress-wordle/actions/workflows/ci.yml/badge.svg?branch=main&event=push)](https://github.com/bahmutov/cypress-wordle/actions/workflows/ci.yml) [![cypress-wordle](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/count/6iu6px/main&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/6iu6px/runs) [![renovate-app badge][renovate-badge]][renovate-app] ![cypress version](https://img.shields.io/badge/cypress-9.6.1-brightgreen) [![hint](https://github.com/bahmutov/cypress-wordle/actions/workflows/hint.yml/badge.svg?branch=main)](https://github.com/bahmutov/cypress-wordle/actions/workflows/hint.yml)

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
- [start.js](./cypress/integration/start.js) lets the user provide the starting word. You can trigger this spec from the GitHub Actions UI using the workflow [start.yml](./.github/workflows/start.yml).
- [vue-wordle/spec.js](./cypress/integration/vue-wordle/spec.js) plays a version of Wordle implemented in [yyx990803/vue-wordle](https://github.com/yyx990803/vue-wordle) interacting via page objects.
- [a-greener-wordle/spec.js](./cypress/integration/a-greener-wordle/spec.js) solves the "Greener Wordle" version hosted at [https://agreenerworldle.org/](https://agreenerworldle.org/).

## Videos

You can find several videos explaining how to play and solve Wordle using Cypress in my playlist [Cypress Wordle](https://www.youtube.com/playlist?list=PLP9o9QNnQuAaihgCPlXyzlj_P-1TTbj-O).

## Presentations

- [Cypress is a GREAT Wordle player](https://slides.com/bahmutov/cypress-is-a-great-wordle-player)

## Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2022

- [@bahmutov](https://twitter.com/bahmutov)
- [glebbahmutov.com](https://glebbahmutov.com)
- [blog](https://glebbahmutov.com/blog)
- [videos](https://www.youtube.com/glebbahmutov)
- [presentations](https://slides.com/bahmutov)
- [cypress.tips](https://cypress.tips)
- [Cypress Advent 2021](https://cypresstips.substack.com/)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/cypress-wordle/issues) on Github

## MIT License

Copyright (c) 2022 Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/
