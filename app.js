var app = angular.module('HandiStress', ['ngRoute', 'leaflet-directive', 'ui.bootstrap']);

app.config(function($routeProvider, $locationProvider){
	$routeProvider
		.when('/', {
			templateUrl : 'views/landing.html',
			controller : 'landingController'
		})
		.when('/map', {
			templateUrl : 'views/map.html',
			controller : 'mapController'
		})
		.when('/add-marker', {
			templateUrl : 'views/add-marker.html',
			controller : 'addmarkerController'
		})
		.when('/sign-up', {
			templateUrl : 'views/sign-up.html',
			controller  : 'signupController'
		})
		.otherwise({redirectTo: '/'});

		$locationProvider.html5Mode(true);
});