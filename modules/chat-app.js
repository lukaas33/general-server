const database = require('./modules/database')

const user = function (action, values) {
  var string = null

  if (action === 'add') {
    string = `INSERT INTO users (ID, name, country, age)
    VALUES ('${values[0]}', '${values[1]}', '${values[2]}', ${values[3]});`
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
  VALUES ('${values[0]}', '${values[1]}', '${values[2]}', '${values[3]}', '${values[4]}');`
  query(string)
}

module.exports = {user, message}
