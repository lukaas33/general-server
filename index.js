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

app.use(bodyParser.json()) // Enable json parsing
// app.use(bodyParser.urlencoded({extended: true}))

app.use(function (request, response, next) {
  // Needed headers for cors
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next() // Next control layer
})

// Routes
app.get('/', function (request, response) {
  response.send('Web client response')
})


app.post('/chat/createuser', function (request, response) {
  console.log(request.body)
  try {
    chat.user('add', request.body) // Add to database
    response.end('success')
  } catch (error) {
    console.log('User not created', error)
    response.end('error')
  }
})

app.post('/chat/sendmessage', function (request, response) {
  console.log(request)
  response.end('success')
})

app.get('/chat/data/:id', function (request, response) {
  try {
    chat.get(request.params.id, (data) => { // Request for chats
      response.end(JSON.stringify(data))
    })
  } catch (error) {
    console.log('Data getting', error)
    response.end('error')
  }
})

app.delete('/chat/deleteuser', function (request, response) {
  console.log(request)
  response.end('success')
})


app.listen(app.get('port'), () => {
  console.log(`Node app is running at ${app.get('port')}`)
})
