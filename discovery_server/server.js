var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var net = require('net');
var Promise = require('bluebird');
var user_data = require("./user_data.json");
var CryptoJS = require("crypto-js");
var fs = require('fs');
var ip = require('ip');
console.log(ip.address());

app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({'type': 'application/vnd.api+json'}));
app.use('/public', express.static(__dirname + '/public'));
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


global.list = [];

app.post('/add_new', function(req,res) {
    if(req.body.ip != null && req.body.port != null) {
        if( !contains(list, req.body.port)) {
            list.push({"ip": req.body.ip, "port":req.body.port});
            console.log(list);
            res.send({"addressList": list,"status": 200});
        } else {
            res.send({"addressList": list, "status": 200, "message": "Port allready existed in the discovery server list"})
        }
    } else {
        res.send({"status": 400, "message": "Ip or port is not defined in request body"})
    }
})

var contains = function(list, port) {
    var bool = false;
    for (i = 0; i < list.length; i++) {
        if(list[i].port === port){
            bool = true;
        }
    }
    return bool;
}

//palauta lista
app.get('/get_list', function(req, res) {
    res.send({"addressList":list});
});

app.post('/change_balance', function(req, res) {
  var user_id = req.body.user_id;
  var amount = req.body.amount;
  var new_balance = 0;
  for (var i = 0; i < user_data.length; i++) {
    if (user_id == user_data[i].user_id){
      user_data[i].balance += amount;
      new_balance = user_data[i].balance;
    }
  }
  fs.writeFile("./user_data.json", JSON.stringify(user_data), function (err) {
    if (err) return console.log(err);
  });
  res.send({"status": 200, "new_balance": new_balance});
});

app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  if(username != null && password != null) {
    var hashed_password = CryptoJS.SHA256(username + password).toString(CryptoJS.enc.Hex);
    var user_id = "";
    var balance = 0;
    for (var i = 0; i < user_data.length; i++) {
      if (username == user_data[i].username && hashed_password == user_data[i].password){
        user_id = user_data[i].user_id;
        balance = user_data[i].balance;
      }
    }

    if (user_id === ""){
      res.send({"status": 400, "message": "Login failed"});
    } else {
      res.send({"status": 200, "user_id": user_id, "balance": balance});
    }
  } else {
    res.send({"status": 400, "message": "Login failed"});
  }
});


app.listen(5005, function() {
    console.log("Listening on port 5005");
});
