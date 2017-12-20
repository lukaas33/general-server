const nodemailer = require('nodemailer')

const send = function (options) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER,
      pass: process.env.AUTH
    }
  })

  transporter.sendMail(options, (error, info) => {
    if (error) throw error
    console.log(`Sent email ${info.response}`)
  })
}

const templates = {
  status: { // Server status
    from: process.env.USER,
    to: process.env.CONTACT,
    subject: 'Automated server update',
    text: `
      Sent at ${new Date()}.
      Nothing else to say really.
    `
  }
}

module.exports = {send, templates}
