var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var net = require('net');
var Promise = require('bluebird');
var credentials = require("./credentials.json");
var CryptoJS = require("crypto-js");

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


var list = [{"ip":"127.0.0.1", "port":5004}];

app.post('/add_new', function(req, res) {
    if(req.body.ip != null && req.body.port != null) {
      list.push({"ip": req.body.ip, "port":req.body.port});
      console.log(list);
      res.send({"status": 200});
    } else {
      res.send({"status": 400, "message": "Ip or port is not defined in request body"})
    }
});

//palauta lista
app.get('/get_list', function(req, res) {
  queryOnline(function(){
    res.send(list);
  });
});

app.post('/login', function(req, res) {
  if(req.body.username != null && req.body.password != null) {
    var username = req.body.username;
    var password = req.body.password;
    var hashed_password = CryptoJS.SHA256(username + password).toString(CryptoJS.enc.Hex);
    var user_id = "";
    for (var i = 0; i < credentials.length; i++) {
      if (username == credentials[i].username && hashed_password == credentials[i].password){
        user_id = credentials[i].user_id;
      }
    }

    if (user_id === ""){
      res.send({"status": 400, "message": "Login failed"});
    } else {
      res.send({"status": 200, "user_id": user_id});
    }
  } else {
    res.send({"status": 400, "message": "Login failed"});
  }
});


function checkConnection(host, port, timeout) {
    return new Promise(function(resolve, reject) {
        timeout = timeout || 10000;     // default of 10 seconds
        var timer = setTimeout(function() {
            reject("timeout");
            socket.end();
        }, timeout);
        var socket = net.createConnection(port, host, function() {
            clearTimeout(timer);
            resolve();
            socket.end();
        });
        socket.on('error', function(err) {
            clearTimeout(timer);
            reject(err);
        });
    });
}

//metodi, joka queryttaa ketä listasta on paikalla ja pitää listaa yllä
function queryOnline(callback) {
      //for loopissa i:t läpi, eli listan jäbät
      var newList = [];
      var counter = 1;

      if (list.length == 0) {
        callback();
      }

      for (i = 0; i < list.length; i++) {
        checkIfOnline(list[i], function(returnValue){
          if(returnValue == true){
            newList.push(list[i]);
          }
        })
      }
      list = newList;
      callback();
};

var checkIfOnline = function (client, callback) {
    checkConnection(client["ip"], client["port"]).then(function() {
      callback(true);
  }, function(err) {
    callback(false);
  })
};

app.listen(5005, function() {
    console.log("Listening on port 5005");
});
