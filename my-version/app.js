var app = angular.module('HandiStress', ['ngRoute']);

app.config(function($routeProvider){
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
});