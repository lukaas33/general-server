// << Variables >>
const express = require('express')
const chat = require('../modules/chat')
const router = express.Router()
let activeUsers = {}


// << Setup >>
router.use(function (request, response, next) {
  // Needed headers for cors
  response.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8880')
  // response.setHeader('Access-Control-Allow-Origin', 'https://chat.lukaas33.com')
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
      response.send('success')
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
      }, 20000, request.body.ID)

    } catch (error) {
      console.error(error)
      response.send('error')
    }
  } else if (request.query.action === 'sendmessage') {
    try {
      chat.message(request.body)
      response.send('success')
    } catch (error) {
      console.error(error)
      response.send('error')
    }
  }
})

router.get('', function (request, response) {
  console.log('# Chat', 'Check in', request.query.id)
  activeUsers[request.query.id] = true // Checks in
  try {
    chat.get(request.query.id, (data) => { // Request for chats
      response.send(JSON.stringify(data))
    })
  } catch (error) {
    console.error(error)
    response.send('error')
  }
})

module.exports = router
