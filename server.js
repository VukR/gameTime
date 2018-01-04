var request = require("request"); // npm install request
var request = request.defaults({jar: true}) // enable cookies to be used automatically

var nodemailer = require("nodemailer");
var moment = require('moment');

var mongojs = require("mongojs");
// var db = mongojs("localhost:27017/gameTime", ["users"]); // create connection to db, include collections that will be used
var db = mongojs("mongodb://vukey:vukeypassword@ds237947.mlab.com:37947/gametime", ["users"])
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
    // console.log(count);

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
function compareData(gtData, dbData, day){
  // console.log("in compare data");
  // console.log(gtData);
  // console.log(dbData);

  var userObj, court, time, courts
  for(var i = 0; i < dbData.length; i++){
    userObj = dbData[i] // grabs ith user from documents
    courts = userObj["courts"]; // extract courts user has selected
    email = userObj["email"];
    // console.log(courts);

    // db.users.update({"email": "vuk@ualberta.ca"}, {$unset: {"courts.Saturday  6 Court 4 Time 10:00 pm":""}})

    for(var x in courts){
      // console.log(x);
      court = courts[x].court;
      time = courts[x].t;
      var courtBool = true
      var key = "courts."+ x;

      timeMinutes = moment().minutes() + moment().hours() * 60;
      if(x.indexOf(moment().format("dddd")) > -1 && time <= timeMinutes){
        // console.log("removing", key);
        db.users.update({"email":email}, {$unset: {[key]:""}})

      }
      else{

        for(var y = 0; y < gtData.e[court - 1].b.length; y++){
          if(time == gtData.e[court - 1].b[y].t && x.indexOf(day) > -1){
           // console.log("Court is still unavailable");
           courtBool = false;
           courts[x].flag = false;
           // var key = "courts."+ x;
           db.users.update({"email":email}, {$set:{[key] :courts[x]}})
          }
        } 

        if(courtBool && x.indexOf(day) > -1){
          // console.log('court is available');
          if(courts[x].flag){
            // console.log("already sent");
          }
          else{
            // console.log("send email");
            courts[x].flag = true;
            var key = "courts."+ x;
            db.users.update({"email":email}, {$set:{[key] :courts[x]}})

            var message = key.split(".")[1]
            sendEmail(email, message);
          }
        }
      }
    }
  }
}

function sendEmail(email, message){
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
      user: "gametimewatchlist@gmail.com",
      pass: "scscgametimetennis1"
    },
    tls:{
        rejectUnauthorized: false //avoids authorization issue
    }
  });

  var mailOptions = {
    from: "gametimewatchlist@gmail.com",
    to: email,
    subject: "A court has opened up",
    text: message
  };

  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error);
    }
    else{
      console.log("Email sent: ", info.response);
    }
  })
}

// every 10 seconds sends request to gametime server 
var makeCall = setInterval(function(){
  console.log("5 minutes passed");
  var loginLink = "https://scsctennis.gametime.net/auth/json-index";
  request.post({url: loginLink, form: {username: "vukey", password: "tennis1"}}, function(error, response, body){
    for (var i = 0; i < 7; i++){
      //iife to make closure, makes i of the loop be in a function scope
      (function(courtsLink, day){
        request.get({url: courtsLink, json: true}, function(error, response, body){
          // console.log(courtsLink);
          // console.log(courtsLink.slice(-10,courtsLink.length));
          // console.log(day);

          retrieveData(function(data){
            compareData(response.body, data, day);
          });
        });
      })("http://scsctennis.gametime.net/scheduling/index/jsoncourtdata/sport/1/date/" + moment().add(i, "days").format("YYYY-MM-DD"), 
      moment().add(i, "days").format("dddd"));
    }
  });
// }, 10000);
}, 1000 * 60 * 5);

// app.listen(8080);
app.listen(process.env.PORT || 8080);