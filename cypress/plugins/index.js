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

      const msg = {
        to: process.env.WORDLE_HINT_EMAIL,
        from: process.env.SENDGRID_FROM,
        subject: 'Wordle daily hint',
        text: `Today's hint: ${hint}`,
        html: `Today's hint: <strong>${hint}</strong>`,
        attachments: [
          {
            content: fs.readFileSync(screenshotPath, 'base64'),
            filename: 'hint.png',
            type: 'image/png',
            disposition: 'attachment',
            content_id: 'mytext',
          },
        ],
      }
      console.log('sending an email to %s with a hint %s', msg.to, hint)
      const response = await sgMail.send(msg)
      console.log(response)

      return response[0]
    },
  })
}
