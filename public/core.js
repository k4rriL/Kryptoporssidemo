var cryptoExchange = angular.module('cryptoExchange', [])
  .controller('mainController', function() {
    var stockPage = this;
    var stocks = [{"name":"Test", "price":"9.342", "amount":"15"},
              {"name":"Test", "price":"9.342", "amount":"15"},
              {"name":"Test", "price":"9.342", "amount":"15"},
              {"name":"Test", "price":"9.342", "amount":"15"}];

    stockPage.stocks = stocks;
  });
