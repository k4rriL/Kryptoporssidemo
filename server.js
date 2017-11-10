var express = require('express');
var bc = require('./blockchain.js');
var app = express();

app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile('public/index.html', { root : __dirname});
});

app.get('/my_stocks', function(req, res) {
    res.sendFile('public/my_stocks.html', { root : __dirname});
});

app.listen(5000, function() {
    console.log("Listening on port 5000");
});
