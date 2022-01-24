/// <reference types="cypress" />

const path = require('path')
const fs = require('fs')

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  require('cypress-data-session/src/plugin')(on, config)

  on('task', {
    async log(message) {
      console.log(message)
      return message
    },

    async sendAlmostSolved({ screenshot }) {
      console.log('sending almost solved image')
      const screenshotPath = path.join(config.screenshotsFolder, screenshot)
      console.log('screenshotPath', screenshotPath)

      if (!process.env.SENDGRID_API_KEY) {
        console.error('Missing SENDGRID_API_KEY')
        return null
      }

      // https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs
      const sgMail = require('@sendgrid/mail')
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)

      // including images in the SendGrid email is a bit tricky
      // https://sendgrid.com/blog/embedding-images-emails-facts/
      // for small images, inline them in the email
      const imageBase64 = fs.readFileSync(screenshotPath).toString('base64')

      const startWord = config.env.startWord ? config.env.startWord : 'start'
      const msg = {
        to: process.env.WORDLE_HINT_EMAIL,
        from: process.env.SENDGRID_FROM,
        subject: 'Wordle almost solved',
        text: `Almost solved it, see HTML image`,
        html: `
          <div>Start word: <pre>${startWord}</pre></div>
          <div><img src="data:image/png;base64,${imageBase64}" /></div>
          <div>Almost solved by <a href="https://github.com/bahmutov/cypress-wordle">cypress-wordle</a></div>
        `,
      }

      // because the full email might be hidden by the CI, let's only show the first 3 letters
      const maskedEmail = msg.to.slice(0, 3) + '...'
      console.log('sending an almost solved email to %s', maskedEmail)
      const response = await sgMail.send(msg)
      if (response[0].statusCode !== 202) {
        console.error(response)
        throw new Error('SendGrid failed to send the email')
      }

      return response[0]
    },

    async sendHintEmail({ screenshot, hint }) {
      console.log('sending hint %s', hint)
      const screenshotPath = path.join(config.screenshotsFolder, screenshot)
      console.log('screenshotPath', screenshotPath)

      if (!process.env.SENDGRID_API_KEY) {
        console.error('Missing SENDGRID_API_KEY')
        return null
      }

      // https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs
      const sgMail = require('@sendgrid/mail')
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)

      // including images in the SendGrid email is a bit tricky
      // https://sendgrid.com/blog/embedding-images-emails-facts/
      // for small images, inline them in the email
      const imageBase64 = fs.readFileSync(screenshotPath).toString('base64')

      const msg = {
        to: process.env.WORDLE_HINT_EMAIL,
        from: process.env.SENDGRID_FROM,
        subject: 'Wordle daily hint',
        text: `Today's hint: ${hint}`,
        html: `
          <div>Today's hint: <pre>${hint}</pre></div>
          <div><img src="data:image/png;base64,${imageBase64}" /></div>
          <div>Solved by <a href="https://github.com/bahmutov/cypress-wordle">cypress-wordle</a></div>
        `,
      }

      // because the full email might be hidden by the CI, let's only show the first 3 letters
      const maskedEmail = msg.to.slice(0, 3) + '...'
      console.log('sending an email to %s with a hint %s', maskedEmail, hint)
      const response = await sgMail.send(msg)
      if (response[0].statusCode !== 202) {
        console.error(response)
        throw new Error('SendGrid failed to send the email')
      }

      return response[0]
    },
  })
}
