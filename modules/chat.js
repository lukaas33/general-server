// << Variables >>
const database = require('./database')
const chatbot = require('./dialogflow-interaction')
const general = require('./general')

// << Functions >>
const user = function (action, values) {
  if (action === 'add') { // Add new user
    let string = `INSERT INTO users (ID, name, country, age, pubkey)
    VALUES (?, ?, ?, ?, ?);`

    string = database.format(string, [values.ID, database.escape(values.name), values.country, values.age, values.pubkey])
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
  let string = `INSERT INTO messages (messageID, sender, receiver, message, time)
  VALUES (?, ?, ?, ?, ?);`

  let querystring = database.format(string, [values.messageID, values.sender, values.receiver, database.escape(values.message), values.time])
  database.query(querystring)

  if (values.receiver === 'chatbot') {
    chatbot.sendText({session: values.sender, text: values.message, event: 'smalltalk'}, (data) => {
      console.log(data)
      let text = database.escape(data.result.fulfillment.speech)
      let time = new Date()
      time = new Date(time.getTime() + 1000) // Make the response appear behind the original message

      let querystring = database.format(string, [general.id(16), 'chatbot', values.sender, text, time.toISOString()])
      database.query(querystring)
    })
  }
}

const get = function (id, callback) {
  let messageString = `SELECT * FROM messages WHERE receiver = ? ORDER BY time DESC`
  messageString = database.format(messageString, [id])

  let userString = `SELECT * FROM users WHERE ID != ? ORDER BY name ASC, ID ASC`
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


// << Setup >>
database.query('DELETE FROM messages')
database.query('DELETE FROM users')

user('add', { // Always available
  ID: 'chatbot',
  name: 'Luc@$',
  country: null,
  age: null,
  pubkey: null
})

module.exports = {user, message, get}
