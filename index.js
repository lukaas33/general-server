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
const database = require('./modules/database')

// Variables
const emit = new events.EventEmitter()
const app = express()

// Events
emit.on('day', () => {
  mail.send(mail.templates.status)
})

// Setup
app.set('port', process.env.PORT || 5000) // Chooses a port

clock.schedule('day', '23:00', Infinity, () => {
  emit.emit('day')
})

database.connect()

// database.query(`SELECT * FROM users`, (result) => {
//   console.log(result)
// })
// database.query(`SELECT * FROM messages`, (result) => {
//   console.log(result)
// })

// database.chat.user('add', ['aaaaaaaa', 'Lucas A', 'Netherlands', 17])
// database.chat.user('add', ['aaaaaaab', 'Lucas B', 'Netherlands', 17])
// database.chat.message(['ggggggggyyyyyyyy', 'aaaaaaaa', 'aaaaaaab', "Hello", '2017-12-20 22:00:00'])


// Routes
app.get('/', function (request, response) {
  response.send('Web client response')
})

app.listen(app.get('port'), () => {
  console.log(`Node app is running at ${app.get('port')}`)
})
