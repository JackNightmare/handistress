var app = angular.module('HandiStress', ['ui.bootstrap', 'ngRoute', 'leaflet-directive']);

app.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$routeProvider
			.when('/home', {
				templateUrl: 'views/home.html',
				controller: 'HomeController'
			})
			.when('/test', {
				templateUrl: 'views/test.html',
				controller: 'TestController'
			})
			.otherwise({
				redirectTo: '/home'
			});

		$locationProvider.html5Mode(true);
}]);