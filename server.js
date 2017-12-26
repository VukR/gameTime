var request = require("request"); //npm install request
var request = request.defaults({jar: true}) //enable cookies to be used automatically

var loginLink = "https://scsctennis.gametime.net/auth/json-index";
var courtsLink = "http://scsctennis.gametime.net/scheduling/index/jsoncourtdata/sport/1/date/2017-12-26"

request.post({url: loginLink, form: {username: "username", password: "password"}}, function(error, response, body){
  // console.log(response.statusCode)
  // console.log(response.headers["set-cookie"])
  console.log(response.body)

  request.get({url: courtsLink, json: true}, function(error, response, body){
    // console.log(response.statusCode)
    // console.log(response.headers)
    console.log(response.body)
  });
});
