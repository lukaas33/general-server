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
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE')
  next() // Next control layer
})

// Routes
app.get('/', function (request, response) {
  response.send('Web client response')
})


app.post('/chat?createuser', function (request, response) {
  var data = JSON.parse(request.body)
  try {
    chat.user('add', data)
    response.end('sucess')
  } catch (error) {
    response.end(error)
  }
})

app.post('/chat?sendmessage', function (request, response) {
  console.log(request)
  response.end('sucess')
})

app.get('/chat', function (request, response) {
  console.log(request)
  response.end('sucess')
})

app.delete('/chat', function (request, response) {
  console.log(request)
  response.end('success')
})


app.listen(app.get('port'), () => {
  console.log(`Node app is running at ${app.get('port')}`)
})
