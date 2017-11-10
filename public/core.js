var cryptoExchange = angular.module('cryptoExchange', [])
  .controller('mainController', function() {
    var stockPage = this;
    var stocks = [{"name":"Test", "price":"9.342", "amount":"15", "id": 0},
              {"name":"Test", "price":"9.342", "amount":"15", "id": 1},
              {"name":"Test", "price":"9.342", "amount":"15", "id": 2},
              {"name":"Test", "price":"9.342", "amount":"15", "id": 3}];

    stockPage.stocks = stocks;
    stockPage.buying = false;
    stockPage.currentStock = {};
    stockPage.buyStock = function (event) {
      console.log("adsf");
      event.preventDefault();
      stockPage.buying = true;
      stockPage.currentStock = stocks[parseInt($(event.target).attr('href'))];
    }
  });
