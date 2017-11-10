module.exports = function(app) {
    var fs = require('fs');
    var arrayOfStocks;
    fs.readFile('./data/test.json', 'utf-8', function(err, data) {
        if (err) throw err;
        arrayOfStocks = JSON.parse(data);
    });

    // Test
    /*
    app.get('/', function(req, res) {
        res.send("Hello");
    });
    */

    // GET stock test data
    app.get('/api/stocks', function(req, res) {
        //res.send(obj.name + obj.price);
    });

    // POST stock data
    app.post('/api/stocks', function(req, res) {
        console.log(req.body);
        //console.log("===============");
        //console.log(res);
        var obj = {
            name: req.body.name,
            price: req.body.price
        };
        console.log(obj);
        arrayOfStocks.chain.push(obj);
        fs.writeFile('./data/test.json', JSON.stringify(arrayOfStocks), 'utf-8', function(err) {
            if (err) throw err
            console.log("Added " + obj.name + " - " + obj.price);
        });
        res.sendStatus(200);
    });
};
