app.controller('mapController', function($scope, $http, Marker){
	$http({
		method: 'GET',
		url: 'json/markers.json'
	})
	.then(function successCallback(response) {
		console.log(response);
		$scope.markers = response.data;
	}, function errorCallback(response) {
		console.log(response);
	});
});