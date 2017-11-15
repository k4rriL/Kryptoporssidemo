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
    stockPage.selling = false;
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

    stockPage.buyStock = function (event) {
      event.preventDefault();
      var data = $('#purchase_form').serializeArray();
      //buyStock(data);
      stockPage.currentStock = null;
      stockPage.buying = false;
      $('#page-mask').hide();
    }

    stockPage.sellingStock = function (event) {
      event.preventDefault();
      stockPage.selling = true;
      stockPage.currentStock = stocks[parseInt($(event.target).attr('href'))];
      $('#page-mask').show();
    }

    stockPage.cancelSelling = function (event) {
      event.preventDefault();
      stockPage.currentStock = null;
      stockPage.selling = false;
      $('#page-mask').hide();
    }

    stockPage.sellStock = function (event) {
      event.preventDefault();
      var data = $('#sell_form').serializeArray();
      //sellStock(data);
      stockPage.currentStock = null;
      stockPage.selling = false;
      $('#page-mask').hide();
    }

    stockPage.searchStocks = function (event) {
      event.preventDefault();
      var query = $('#search-form').serializeArray()[0]["value"];
      console.log(query);
      var stocks = []//searchForStocks(query);
      //stockpage.stocks = stocks;
    }

    $(document).ready(function() {
      $("[href]").each(function() {
          if (this.href == window.location.href) {
              $(this).addClass("active");
          }
      });
  });

  });
