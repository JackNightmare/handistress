angular
  .module('ui.bootstrap.demo', ['ngAnimate', 'ui.bootstrap'])
  .controller('MainCtrl', function($scope, $http) {
    //ngModel value
    $scope.selected = undefined;
    //lookup values
    $scope.names = [{
      'id': 1,
      'Name': 'Transporter 1',
      'Address': '1 Transporter Address',
      'City': "Nashville",
      'State': 'TN',
      'Zip': "10001",
    }, {
      'id': 2,
      'Name': 'Transporter 2',
      'Address': '2 Transporter Address',
      'City': "Nashville",
      'State': 'TN',
      'Zip': "10001",
    }, {
      'id': 3,
      'Name': 'Transporter 3',
      'Address': '3 Transporter Address',
      'City': "Nashville",
      'State': 'TN',
      'Zip': "10001",
    }, {
      'id': 4,
      'Name': 'Transporter 4',
      'Address': '4 Transporter Address',
      'City': "Nashville",
      'State': 'TN',
      'Zip': "10001",
    }, {
      'id': 5,
      'Name': 'Transporter 5',
      'Address': '5 Transporter Address',
      'City': "Nashville",
      'State': 'TN',
      'Zip': "10001",
    }];
  });