const database = require('./database')

const user = function (action, values) {
  var string = null

  if (action === 'add') { // Add new user
    string = `INSERT INTO users (ID, name, country, age)
    VALUES ('${values.ID}', '${values.name}', '${values.country}', ${values.age});`
  } else if (action === 'remove') { // Remove new user
    string = `DELETE FROM users
    WHERE ID = '${values}';
    DELETE FROM messages
    WHERE sender = '${values}' or receiver = '${values}';`
  }

  database.query(string)
}

const message = function (values) {
  var string = `INSERT INTO messages (messageID, sender, receiver, message, time)
  VALUES ('${values.messageID}', '${values.sender}', '${values.receiver}', '${values.message}', '${values.time}');`
  database.query(string)
}

const get = function (id, callback) {
  var messageString = `SELECT * FROM messages WHERE receiver = '${id}' or sender = '${id}' ORDER BY time DESC`
  var userString = `SELECT * FROM users WHERE ID != '${id}' ORDER BY name ASC, ID ASC`

  var left = 2
  var result = {}

  database.query(userString, (data) => {
    result.users = data // Store
    left -= 1
    if (left === 0) {
      callback(result) // Return all
    }
  })
  database.query(messageString, (data) => {
    result.messages = data // Store
    left -= 1
    if (left === 0) {
      callback(result) // Return all
    }
  })

}

module.exports = {user, message, get}
