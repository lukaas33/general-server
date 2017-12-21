const sql = require('mysql')
const conn = sql.createConnection(process.env.JAWSDB_URL)

const connect = function (callback = () => {}) {
  conn.connect(function (error) {
    if (error) throw error
    console.log('Connected to database')
  })

  var tables = [
    `CREATE TABLE if not exists users (
      ID char(8) primary key not null,
      name char(64) not null,
      country char(64),
      age int
    );`,
    `CREATE TABLE if not exists messages (
      messageID char(16) primary key not null,
      sender char(8) not null,
      receiver char(8) not null,
      message varchar(65536) not null,
      time datetime not null,
      foreign key (sender) references users(ID),
      foreign key (receiver) references users(ID)
    );`
  ]
  var done = tables.length
  for (let index in tables) {
    conn.query(tables[index], function (error, result) {
      if (error) throw error
      done -= 1
      if (done === 0) {
        callback()
      }
    })
  }
}

const end = function (callback = () => {}) {
  conn.end(function (error) {
    if (error) throw error
    console.log('Ended connection to database')
    callback()
  })
}

const query = function (query, callback = () => {}) {
  conn.query(query, function (error, result) {
    if (error) throw error
    callback(result)
  })
}

module.exports = {connect, end, query}
