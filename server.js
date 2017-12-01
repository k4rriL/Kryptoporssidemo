var express = require('express');
var bc = require('./blockchain.js');
var app = express();
global.port = process.env.PORT || 5000;
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var request = require('request');
var ip = require("ip");

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({'type': 'application/vnd.api+json'}));
app.use(methodOverride());
app.use('/public', express.static(__dirname + '/public'));
require('./app/routes.js')(app);

app.get('/*', function(req, res) {
    res.sendFile('/public/index.html', { root : __dirname});
});

app.listen(port);
console.log("App listening on port " + port);

global.list = [];

var options = {
    url: 'http://localhost:5005/add_new',
    method: 'POST',
    form: {'ip': ip.address(), 'port': port}
};

request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        list = JSON.parse(body).addressList;
    }
});
