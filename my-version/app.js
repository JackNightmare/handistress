var app = angular.module('HandiStress', ['ngRoute', 'leaflet-directive']);

app.config(function($routeProvider, $locationProvider){
	$routeProvider
		.when('/', {
			templateUrl : 'views/landing.html'
		})
		.when('/map', {
			templateUrl : 'views/map.html',
			controller : 'mapController'
		})
		.when('/add-marker', {
			templateUrl : 'views/add-marker.html'
		})
		.when('/sign-up', {
			templateUrl : 'views/sign-up.html'
		})
		.otherwise({redirectTo: '/'});

		$locationProvider.html5Mode(true);
});
