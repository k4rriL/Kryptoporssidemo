var stocks;

var cryptoExchange = angular.module('cryptoExchange', ['ngRoute'])
  .controller('mainController', function($http) {
    $('#page-mask').hide();
    var stockPage = this;

    $http.get('/api/stocks_all').then(
      function successCallback(response) {
        stocks = response.data;
        stockPage.stocks = stocks;
        stockPage.main_stocks = stocks;
      },
      function errorCallback(response) {
        console.log("Connection failed");
      }
    );

    stockPage.buying = false;
    stockPage.selling = false;
    stockPage.currentStock = {};
    stockPage.logged_in = false;
    stockPage.current_user_id = null;
    stockPage.current_user_stocks = [];

    stockPage.buyingStock = function (event) {
      event.preventDefault();
      stockPage.buying = true;
      stockPage.currentStock = stocks[$(event.target).attr('href')];
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
      stockPage.currentStock = stocks[$(event.target).attr('href')];
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
      var query = $('#search-form').serializeArray()[0]["value"].toLowerCase();
      var stocks_query = [];
      for (let i of stockPage.stocks) {
        if (i.full_name.toLowerCase().includes(query) || i.symbol.toLowerCase().includes(query)){
          stocks_query.push(i);
        }
      }
      stockPage.main_stocks = stocks_query;
    }

    stockPage.login = function (event) {
      event.preventDefault();

      //Get login data
      var loginData = $('#login-form').serializeArray();
      var data = {
        "username": loginData[0]["value"];,
        "password": loginData[1]["value"]
      };

      //Post login to discovery server, retrieve user id
      $http.post('http://localhost:5005/login', data).then(
        function successCallback(response) {
          //If login is successful, get user related data
          if (response.data.status == 200){
            stockPage.logged_in = true;
            stockPage.current_user_id = response.data.user_id;

            //Get users stocks
            var query = '/api/portfolio/' + stockPage.current_user_id;
            $http.get(query).then(
              function successCallback(response) {
                var user_stocks = {};
                var keys = Object.keys(response.data);
                for( var key in response.data ){
                  user_stocks[key] = {
                    "symbol": key,
                    "volume": response.data[key]
                  }

                  //Get stock general information
                  var symbol_query = '/api/stocks/' + key;
                  $http.get(symbol_query).then(
                    function successCallback(response) {
                      user_stocks[response.data.symbol]["buy"] = response.data["buy"];
                      user_stocks[response.data.symbol]["sell"] = response.data["sell"];
                    },
                    function errorCallback(response) {}
                  );
                }
                stockPage.current_user_stocks = user_stocks;
              },
              function errorCallback(response) {
                console.log("Connection failed");
              }
            );
          } else {
            console.log("Login failed, try again")
          }
        },
        function errorCallback(response) {
          console.log("Connection failed");
        }
      );
    }

    stockPage.logout = function (event) {
      event.preventDefault();
      stockPage.logged_in = false;
      stockPage.current_user_id = null;
      stockPage.current_user_stocks = [];
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
    var symbol = $routeParams.id;
    $scope.stock = stocks[symbol];
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
    }
]);
