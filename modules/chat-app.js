const database = require('./database')
var activeUsers = {}

// Functions
const user = function (action, values) {
  if (action === 'add') { // Add new user
    let string = `INSERT INTO users (ID, name, country, age)
    VALUES ('${values.ID}', '${values.name}', '${values.country}', ${values.age});`
    database.query(string)
  } else if (action === 'remove') { // Remove new user
    let userString = `DELETE FROM users
    WHERE ID = '${values}'`
    let messageString = `DELETE FROM messages
    WHERE sender = '${values}' or receiver = '${values}'`
    database.query(messageString, (data) => {
      database.query(userString) // Can only run after
    })
  }
}

const message = function (values) {
  var string = `INSERT INTO messages (messageID, sender, receiver, message, time)
  VALUES ('${values.messageID}', '${values.sender}', '${values.receiver}', '${values.message}', '${values.time}');`
  database.query(string)
}

const get = function (id, callback) {
  messageString = `SELECT * FROM messages WHERE receiver = '${id}' or sender = '${id}' ORDER BY time DESC`
  userString = `SELECT * FROM users WHERE ID != '${id}' ORDER BY name ASC, ID ASC`


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

  // Routes
  app.post('/chat/createuser', function (request, response) {
    console.log(request.body)
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
  })

  app.post('/chat/sendmessage', function (request, response) {
    console.log(request.body)
    try {
      message(request.body)
      response.end('success')
    } catch (error) {
      response.end('error')
    }
  })

  app.get('/chat/data/:id', function (request, response) {
    console.log('# Chat', 'Check in', request.params.id)
    activeUsers[request.params.id] = true // Checks in
    try {
      get(request.params.id, (data) => { // Request for chats
        response.end(JSON.stringify(data))
      })
    } catch (error) {
      console.log('# Chat', 'Data getting', error)
      response.end('error')
    }
  })
}

module.exports = {user, message, get, setup}
