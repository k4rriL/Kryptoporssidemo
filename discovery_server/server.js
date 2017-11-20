var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(express.urlencoded());


var net = require('net');
var Promise = require('bluebird');

var list = [{"ip":"127.0.0.1", "port":5004}];

app.use('/public', express.static(__dirname + '/public'));

app.post('/add_new', function(req, res) {
    if(req.body.ip != null && req.body.port != null){
    list.push({"ip": req.body.ip, "port":req.body.port}); //tämä täytyyy  muuttaa?
    console.log(list);
    res.send({"status": "200"});
    } else {
    res.send({"status": "400", "message": "Ip or port is not defined in request body"})
    }
});

//palauta lista
app.get('/get_list', function(req, res) {
  queryOnline(function(){
    res.send(list);
  });
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
        checkifOnline(list[i], function(returnValue){
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



//laskuri kutsuille, kun on list .length niin lähetä lista




app.listen(5005, function() {
    console.log("Listening on port 5005");
});
