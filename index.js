'use strict'

// Require
const express = require('express')

// const stream = require('stream')
// const crypto = require('crypto')
// const zlib = require('zlib')
// const os = require('os')
// const events = require('events')
// const url = require('url')
// const path = require('path')

// const input = require('./modules/input')
// const run = require('./modules/run')
const mail = require('./modules/mail')
const clock = require('./modules/clock')
const database = require('./modules/database')

// Variables
// const emit = new events.EventEmitter()
const app = express()

// Setup
app.set('port', process.env.PORT || 5000) // Chooses a port
clock.schedule('day', '17:00', 7, () => {
  mail.send(mail.templates.status)
})

// Routes
app.get('/', function (request, response) {
  response.send('Web client response')
})

app.listen(app.get('port'), () => {
  console.log(`Node app is running at ${app.get('port')}`)
})
