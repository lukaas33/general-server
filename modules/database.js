const sql = require('mysql')
const conn = sql.createConnection(process.env.JAWSDB_URL)

const connect = function (callback = () => {}) {
  conn.connect(function (error) {
    if (error) throw error
    console.log('Connected to database')
  })
  let tables = [
    `CREATE TABLE if not exists users (
      ID char(8) primary key not null,
      name char(64) not null,
      country char(64),
      age int,
      pubkey varchar(4096)
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
  let done = tables.length
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

const query = function (query, callback = (data) => {}) {
  conn.query(query, function (error, result) {
    if (error) throw error
    callback(result)
  })
}

const escape = function (string) {
  // From https://stackoverflow.com/questions/7744912/making-a-javascript-string-sql-friendly
  result = string.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {  // Escape for sql
    switch (char) {
      case "\0":
        return "\\0";
      case "\x08":
        return "\\b";
      case "\x09":
        return "\\t";
      case "\x1a":
        return "\\z";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case "\"":
      case "'":
      case "\\":
      case "%":
        return char+char
    }
  })
  return result
}

const format = sql.format

module.exports = {connect, end, query, format, escape}
