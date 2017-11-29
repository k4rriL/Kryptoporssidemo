


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
    bc.addNewBlock(req.body);
    res.sendStatus(200);
});
