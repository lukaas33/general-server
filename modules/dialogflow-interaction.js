const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
const target = 'https://api.dialogflow.com/v1/query?v=20150910'

const sendText = function (data, callback) {
  let http = new XMLHttpRequest()
  http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callback(JSON.parse(this.responseText))
    }
  }
  http.open('POST', target, true)
  http.setRequestHeader('Authorization', `Bearer ${process.env.DFACCES}`)
  http.setRequestHeader('Content-Type', 'application/json')

  let body = {
    // event: ,
    lang: 'en',
    query: data.text,
    // location: {},
    name: data.event,
    sessionId: data.session
  }

  http.send(JSON.stringify(body))
}

module.exports = {sendText}
