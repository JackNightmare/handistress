var app = angular.module('HandiStress', ['ngRoute', 'leaflet-directive', 'ui.bootstrap', 'ngMaterial', 'ngAnimate', 'ngGeolocation']);

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

app.run(['$rootScope', '$window', '$location', '$http', function($rootScope, $window, $location, $http) {
	$rootScope.createCookie = function (name, value, days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	};

	$rootScope.readCookie = function (name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	};

	$rootScope.eraseCookie = function (name) {
		$rootScope.createCookie(name, "", -1);
	};
	
	$rootScope.userData = null;
	
	$rootScope.connectionUser = function (token, params) {
		$rootScope.createCookie('handistress_token_connection', token, 365);
		
		$rootScope.userData = params;
	};
	
	$rootScope.connectionAutoUser = function () {
		var cookie = $rootScope.readCookie('handistress_token_connection');
		
		if (cookie != null) {
			var data = {
				token: cookie
			};
			
			$http({
				method: 'POST',
				url: 'https://www.api.benpedia.com/handistress/users/connectionByToken.php',
				headers: {
					'Content-Type': undefined
				},
				data: data
			}).then(function successCallback(response) {
				if (response.data.code == 200) {
					$rootScope.userData = response.data.data;
				}
			}, function errorCallback(response) {
				console.log(response);
			});
		}
	};
	
	$rootScope.connectionAutoUser();
	
	$rootScope.logoutUser = function () {
		$rootScope.eraseCookie('handistress_token_connection');
		
		$rootScope.userData = null;
	};
}]);