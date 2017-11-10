var cryptoExchange = angular.module('cryptoExchange', [])
  .controller('mainController', function() {
    $('#page-mask').hide();
    var stockPage = this;
    var stocks = [{"name":"Test", "price":"9.342", "amount":"15", "id": 0},
              {"name":"Test", "price":"9.342", "amount":"15", "id": 1},
              {"name":"Test", "price":"9.342", "amount":"15", "id": 2},
              {"name":"Test", "price":"9.342", "amount":"15", "id": 3}];

    stockPage.stocks = stocks;
    stockPage.buying = false;
    stockPage.currentStock = {};
    stockPage.buyingStock = function (event) {
      event.preventDefault();
      stockPage.buying = true;
      stockPage.currentStock = stocks[parseInt($(event.target).attr('href'))];
      $('#page-mask').show();
    }

    stockPage.cancelBuying = function (event) {
      event.preventDefault();
      stockPage.currentStock = null;
      stockPage.buying = false;
      $('#page-mask').hide();
    }

  });
