var app =  angular.module('MonApp', ['ngRoute']);

app.config(function($routeProvider){
  $routeProvider
    .when('/', {templateUrl : 'views/home.html'}) // Juste une view html ici
    .when('/map', {templateUrl : 'views/map.html', controller : 'testFactoryController'}) // On inclut un controller ici
    .when('/test/:id', {templateUrl : 'views/test.html'}) // On y inclut un id qui dependra de l'url
    .otherwise({redirectTo : '/'});
});


app.factory('testFactory', function(){
  var response = {
    // Objet que nous recuperons
    comments : [
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
    ],
    getComments : function (){ // Function nous disant ce que nous souhaitons recupérer
      return response.comments;
    }
  }
  return response;
});

// Controller creer nous permettant de recupérer les données de la factory
app.controller('testFactoryController', function($scope, testFactory){
  $scope.comments = testFactory.getComments();
})

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
