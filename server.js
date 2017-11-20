var express = require('express');
var bc = require('./blockchain.js');
var app = express();
var port = process.env.PORT || 8080;
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({'type': 'application/vnd.api+json'}));
app.use(methodOverride());
app.use('/public', express.static(__dirname + '/public'));
require('./app/routes.js')(app);

app.get('/', function(req, res) {
    res.sendFile('public/index.html', { root : __dirname });
});
app.get('/my_stocks', function(req, res) {
    res.sendFile('public/my_stocks.html', { root : __dirname});
});

app.listen(port);
console.log("App listening on port " + port);
