const nodemailer = require('nodemailer')
const os = require('os')

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
    text: `${
      'Sent at ' + new Date()
      }.\n${
        'Free memory ' + Math.floor(os.freemem() / 1000) + ' MB'
      }.\n${
        'Hosted at ' + os.hostname() + ' on ' + os.type() + os.arch() + ' ' + os.platform() + os.release()
      }.\n${
        'Uptime ' + Math.floor(os.uptime() / 60 / 60) + ' hours'
      }.\n\n${
        'Load average ' + os.loadavg().join(' - ')
      }\n\n${
        JSON.stringify(os.networkInterfaces()).replace(/,/g, '\n')
      }\n${
        JSON.stringify(os.constants).replace(/,/g, '\n')
      }`
  }
}

module.exports = {send, templates}
