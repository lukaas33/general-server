'use strict'

// Require
const express = require('express')
const app = express()

// Setup
app.set('port', process.env.PORT || 5000) // Chooses a port

// Routes
app.get('/', function (request, response) {
  response.send('Response working')
})

app.listen(app.get('port'), () => console.log(`Node app is running at ${app.get('port')}`))
