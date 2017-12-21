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
const event = {
  general: new events.EventEmitter(),
  chat: new events.EventEmitter()
}

// Events
event.general.on('day', () => {
  mail.send(mail.templates.status)
})

// Setup
app.set('port', process.env.PORT || 5000) // Chooses a port

clock.schedule('day', '23:00', Infinity, () => {
  event.general.emit('day')
})

app.use(function (request, response, next) {
  // Needed headers for cors
  response.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8880, https://lucas-resume.herokuapp.com, https://www.lukaas33.com')
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  next() // Next control layer
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
