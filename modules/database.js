const sql = require('mysql')
const conn = sql.createConnection(process.env.JAWSDB_URL)

const connect = function () {
  conn.connect(function (error) {
    if (error) throw error
    console.log('Connected to database')
  })

  var tables = []
  for (let index in tables) {
    conn.query(tables[index], function (error, result) {
      if (error) throw error
      console.log('Table created')
    })
  }
}

const query = function (query) {
  exports.connect()

  conn.query(query, function (error, result) {
    if (error) throw error
  })
  exports.end(conn)
}

const end = function (conn) {
  conn.end(function (error) {
    if (error) throw error
    console.log('Connected to database')
  })
}

module.exports = {query}
