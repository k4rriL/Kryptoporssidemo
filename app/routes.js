module.exports = function(app) {
    var bc = require('../blockchain.js');
    fillWithData();

    // GET stock data
    app.get('/api/stocks', function(req, res) {
        res.send(bc.blockchain);
    });

    // GET front page data
    app.get('/api/stocks_all/', function(req, res) {
        var stocks = {};
        var close = [];

        for (var i = bc.blockchain.length - 1; i >= 0; i--) {
            var data = bc.blockchain[i].data;
            if (data.hasOwnProperty("transaction") &&
                data.transaction.hasOwnProperty("offer_id")) {
                close.push(data.transaction.offer_id);
                if (stocks.hasOwnProperty(data.transaction.symbol)) {
                    if (stocks[data.transaction.symbol].last == null) {
                        stocks[data.transaction.symbol].last = data.transaction.price;
                    }
                } else {
                    stocks[data.transaction.symbol] = {
                        last: data.transaction.price,
                        bid: null,
                        ask: null,
                        volume: 0,
                        symbol: data.transaction.symbol
                    }
                }
            } else if (data.hasOwnProperty("closed")) {
                close.push(data.closed);
            } else if (data.hasOwnProperty("symbol") &&
                close.indexOf(data.offer_id) == -1) {
                if (stocks.hasOwnProperty(data.symbol)) {
                    if (data.buy_sell &&
                       (stocks[data.symbol].bid == null || data.price > stocks[data.symbol].bid))  {
                        stocks[data.symbol].bid = data.price
                    } else if (!data.buy_sell &&
                        (stocks[data.symbol].ask == null || data.price < stocks[data.symbol].ask)) {
                        stocks[data.symbol].ask = data.price;
                    }
                    stocks[data.symbol].volume += data.volume;
                } else {
                    if (data.buy_sell) {
                        stocks[data.symbol] = {
                            last: null,
                            bid: data.price,
                            ask: null,
                            volume: data.volume,
                            symbol: data.symbol
                        };
                    } else {
                        stocks[data.symbol] = {
                            last: null,
                            bid: null,
                            ask: data.price,
                            volume: data.volume,
                            symbol: data.symbol
                        };
                    }
                }
            } else if (data.hasOwnProperty("transaction")) {
                if (stocks.hasOwnProperty(data.transaction.symbol)) {
                    if (stocks[data.transaction.symbol].last == null) {
                        stocks[data.transaction.symbol].last = data.transaction.price;
                    }
                } else {
                    stocks[data.transaction.symbol] = {
                        last: data.transaction.price,
                        bid: null,
                        ask: null,
                        volume: 0,
                        symbol: data.transaction.symbol
                    }
                }
            }
        }

        res.send(stocks);
    });

    // POST orders/transactions
    app.post('/api/stocks', function(req, res) {
        // Should validate data before adding to bc
        bc.addNewBlock(req.body);
        bc.postBlock(req.body, '/api/stocks/recieve');

        // If the transaction's volume is lesser than the offer's volume
        // we close the offer and create a new offer with the offer's volume
        // minus the transaction's volume

        if (req.body.hasOwnProperty("transaction") &&
            req.body.transaction.hasOwnProperty("offer_id")) {
            for (var i = bc.blockchain.length - 1; i >= 0; i--) {
                if (bc.blockchain[i].data.offer_id == req.body.transaction.offer_id &&
                    bc.blockchain[i].data.volume > req.body.transaction.volume) {
                    var oldOffer = bc.blockchain[i].data;
                    var newOffer = {
                        symbol: oldOffer.symbol,
                        buy_sell: oldOffer.buy_sell,
                        price: oldOffer.price,
                        volume: oldOffer.volume - req.body.transaction.volume,
                        user_id: oldOffer.user_id,
                        offer_id: new Date().getTime()
                    }
                    bc.addNewBlock(newOffer);
                    bc.postBlock(newOffer, '/api/stocks/recieve');
                    break;
                }
            }
        }
        res.sendStatus(200);
    });

    // Does exactly the same as up, but does not post block to everyone
    app.post('/api/stocks/recieve', function(req, res) {
        bc.addNewBlock(req.body);
        res.sendStatus(200);
    });

    // GET, closes offer
    app.get('/api/close/:offer_id', function(req, res) {
        var offer_id = parseInt(req.params.offer_id, 10);
        var close = {closed: offer_id};
        bc.addNewBlock(close);
        bc.postBlock(close, '/api/stocks/recieve')
        res.send("Offer " + offer_id + " closed");
    });

    // GET Buy/Sell for stock
    app.get('/api/stocks/:symbol', function(req, res) {
        var symbol = req.params.symbol;
        var buy = null;
        var sell = null;

        for (var i = bc.blockchain.length - 1; i >= 0; i--) {
            var data = bc.blockchain[i].data;
            if (data.hasOwnProperty("price") && data.symbol == symbol.toUpperCase()) {
                if (data.buy_sell) {
                    if (buy == null || data.price > buy) buy = data.price;
                } else {
                    if (sell == null || data.price < sell) sell = data.price;
                }
            }
        }

        res.send({buy: buy, sell: sell, symbol: symbol});
    });

    // GET open bids/offers for stock
    app.get('/api/offers/:symbol', function(req, res) {
        var symbol = req.params.symbol;
        var bids = [];
        var offers = [];
        var closed = [];

        for (var i = bc.blockchain.length - 1; i >= 0; i--) {
            var data = bc.blockchain[i].data;
            if (data.hasOwnProperty("transaction") &&
                data.transaction.hasOwnProperty("offer_id")) {
                closed.push(data.transaction.offer_id);
            } else if (data.hasOwnProperty("closed")) {
                closed.push(data.closed);
            } else if (data.hasOwnProperty("symbol") &&
                data.symbol.toUpperCase() == symbol.toUpperCase()) {
                if (closed.indexOf(data.offer_id) == -1) {
                    if (data.buy_sell) {
                        bids.push({
                            offer_id: data.offer_id,
                            symbol: data.symbol,
                            buy_sell: data.buy_sell,
                            price: data.price,
                            volume: data.volume,
                            user_id: data.user_id
                        });
                    } else {
                        offers.push({
                            offer_id: data.offer_id,
                            symbol: data.symbol,
                            buy_sell: data.buy_sell,
                            price: data.price,
                            volume: data.volume,
                            user_id: data.user_id
                        });
                    }
                }
            }
        }

        res.send({bids: bids, offers: offers});
    });

    //Get the current offers of a user
    app.get('/api/my_offers/:user_id', function(req, res) {
        var user_id = req.params.user_id;
        var bids = [];
        var offers = [];
        var closed = [];

        for (var i = bc.blockchain.length - 1; i >= 0; i--) {
            var data = bc.blockchain[i].data;
            if (data.hasOwnProperty("transaction") &&
                data.transaction.hasOwnProperty("offer_id")) {
                closed.push(data.transaction.offer_id);
            } else if (data.hasOwnProperty("closed")) {
                closed.push(data.closed);
            } else if (data.hasOwnProperty("user_id") &&
                data.user_id.toUpperCase() == user_id.toUpperCase()) {
                if (closed.indexOf(data.offer_id) == -1) {
                    if (data.buy_sell) {
                        bids.push({
                            offer_id: data.offer_id,
                            symbol: data.symbol,
                            buy_sell: data.buy_sell,
                            price: data.price,
                            volume: data.volume,
                            user_id: data.user_id
                        });
                    } else {
                        offers.push({
                            offer_id: data.offer_id,
                            symbol: data.symbol,
                            buy_sell: data.buy_sell,
                            price: data.price,
                            volume: data.volume,
                            user_id: data.user_id
                        });
                    }
                }
            }
        }

        res.send({bids: bids, offers: offers});
    });

    // GET all transaction history
    app.get('/api/transactions/', function(req, res) {
        var transactions = [];

        for (var i = bc.blockchain.length - 1; i >= 0; i--) {
            var data = bc.blockchain[i].data;
            if (data.hasOwnProperty("transaction")) {
                transactions.push(data.transaction);
            }
        }

        res.send({transactions: transactions});
    });

    // GET transaction history for stock
    app.get('/api/transactions/:symbol', function(req, res) {
        var symbol = req.params.symbol;
        var transactions = [];

        for (var i = bc.blockchain.length - 1; i >= 0; i--) {
            var data = bc.blockchain[i].data;
            if (data.hasOwnProperty("transaction") &&
                data.transaction.symbol == symbol.toUpperCase()) {
                transactions.push(data.transaction);
            }
        }

        res.send({transactions: transactions});
    });

    // GET transaction history for user
    app.get('/api/transactions/user/:user_id', function(req, res) {
        var user_id = req.params.user_id;
        var bought = [];
        var sold = [];

        for (var i = bc.blockchain.length - 1; i >= 0; i--) {
            var data = bc.blockchain[i].data;
            if (data.hasOwnProperty("transaction")) {
                if (data.transaction.seller_id.toUpperCase() == user_id.toUpperCase()) {
                    sold.push(data.transaction);
                } else if (data.transaction.buyer_id.toUpperCase() == user_id.toUpperCase()) {
                    bought.push(data.transaction);
                }
            }
        }
        res.send({bought: bought, sold: sold});
    });

    // GET user's portfolio
    app.get('/api/portfolio/:user_id', function(req, res) {
        var user_id = req.params.user_id;
        var portfolio = {};

        for (var i = 0;i <= bc.blockchain.length - 1; i++) {
            var data = bc.blockchain[i].data;
            if (data.hasOwnProperty("transaction")) {
                if (data.transaction.seller_id.toUpperCase() == user_id.toUpperCase()) {
                    if (portfolio.hasOwnProperty(data.transaction.symbol)) {
                        portfolio[data.transaction.symbol] -= data.transaction.volume;
                    }
                } else if (data.transaction.buyer_id.toUpperCase() == user_id.toUpperCase()) {
                    if (portfolio.hasOwnProperty(data.transaction.symbol)) {
                        portfolio[data.transaction.symbol] += data.transaction.volume;
                    } else {
                        portfolio[data.transaction.symbol] = data.transaction.volume;
                    }
                }
            }
        }

        //delete if amount is 0
        var keys = Object.keys(portfolio);
        for (var key in portfolio){
          if (portfolio[key] <= 0){
            delete portfolio[key];
          }
        }
        res.send(portfolio);
    });

    //Add a stock of new type to blockchain by creating a transaction from dummy
    //user to the user that added the stocks
    app.post('/api/add_stock', function(req, res) {
        var dummy_user_id = "company";
        var block = {
            "transaction": {
                "symbol": req.body.symbol,
                "full_name": req.body.full_name,
                "buyer_id": req.body.user_id,
                "seller_id": dummy_user_id,
                "price": 0.0,
                "volume": req.body.volume
            }
        }
        // Should validate data before adding to bc
        bc.addNewBlock(block);
        bc.postBlock(block, '/api/add_stock/recieve')
        res.sendStatus(200);
    });

    app.post('/api/add_stock/recieve', function(req, res) {
        bc.addNewBlock(req.body);
        res.sendStatus(200);
    });

    //Define the starting data
    function fillWithData() {
        // Order Book test data
        var nok1 = {id: 1, symbol: "NOK", buy_sell: true, price: 5.6, volume: 10000, user_id: "abcde9",
            offer_id: "ababab"};
        var nok2 = {id: 2, symbol: "NOK", buy_sell: false, price: 5.7, volume: 8000, user_id: "121298",
            offer_id: "abcdef"};
        var nok3 = {id: 3, symbol: "NOK", buy_sell: true, price: 5.5, volume: 4500, user_id: "909012",
            offer_id: "909091"};
        var nok4 = {id: 4, symbol: "NOK", buy_sell: false, price: 5.65, volume: 3300, user_id: "abcdef",
            offer_id: "abcde9"};
        var kon1 = {id: 5, symbol: "KON", buy_sell: true, price: 40.3, volume: 500, user_id: "120932",
            offer_id: "90192"};
        var kon2 = {id: 6, symbol: "KON", buy_sell: false, price: 40.5, volume: 12500, user_id: "901287",
            offer_id: "001122"};
        var kon3 = {id: 7, symbol: "KON", buy_sell: true, price: 40.1, volume: 8000, user_id: "987898",
            offer_id: "hhggjj"};
        var kon4 = {id: 8, symbol: "KON", buy_sell: false, price: 40.35, volume: 750, user_id: "989898",
            offer_id: "12309j"};
        var kon3 = {id: 9, symbol: "KON", buy_sell: true, price: 40.45, volume: 800, user_id: "909090",
            offer_id: "901287"};

        var nok1_close = {closed: 1};

        // Completed transactions test data
        var t1 = {transaction: {
                "symbol": "KON",
                "buyer_id": "123456",
                "seller_id": "abcdef",
                "price": 44.6,
                "volume": 15000
        }};
        var t2 = {transaction: {
                "symbol": "KON",
                "buyer_id": "987654",
                "seller_id": "abcdef",
                "price": 44.61,
                "volume": 1300
        }};
        var t3 = {transaction: {
                "symbol": "KON",
                "buyer_id": "qwerty",
                "seller_id": "abcdef",
                "price": 44.605,
                "volume": 13000
        }};
        var t4 = {transaction: {
                "symbol": "NOK",
                "buyer_id": "abcdef",
                "seller_id": "901909",
                "price": 5.123,
                "volume": 18000
        }};
        var t5 = {transaction: {
                "symbol": "NOK",
                "buyer_id": "qwerty",
                "seller_id": "abdefl",
                "price": 5.124,
                "volume": 11000
        }};
        var t6 = {transaction: {
                "symbol": "NOK",
                "buyer_id": "987654",
                "seller_id": "atyeoi",
                "price": 5.124,
                "volume": 3000
        }};

        bc.addNewBlock(nok1);
        bc.addNewBlock(nok2);
        bc.addNewBlock(nok3);
        bc.addNewBlock(nok4);
        bc.addNewBlock(kon1);
        bc.addNewBlock(kon2);
        bc.addNewBlock(kon3);
        bc.addNewBlock(kon4);
        bc.addNewBlock(t1);
        bc.addNewBlock(t2);
        bc.addNewBlock(t3);
        bc.addNewBlock(t4);
        bc.addNewBlock(t5);
        bc.addNewBlock(t6);
        //bc.addNewBlock(nok1_close);
    }
};
