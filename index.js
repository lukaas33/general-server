'use strict'

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

// const input = require('./modules/input')
// const run = require('./modules/run')
const mail = require('./modules/mail')
const clock = require('./modules/clock')
const chat = require('./modules/chat-app')

// Variables
const app = express()
const event = {
  general: new events.EventEmitter()
}

// Events
event.general.on('day', () => {
  // mail.send(mail.templates.status)
})

// Setup
app.set('port', process.env.PORT || 4000) // Chooses a port

clock.schedule('day', '23:00', Infinity, () => {
  event.general.emit('day')
})

app.use(bodyParser.json()) // Enable json parsing
// app.use(bodyParser.urlencoded({extended: true}))

app.use(function (request, response, next) {
  // Needed headers for cors
  response.setHeader('Access-Control-Allow-Origin', 'https://lukaas33.com')
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next() // Next control layer
})

// Routes
app.get('/', function (request, response) {
  response.send('Web client response')
})

chat.setup(app) // The app


app.listen(app.get('port'), () => {
  console.log(`Node app is running at ${app.get('port')}`)
})
