var cryptoExchange = angular.module('cryptoExchange', []);

function mainController($scope, $http) {
    $scope.formData = {};
    stocks = [{"name":"Test", "price":"9.342", "amount":"15"},
              {"name":"Test", "price":"9.342", "amount":"15"},
              {"name":"Test", "price":"9.342", "amount":"15"},
              {"name":"Test", "price":"9.342", "amount":"15"}];

    $scope.stocks = stocks;
}
