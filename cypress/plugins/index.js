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
    async sendHintEmail({ screenshot, hint }) {
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
      console.log('sending an email to %s with a hint %s', msg.to, hint)
      const response = await sgMail.send(msg)
      if (response[0].statusCode !== 202) {
        console.error(response)
        throw new Error('SendGrid failed to send the email')
      }

      return response[0]
    },
  })
}
