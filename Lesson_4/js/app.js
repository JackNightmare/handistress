var app =  angular.module('MonApp', ['ngRoute']);

app.config(function($routeProvider){
  $routeProvider
    .when('/', {templateUrl : 'views/home.html'})
    .when('/map', {templateUrl : 'views/map.html', controller : 'testScope'})
    .otherwise({redirectTo : '/'});
});

app.controller('testScope', function($scope){
  $scope.comments = [
    {
      'username' : 'Lea',
      'city' : 'Vitry Sur Seine',
      'message' : 'La seule et unique malheureusement'
    },
    {
      'username' : 'Gaby',
      'city' : 'Vitry Sur Seine',
      'message' : 'Une fille etrange mais très sympathique'
    },
    {
      'username' : 'Estelle',
      'city' : 'Bagnolet',
      'message' : 'Celle à qui je dois tout'
    },
    {
      'username' : 'Adrien',
      'city' : 'Charenton le pont',
      'message' : 'Un connard qu\'on aime '
    },
    {
      'username' : 'Totor',
      'city' : 'Vitry Sur Seine',
      'message' : 'Le véritable Batman !'
    }
  ];
});
