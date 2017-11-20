var stocks = [{"name":"Test", "price":"9.342", "amount":"15", "id": 0},
          {"name":"Test2", "price":"13.45", "amount":"16", "id": 1},
          {"name":"Test3", "price":"1.34", "amount":"11", "id": 2},
          {"name":"Test4", "price":"23.67", "amount":"5", "id": 3}];

var cryptoExchange = angular.module('cryptoExchange', ['ngRoute'])
  .controller('mainController', function() {
    $('#page-mask').hide();
    var stockPage = this;
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

cryptoExchange.controller('searchController', function(){
    var search = this;
    search.searchStocks = function (event) {
      event.preventDefault();
      var query = $('#search-form').serializeArray()[0]["value"];
      console.log(query);
      var stocks = []//searchForStocks(query);
      //stockpage.stocks = stocks;
    }
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
