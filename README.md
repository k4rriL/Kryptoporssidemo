# SCI24 - kryptopörssi #

Tässä git repositoryssä sijaitsee SCI24-ryhmän prototyyppi kurssille
SCI-C1000 - SCI-Projektikurssi

## Suunnitelma ##

Tehdään tosi simppeli keksusteluserveri joka pistetään localhostiin pyörii.

Clientit yhdistää serveriin ja saa sieltä tiedon minne lähettää lohkoja.

Clientit on hyvin yksinkertaisia lohkoketjun luojia.

Clientille UI

## Routes ##

**GET /api/stocks** : returns all blocks

**POST /api/stocks** : add orders/transactions to blockchain

order JSON example, note: buy_sell indicates whether the user is buying (true) or selling (false):
```json
{
    "symbol": "NOK",
    "buy_sell": true,
    "price": 4.1,
    "volume": 1000,
    "user_id": 123456
}
```

transaction JSON example:
```json
{
    "transaction": {
        "symbol": "KON",
		"buyer_id": "123456",
		"seller_id": "abcdef",
		"price": 44.6,
		"volume": 15000
    }
}
```

**GET /api/stocks/:symbol** (e.g. /api/stocks/nok): gets buy/sell for a stock (i.e., the highest bid and lowest ask)

JSON response example:
```json
{
    "buy": 5.5,
    "sell": 5.51
}
```

**GET /api/transactions** : gets all completed transactions

JSON response example:
```json
{
    "transactions": [{
        {
            "symbol": "KON",
		    "buyer_id": "123456",
		    "seller_id": "abcdef",
		    "price": 44.6,
		    "volume": 15000
        },
        {
            "symbol": "NOK",
            "buyer_id": "abcdef",
            "seller_id": "123456",
            "price": 5.123,
            "volume": 18000
        }
    }]
}
```

**GET /api/transactions/:symbol** : gets all completed transactions for a stock (see transactions response example above)

**GET /api/transactions/user/:user_id** : gets all completed transactions for a user (see transactions response example above)

**GET /api/portfolio/:user_id** : gets a user's porfolio (i.e. how much of each stock they own)

JSON response example:
```json
{
    "NOK": 11000,
    "KON": 13000
}
```