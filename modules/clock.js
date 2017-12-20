const schedule = function (interval, start, times, code) {
  var timesLeft = times
  var now = new Date()

  if (typeof(interval) === 'string') { // Convert string to ms
    switch (interval) {
      case 'week':
        interval = 7 * 24 * 60 * 60 * 1000
      break
      case 'day':
        interval = 24 * 60 * 60 * 1000
      break
      case 'hour':
        interval = 60 * 60 * 1000
      break
      case 'half':
        interval = 30 * 60 * 1000
      break
      case 'minute':
        interval = 60 * 1000
      break
      case 'second':
        interval = 1000
      break
    }
  }

  if (typeof(start) === 'string') { // Convert string to date
    if (start.length === 5) { // Time
      let time = start.split(':')
      start = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        time[0],
        time[1],
        0,
        0
      )
    } else if (start.length === 16) { // Date/time
      let datetime = start.split('/')
      let date = datetime[0].split('-')
      let time = datetime[1].split(':')
      start = new Date(
        date[0],
        date[1],
        date[2],
        time[0],
        time[1],
        0,
        0
      )
    }
  }

  if (typeof(start) === 'object') { // Convert date to ms
    let offset = now.getTimezoneOffset() * 60 * 1000
    start = start.getTime() - (now.getTime() + offset)
  }

  var until = setTimeout(() => { // When it is time
    var execute = () => { // Execute code
      code()

      timesLeft -= 1
      if (timesLeft === 0) {
        clearInterval(timer) // End
      }
    }

    execute() // First
    var timer = setInterval(() => { // Repeat
      execute()
    }, interval)
  }, start)
}

module.exports = {schedule}
