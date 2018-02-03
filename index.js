'use strict'

// << Variables >>
// Require
const express = require('express')
// const stream = require('stream')
// const crypto = require('crypto')
// const zlib = require('zlib')
// const os = require('os')
// const url = require('url')
// const path = require('path')
const events = require('events')
const bodyParser = require('body-parser')
const helmet = require('helmet')

// const input = require('./modules/input')
// const run = require('./modules/run')
const mail = require('./modules/mail')
const clock = require('./modules/clock')
const chatRouter = require('./apps/chat')

const app = express()
const event = {
  general: new events.EventEmitter()
}


// << Events >>
event.general.on('day', () => {
  // mail.send(mail.templates.status)
})


// << Setup >>
app.set('port', process.env.PORT || 4000) // Chooses a port

clock.schedule('day', '23:00', Infinity, () => {
  event.general.emit('day')
})

app.use(bodyParser.json()) // Enable json parsing
// app.use(bodyParser.urlencoded({extended: true}))
app.use(helmet())
app.use((request, response, next) => {
  // Needed headers for cors
  if (request.headers.origin) { // Not undefined
    if (request.headers.origin.includes('.lukaas33.com')) { // Origin is allowed, with subdomains
      response.setHeader('Access-Control-Allow-Origin', request.headers.origin);
    }
  }
  next() // Next control layer
})

// << Routes >>
app.use('/chat', chatRouter)

app.listen(app.get('port'), () => {
  console.log(`Node app is running at ${app.get('port')}`)
})
