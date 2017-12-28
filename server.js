

// receiving post requests with user selected information
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/', function(req, res) {
  console.log(req.body); // the posted data
  storeData(req.body);
});

// todo, store in database recieved info
function storeData(data){
  console.log("in storeData");
  // console.log(typeof(data));
  for (key in data){
    console.log("key:", key);
    console.log("values:", data[key]);
  }
}

app.listen(8080);


// for receiving json from gametime server, todo implement it
// var request = require("request"); //npm install request
// var request = request.defaults({jar: true}) //enable cookies to be used automatically

// var loginLink = "https://scsctennis.gametime.net/auth/json-index";
// var courtsLink = "http://scsctennis.gametime.net/scheduling/index/jsoncourtdata/sport/1/date/2017-12-26"

// request.post({url: loginLink, form: {username: "username", password: "password"}}, function(error, response, body){
//   // console.log(response.statusCode)
//   // console.log(response.headers["set-cookie"])
//   console.log(response.body)

//   request.get({url: courtsLink, json: true}, function(error, response, body){
//     // console.log(response.statusCode)
//     // console.log(response.headers)
//     console.log(response.body)
//   });
// });
