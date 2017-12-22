const database = require('./database')

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
    database.query(userString, (data) => {
      database.query(messageString) // Can only run after
    })
  }
}

const message = function (values) {
  var string = `INSERT INTO messages (messageID, sender, receiver, message, time)
  VALUES ('${values.messageID}', '${values.sender}', '${values.receiver}', '${values.message}', '${values.time}');`
  database.query(string)
}

const get = function (needed, ids, callback) {
  var string = null

  if (needed === 'messages') {
    string = `SELECT * FROM messages WHERE receiver = '${ids[1]}' and sender = '${ids[0]}' ORDER BY time DESC`
  } else if (needed === 'users') {
    string = `SELECT * FROM users WHERE ID != '${ids}' ORDER BY name ASC, ID ASC`
  }

  database.query(string, (data) => {
    callback(data) // Return
  })

}

module.exports = {user, message, get}
