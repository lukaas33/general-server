// << Variables >>
// Require
const python = require('python-shell')


// << Functions >>
const run = function (path, callback = (p) => {}) {
  if (path.indexOf('.py') !== -1) {
      console.log("Running Python file")
    	const process = new python(path)
      process.on('message', (message) => {
        // Print in python
        console.log(path + ':', message)
      })

      callback(process)

  } else if (path.indexOf('.js') !== -1) {
    console.log("Running Javascript file")
  }
}

// Export
module.exports = {run}
