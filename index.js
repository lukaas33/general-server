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
var activeUsers = {}

// Events
event.general.on('day', () => {
  mail.send(mail.templates.status)
})

var db = require('./modules/database')
db.query('DELETE FROM messages')
db.query('DELETE FROM users')


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
    activeUsers[request.body.ID] = false // Track
    let check = setInterval((id) => {
      console.log('# Chat', 'Exists', id)

      if (activeUsers[id]) { // Has checked in
        activeUsers[id] = false // For next check
      } else { // Hasn't checked in in time
        chat.user('remove', id) // Delete records
        console.log('# Chat', 'Delete', id)
        delete activeUsers[id]
        clearInterval(check)
      }
    }, 15000, request.body.ID)

  } catch (error) {
    console.log('# Chat', 'User not created', error)
    response.end('error')
  }
})

app.post('/chat/sendmessage', function (request, response) {
  console.log(request.body)
  try {
    chat.message(request.body)
    response.end('success')
  } catch (error) {
    response.end('error')
  }
})

app.get('/chat/data/:id', function (request, response) {
  if (request.params.id.indexOf('-') !== -1) {
    try {
      chat.get('messages', request.params.id.split('-'), (data) => {
        response.end(JSON.stringify(data))
      })
    } catch (error) {
      console.log('# Chat', 'Data getting', error)
      response.end('error')
    }

  } else {
    console.log('# Chat', 'Check in', request.params.id)
    activeUsers[request.params.id] = true // Checks in
    try {
      chat.get('users', request.params.id, (data) => { // Request for chats
        response.end(JSON.stringify(data))
      })
    } catch (error) {
      console.log('# Chat', 'Data getting', error)
      response.end('error')
    }
  }
})


app.listen(app.get('port'), () => {
  console.log(`Node app is running at ${app.get('port')}`)
})
