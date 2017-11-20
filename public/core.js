var stocks = [{"full_name":"Test", "buy_price":"9.342", "volume":"15", "id": 0, "symbol":"NOK"},
          {"full_name":"Test2", "buy_price":"13.45", "volume":"16", "id": 1, "symbol":"NOK"},
          {"full_name":"Test3", "buy_price":"1.34", "volume":"11", "id": 2, "symbol":"NOK"},
          {"full_name":"Test4", "buy_price":"23.67", "volume":"5", "id": 3, "symbol":"NOK"}];

var cryptoExchange = angular.module('cryptoExchange', ['ngRoute'])
  .controller('mainController', function() {
    $('#page-mask').hide();
    var stockPage = this;
    stockPage.stocks = stocks;
    stockPage.main_stocks = stocks;
    stockPage.buying = false;
    stockPage.selling = false;
    stockPage.currentStock = {};
    stockPage.logged_in = true;

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
      event.stopPropagation();
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
      var stocks_query = [];
      for (let i of stockPage.stocks) {
        if (i.full_name.includes(query) || i.symbol.includes(query)){
          stocks_query.push(i);
        }
      }
      stockPage.main_stocks = stocks_query;
      for (let i of stockPage.main_stocks) {
          console.log(i);
      }
    }

    $(document).ready(function() {
      $("[href]").each(function() {
          if (this.href == window.location.href) {
              $(this).addClass("active");
          } else {
              $(this).removeClass("active");
          }
      });
    });

    $(document).ready(function($) {
      $(".clickable-row").click(function(event) {
        if (!$(event["originalEvent"].target).is("a")){
          window.location = $(this).data("href");
        }
      });
    });


  });

cryptoExchange.controller('stockPageController', function($scope, $routeParams){
    $scope.stock = stocks[parseInt($routeParams.id)];
    console.log($scope.stock);
});

cryptoExchange.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider){
        $routeProvider.when('/my_stocks/', {
            templateUrl : '/public/my_stocks.html',
            controller  : 'mainController'
        }).when('/stock/:id', {
            templateUrl : '/public/stock_page.html',
            controller  : 'stockPageController'
        }).when('/', {
            templateUrl : '/public/main.html',
            controller  : 'mainController'
        }).otherwise({
            redirectTo: "/"
        });
}]);
