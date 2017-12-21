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

// const input = require('./modules/input')
// const run = require('./modules/run')
const mail = require('./modules/mail')
const clock = require('./modules/clock')
const chat = require('./modules/chat-app')

// Variables
const app = express()
const general = new events.EventEmitter()
const chat = new events.EventEmitter()

// Events
general.on('day', () => {
  mail.send(mail.templates.status)
})

// Setup
app.set('port', process.env.PORT || 5000) // Chooses a port

clock.schedule('day', '23:00', Infinity, () => {
  general.emit('day')
})



// Routes
app.get('/', function (request, response) {
  response.send('Web client response')
})


app.post('/chat', function (request, response) {
  console.log(request)
  response.send('response')
})

app.get('/chat', function (request, response) {
  console.log(request)
  response.send('response')
})

app.delete('/chat', function (request, response) {
  console.log(request)
  response.send('response')
})


app.listen(app.get('port'), () => {
  console.log(`Node app is running at ${app.get('port')}`)
})
