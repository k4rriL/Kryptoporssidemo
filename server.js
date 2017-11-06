var express = require('express');
var app = express();

app.use('/public', express.static(__dirname + '/public'));


app.get('/', function(req, res) {
    res.sendFile('public/index.html', { root : __dirname});
});


app.listen(5000, function() {
    console.log("Listening on port 5000");
});
