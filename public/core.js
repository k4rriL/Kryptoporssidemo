var stocks;

var cryptoExchange = angular.module('cryptoExchange', ['ngRoute', 'LocalStorageModule'])
  .controller('mainController', function($http, localStorageService) {
    $('#page-mask').hide();
    var stockPage = this;
    stockPage.selling = false;
    stockPage.adding = false;
    stockPage.currentStock = {};
    stockPage.current_user_stocks = [];
    stockPage.localStorageService = localStorageService;

    stockPage.updateUserStocks = function() {
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
          localStorageService.set("currentUserStocks", JSON.stringify(user_stocks));
        },
        function errorCallback(response) {
          console.log("Connection failed");
        }
      );
    }

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

    stockPage.current_user_id = localStorageService.get('currentUser');
    if (stockPage.current_user_id){
      stockPage.logged_in = true;
      stockPage.currentUserBalance = localStorageService.get('currentUserBalance');
      stockPage.updateUserStocks();
    } else {
      stockPage.logged_in = false;
    }

    stockPage.makeSellOffer = function (event) {
      event.preventDefault();
      stockPage.selling = true;
      stockPage.currentStock = stockPage.current_user_stocks[$(event.target).attr('href')];
      $('#page-mask').show();
    }

    stockPage.cancelSellOffer = function (event) {
      event.preventDefault();
      stockPage.currentStock = null;
      stockPage.selling = false;
      $('#page-mask').hide();
    }

    stockPage.sendSellOffer = function (event) {
      event.preventDefault();
      var data = $('#make_sell_offer_form').serializeArray();
      var symbol = data[0]["value"];
      var volume = parseInt(data[1]["value"])

      //get users my_offers
      $http.get('/api/my_offers/' + stockPage.current_user_id).then(
        function successCallback(response){
          console.log(response.data);
          var current = response.data.offers;
          var total_volume = 0;


          if (volume > stockPage.current_user_stocks[symbol].volume || volume < 0){
            $("#sell-offer-warning").html("You don't have that many stocks");
            $("#sell-offer-warning").show();
          } else {
            $("#sell-offer-warning").hide();
            var post_data = {
              "symbol": symbol,
              "buy_sell": false,
              "price": parseFloat(data[2]["value"]),
              "volume": volume,
              "user_id": stockPage.current_user_id,
              "offer_id": new Date().getTime()
            }

            $http.post('/api/stocks', post_data).then(
              function successCallback(response) {
                console.log(response);
                stockPage.currentStock = null;
                stockPage.selling = false;
                stockPage.updateUserStocks();
                $('#page-mask').hide();
              }, function errorCallback(response){
                console.log(response);
              }
            );
          }
        }, function errorCallback(response){}
      );

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
        "username": loginData[0]["value"],
        "password": loginData[1]["value"]
      };

      //Post login to discovery server, retrieve user id
      $http.post('http://localhost:5005/login', data).then(
        function successCallback(response) {
          //If login is successful, get user related data
          if (response.data.status == 200){
            stockPage.logged_in = true;
            stockPage.current_user_id = response.data.user_id;
            localStorageService.set('currentUser', response.data.user_id);
            localStorageService.set('currentUserBalance', response.data.balance);
            stockPage.currentUserBalance = response.data.balance;
            stockPage.updateUserStocks();
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
      localStorageService.set('currentUser', null);
      stockPage.current_user_stocks = [];
    }

    stockPage.addStocks = function (event) {
      event.preventDefault();
      stockPage.adding = true;
      $('#page-mask').show();
    }

    stockPage.cancelAddStocks = function (event) {
      event.preventDefault();
      stockPage.adding = false;
      $('#page-mask').hide();
    }

    stockPage.sendNewStocks = function (event) {
      event.preventDefault();
      var data = $('#add_stock_form').serializeArray();
      var post_data = {
        "symbol": data[0]["value"],
        "full_name": data[1]["value"],
        "volume": parseInt(data[2]["value"]),
        "user_id": stockPage.current_user_id
      }

      $http.post('/api/add_stock', post_data).then(
        function successCallback(response) {
          console.log(response);
          stockPage.adding = false;
          stockPage.updateUserStocks();
          $('#page-mask').hide();
        }, function errorCallback(response){
          console.log(response);
        }
      );
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
          var href = $(this).data("href");
          if (href !== undefined){
            window.location = href;
          }
        }
      });
    });
  });

cryptoExchange.controller('stockPageController', function($scope, $routeParams, $http, localStorageService){
  $('#page-mask').hide();
  $scope.symbol = $routeParams.id;
  $scope.stock = stocks[$scope.symbol];
  $scope.buying = false;
  $scope.selling = false;
  $scope.makingBuyOffer = false;
  $scope.currentOffer = null;
  $scope.localStorageService = localStorageService;

  $scope.updateOffers = function () {
    var query = '/api/offers/' + $scope.symbol;
    $http.get(query).then(
      function successResponse(response){
        $scope.buy_offers = response.data.bids;
        $scope.sell_offers = response.data.offers;
      }, function errorResponse(error){}
    );
  }
  $scope.updateOffers();

  $(document).ready( function (){
    for (i = 0; i < $scope.buy_offers.length; i++){
      if ($scope.buy_offers[i].user_id == $scope.localStorageService.get('currentUser')){
        $(".buy-offers tr:nth-child(" + (i + 1) + ")").addClass("owned");
      }
    }
    for (i = 0; i < $scope.sell_offers.length; i++){
      if ($scope.sell_offers[i].user_id == $scope.localStorageService.get('currentUser')){
        $(".sell-offers tr:nth-child(" + (i + 1) + ")").addClass("owned");
      }
    }

  });


  $scope.updateUserBalance = function (user_id, amount) {
    var query = 'http://localhost:5005/change_balance';
    var data = {
      "user_id": user_id,
      "amount": amount
    }
    $http.post(query, data).then(
      function successCallback(response) {
        console.log(response);
        if (response.data.status == 200){
          if ($scope.localStorageService.get('currentUser') == user_id){
              $scope.localStorageService.set('currentUserBalance', response.data.new_balance);
          }
        }
      }, function errorCallback(error){}
    );
  }

  $scope.buyingStock = function (event) {
    event.preventDefault();
    $scope.buying = true;
    $scope.currentOffer = $scope.sell_offers[$(event.target).closest("tr").index()];
    $('#page-mask').show();
  }

  $scope.cancelBuying = function (event) {
    event.preventDefault();
    $scope.currentOffer = null;
    $scope.buying = false;
    $('#page-mask').hide();
  }

  $scope.buyStock = function (event) {
    event.preventDefault();
    event.stopPropagation();
    if (localStorageService.get('currentUser')){
      if (localStorageService.get('currentUser')!== $scope.currentOffer.user_id){
        $("#buy-warning").hide();
        var data = $('#purchase_form').serializeArray();
        var volume = parseInt(data[1]["value"]);

        if (volume * $scope.currentOffer.price > localStorageService.get('currentUserBalance')){
          $("#buy-warning").html("You don't have enough balance on your account to purchase");
          $("#buy-warning").show();
        } else {
          $("#buy-warning").hide();
          var post_data = {
            "transaction": {
              "symbol": $scope.symbol,
              "price": $scope.currentOffer.price,
              "volume": volume,
              "buyer_id": localStorageService.get('currentUser'),
              "seller_id": $scope.currentOffer.user_id,
              "offer_id": $scope.currentOffer.offer_id
            }
          }

          $http.post('/api/stocks', post_data).then(
            function successCallback(response) {
              $scope.updateUserBalance(localStorageService.get('currentUser'), -$scope.currentOffer.price * volume);
              $scope.updateUserBalance($scope.currentOffer.user_id, $scope.currentOffer.price * volume);
              $scope.updateOffers();
              $scope.buying = false;
              $scope.currentOffer = null;
              $('#page-mask').hide();
            }, function errorCallback(response){
            }
          );
        }
      } else {
        $("#buy-warning").html("You can't complete your own order");
        $("#buy-warning").show();
      }
    }
  }

  $scope.sellingStock = function (event) {
    event.preventDefault();
    $scope.selling = true;
    $scope.currentOffer = $scope.buy_offers[$(event.target).closest("tr").index()];
    $('#page-mask').show();
  }

  $scope.cancelSelling = function (event) {
    event.preventDefault();
    $scope.currentOffer = null;
    $scope.selling = false;
    $('#page-mask').hide();
  }

  $scope.sellStock = function (event) {
    event.preventDefault();
    event.stopPropagation();

    if (localStorageService.get('currentUser')){
      if (localStorageService.get('currentUser')!== $scope.currentOffer.user_id){
        $("#sell-warning").hide();
        var data = $('#sell_form').serializeArray();
        var volume = parseInt(data[1]["value"]);
        if (volume > JSON.parse(localStorageService.get("currentUserStocks"))[$scope.symbol].volume || volume < 0){
          $("#sell-warning").html("You don't have that many stocks");
          $("#sell-warning").show();
        } else {
          $("#sell-warning").hide();
          var post_data = {
            "transaction": {
              "symbol": $scope.symbol,
              "price": $scope.currentOffer.price,
              "volume": volume,
              "seller_id": localStorageService.get('currentUser'),
              "buyer_id": $scope.currentOffer.user_id,
              "offer_id": $scope.currentOffer.offer_id
            }
          }

          $http.post('/api/stocks', post_data).then(
            function successCallback(response) {
              $scope.updateUserBalance(localStorageService.get('currentUser'), $scope.currentOffer.price * volume);
              $scope.updateUserBalance($scope.currentOffer.user_id, -$scope.currentOffer.price * volume);
              $scope.updateOffers();
              $scope.currentOffer = null;
              $scope.selling = false;
              $('#page-mask').hide();
            }, function errorCallback(response){
            }
          );
        }
      }
      else {
        $("#sell-warning").html("You can't complete your own offer");
        $("#sell-warning").show();
      }
    }
  }

  $scope.makeBuyOffer = function (event) {
    event.preventDefault();
    $scope.makingBuyOffer = true;
    $('#page-mask').show();
  }
  $scope.cancelBuyOffer = function (event) {
    event.preventDefault();
    $scope.makingBuyOffer = false;
    $('#page-mask').hide();
  }

  $scope.sendBuyOffer = function (event) {
    event.preventDefault();
    var data = $('#make_buy_offer_form').serializeArray();
    var volume = parseInt(data[1]["value"]);
    var price = parseFloat(data[2]["value"]);
    if (price * volume > localStorageService.get("currentUserBalance")) {
      $("#buy-offer-warning").html("You don't have enough balance on your account to make that offer");
      $("#buy-offer-warning").show();
    } else {
      $("#buy-offer-warning").hide();
      var post_data = {
        "symbol": data[0]["value"],
        "buy_sell": true,
        "price": price,
        "volume": volume,
        "user_id": localStorageService.get('currentUser'),
        "offer_id": new Date().getTime()
      }
      $http.post('/api/stocks', post_data).then(
        function successCallback(response) {
          $scope.updateOffers();
          $scope.makingBuyOffer = false;
          $('#page-mask').hide();
        }, function errorCallback(response){
          console.log(response);
        }
      );
    }
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
    }
]);

cryptoExchange.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setStorageType('sessionStorage')
});
