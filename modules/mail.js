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
    text: `Sent at ${new Date()}.\n${
      'Free memory ' +  Math.round(os.freemem() / os.totalmem())	* 100 + '%'
    }.\n${
      'Hosted at ' + os.hostname() + ' on ' + os.type()
    }.\n${
      'Uptime ' + Math.round(os.uptime()) + 's'
    }.\n\n${
      'Load average ' + os.loadavg()
    }`
  }
}

module.exports = {send, templates}
