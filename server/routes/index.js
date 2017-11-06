(function() {
    'use strict';
    var express = require('express');
    var router = express.Router();
    var mongojs = require('mongojs');
    var db = mongojs('crypto_exchange', ['stocks']);

    // GET home page
    router.get('/', function(req, res) {
        res.render('index');
    });

    // GET stocks
    router.get('/api/stocks', function(req, res) {
        db.stocks.find(function(err, data) {
            res.json.data;
        });
    });

    // POST (i.e. add) stock
    router.post('/api/stocks', function(req, res) {
        db.stocks.insert(req.body, function(err, data) {
            res.json(data);
        });
    });

    // PUT (i.e. update) stock
    router.put('api/stocks', function(req, res) {
        db.stocks.update({
            _id: mongojs.ObjectId(req.body._id)
        }, {
            name: req.body.name
        }, {}, function(err, data) {
            res.json(data);
        });
    });

    // DELETE stock
    router.delete('/api/todos/:_id', function(req, res) {
        db.stocks.remove({
            _id: mongojs.ObjectId(req.params._id)
        }, '', function(err, data) {
            res.json(data);
        });
    });

    module.exports = router;
}());
