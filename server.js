var mongojs = require("mongojs");
var db = mongojs("localhost:27017/gameTime", ["users"]); // create connection to db, include collections that will be used
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/', function(req, res) {
  // console.log(req.body); // the posted data
  storeData(req.body); // data in the body for some reason is nested inside an object?
});

function storeData(data){
  console.log("in storeData");
  var trimmed = JSON.parse(Object.keys(data)[0]); //removes the unnecessary nesting and converts it from string to object

  var email = trimmed["email"];
  delete trimmed["email"];

  db.users.find({"email": email}).count(function(err, count){
    console.log(count);

    if (count > 0){
      console.log("exists");
      db.users.update({"email": email}, {$set:{"courts" :trimmed}});
    } 

    else{
      console.log("does not exist");
      db.users.insert({"email": email});
      db.users.update({"email": email}, {$set:{"courts" :trimmed}});
    }
  });
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
