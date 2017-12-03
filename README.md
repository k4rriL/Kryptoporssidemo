# SCI24 - kryptopörssi #

Tässä git repositoryssä sijaitsee SCI24-ryhmän prototyyppi kurssille
SCI-C1000 - SCI-Projektikurssi

## Suunnitelma ##

Tehdään tosi simppeli keksusteluserveri joka pistetään localhostiin pyörii.

Clientit yhdistää serveriin ja saa sieltä tiedon minne lähettää lohkoja.

Clientit on hyvin yksinkertaisia lohkoketjun luojia.

Clientille UI

## Käyttöohjeet ##

1.	Lataa ja asenna Node.js alusta https://nodejs.org/en/ 
2.	Lataa ohjelma Aalto Version palvelusta: 
https://version.aalto.fi/gitlab/lehtirk1/SCI24-kryptoporssidemo/repository/master/archive.zip 
3.	Pura lataamasi tiedosto haluamaasi kansioon
4.	Navigoi komentorivillä purkamaasi kansioon (kansiossa esimerkiksi tiedosto README.md)
5.	Suorita komento npm install
6.	Siirry kansioon discovery_server
7.	Käynnistä discovery server komennolla node server
Tässä vaiheessa sinun kannattaa luoda useampi komentorivi-ikkuna, jotta voit 
simuloida usean käyttäjän samanaikaista käyttöä. Seuraavat ohjeet voi suorittaa 
niin monta kertaa kuin haluaa eri komentorivi-ikkunoissa.
8.	Siirry takaisin kansioon, jossa suoritettiin ”npm install” komento
9.	Suorita komento env PORT=9000 node server (käytä jokaisessa 
komentorivi-ikkunassa eri lukuarvoa)
10.	Nyt pystyt avaamaan selaimen osoitteeseen http://localhost:9000 
(tai vastaava toinen lukuarvo minkä asetit ohjelmalle kohdassa 9), 
jolloin sinun pitäisi nähdä StockChainin etusivu.
11.	 Pystyt kirjautumaan sisään käyttämällä testikäyttäjiä (testuser, testuser2, 
testuser3, testuser4). Kaikkien salasana on ”password”.



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