const database = require('./database')
const chatbot = require('./dialogflow-interaction')
const general = require('./general')
var activeUsers = {}

// Functions
const user = function (action, values) {
  if (action === 'add') { // Add new user
    let string = `INSERT INTO users (ID, name, country, age)
    VALUES (?, ?, ?, ?);`

    string = database.format(string, [values.ID, database.escape(values.name), values.country, values.age])
    database.query(string)
  } else if (action === 'remove') { // Remove new user
    let userString = `DELETE FROM users
    WHERE ID = ?`

    userString = database.format(userString, [values])

    let messageString = `DELETE FROM messages
    WHERE sender = ? or receiver = ?`

    messageString = database.format(messageString, [values, values])
    database.query(messageString, (data) => {
      database.query(userString) // Can only run after
    })
  }
}

const message = function (values) {
  var string = `INSERT INTO messages (messageID, sender, receiver, message, time)
  VALUES (?, ?, ?, ?, ?);`

  var querystring = database.format(string, [values.messageID, values.sender, values.receiver, database.escape(values.message), values.time])
  database.query(querystring)

  if (values.receiver === 'chatbot') {
    chatbot.sendText({session: values.sender, text: values.message, event: 'smalltalk'}, (data) => {
      console.log(data)
      var text = database.escape(data.result.fulfillment.speech)
      var time = new Date()
      time = new Date(time.getTime() + 1000) // Make the response appear behind the original message

      var querystring = database.format(string, [general.id(16), 'chatbot', values.sender, text, time.toISOString()])
      database.query(querystring)
    })
  }
}

const get = function (id, callback) {
  var messageString = `SELECT * FROM messages WHERE receiver = ? or sender = ? ORDER BY time DESC`
  messageString = database.format(messageString, [id, id])

  var userString = `SELECT * FROM users WHERE ID != ? ORDER BY name ASC, ID ASC`
  userString = database.format(userString, [id])

  database.query(userString, (users) => {
    database.query(messageString, (messages) => {
      callback({ // Return
        users: users,
        messages: messages
      })
    })
  })

}

const setup = function (app) {
  database.query('DELETE FROM messages')
  database.query('DELETE FROM users')

  user('add', { // Permanent user
    ID: 'chatbot',
    name: 'Luc@$',
    country: null,
    age: null
  })

  // Routes
  app.post('/chat', function (request, response) {
    console.log(request.body)
    if (request.query.action === 'createuser') {
      try {
        user('add', request.body) // Add to database
        response.end('success')
        activeUsers[request.body.ID] = false // Track
        let check = setInterval((id) => {
          console.log('# Chat', 'Exists', id)

          if (activeUsers[id]) { // Has checked in
            activeUsers[id] = false // For next check
          } else { // Hasn't checked in in time
            user('remove', id) // Delete records
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
        message(request.body)
        response.end('success')
      } catch (error) {
        response.end('error')
      }
    }

  })

  app.get('/chat', function (request, response) {
    console.log('# Chat', 'Check in', request.query.id)
    activeUsers[request.query.id] = true // Checks in
    try {
      get(request.query.id, (data) => { // Request for chats
        response.end(JSON.stringify(data))
      })
    } catch (error) {
      console.log('# Chat', 'Data getting', error)
      response.end('error')
    }
  })
}

module.exports = {user, message, get, setup}
