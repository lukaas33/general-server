// << Variables >>
const express = require('express')
const chat = require('../modules/chat')
const router = express.Router()
var activeUsers = {}


// << Setup >>
router.use(function (request, response, next) {
  // Needed headers for cors
  response.setHeader('Access-Control-Allow-Origin', 'https://chat.lukaas33.com');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next() // Next control layer
})


// << Routes >>
router.post('', function (request, response) {
  console.log(request.body)
  if (request.query.action === 'createuser') {
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
      }, 5000, request.body.ID)

    } catch (error) {
      console.log('# Chat', 'User not created', error)
      response.end('error')
    }
  } else if (request.query.action === 'sendmessage') {
    try {
      chat.message(request.body)
      response.end('success')
    } catch (error) {
      response.end('error')
    }
  }
})

router.get('', function (request, response) {
  console.log('# Chat', 'Check in', request.query.id)
  activeUsers[request.query.id] = true // Checks in
  try {
    chat.get(request.query.id, (data) => { // Request for chats
      response.end(JSON.stringify(data))
    })
  } catch (error) {
    console.log('# Chat', 'Data getting', error)
    response.end('error')
  }
})

module.exports = router
