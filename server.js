var request = require("request"); // npm install request
var request = request.defaults({jar: true}) // enable cookies to be used automatically

var mongojs = require("mongojs");
var db = mongojs("localhost:27017/gameTime", ["users"]); // create connection to db, include collections that will be used

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/', function(req, res) {
  storeData(req.body); // data in the body for some reason is nested inside an object?
});

function storeData(data){
  // console.log("in storeData");
  var trimmed = JSON.parse(Object.keys(data)[0]); // removes the unnecessary nesting and converts it from string to object
  var email = trimmed["email"];
  delete trimmed["email"];

  // look for user in database
  db.users.find({"email": email}).count(function(err, count){
    console.log(count);

    // user exists
    if (count > 0){
      db.users.update({"email": email}, {$set:{"courts" :trimmed}});
    } 

    // user does not exist
    else{
      db.users.insert({"email": email});
      db.users.update({"email": email}, {$set:{"courts" :trimmed}});
    }
  });
}

// retrieve data from db
function retrieveData(callback){
  // console.log("in retrieveData");
  db.users.find(function(err, docs){
    callback(docs);
  });
}

// compare database data with gametime server data
function compareData(gtData, dbData){
  console.log("in compare data");
  // console.log(gtData);
  console.log(dbData);

  var userObj, court, time, courts
  for(var i = 0; i < dbData.length; i++){
    userObj = dbData[i] // grabs ith user from documents
    courts = userObj["courts"]; // extract courts user has selected
    // console.log(courts);

    for(var x in courts){
      court = courts[x].court;
      time = courts[x].t;
      // console.log("court:", court, "time:", time);

      var courtBool = true
      for(var y = 0; y < gtData.e[court - 1].b.length; y++){
        if(time == gtData.e[court - 1].b[y].t){
         console.log("Court is still unavailable");
         courtBool = false;
        }
      } 

      if(courtBool){
       console.log('court is available');
      }
    }
  }
}

// every 10 seconds sends request to gametime server 
var makeCall = setInterval(function(){
  var loginLink = "https://scsctennis.gametime.net/auth/json-index";
  var courtsLink = "http://scsctennis.gametime.net/scheduling/index/jsoncourtdata/sport/1/date/2018-01-02";

  request.post({url: loginLink, form: {username: "username", password: "password"}}, function(error, response, body){
    request.get({url: courtsLink, json: true}, function(error, response, body){
      // console.log(response.body);
      // console.log(response.body.e[0].b);

      retrieveData(function(data){
        compareData(response.body, data);
      });
    });
  });
}, 10000);

app.listen(8080);