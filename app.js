var app = angular.module('HandiStress', ['ui.bootstrap', 'ngRoute', 'leaflet-directive']);

app.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/home.html',
				controller: 'testController'
			})
			.when('/home', {
				templateUrl: 'views/no.html',
				controller: 'HomeController'
			})
			.otherwise({
				redirectTo: '/'
			});

		$locationProvider.html5Mode(true);
}]);