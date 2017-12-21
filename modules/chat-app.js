const database = require('./database')

const user = function (action, values) {
  var string = null

  if (action === 'add') {
    string = `INSERT INTO users (ID, name, country, age)
    VALUES ('${values.ID}', '${values.name}', '${values.country}', ${values.age});`
  } else if (action === 'remove') {
    string = `DELETE FROM users
    WHERE ID = '${values}';
    DELETE FROM messages
    WHERE sender = '${values}' or receiver = '${values}';`
  }

  query(string)
}

const message = function (values) {
  var string = `INSERT INTO messages (messageID, sender, receiver, message, time)
  VALUES ('${values.messageID}', '${values.sender}', '${values.receiver}', '${values.message}', '${values.time}');`
  query(string)
}

module.exports = {user, message}
