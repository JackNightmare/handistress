app.controller('HomeController', ['$scope', 'leafletData', '$http',
    function($scope, leafletData, $http){
        $scope.message = "HOME";
		
		leafletData.getMap('mymap').then(function(map) {
            L.GeoIP.centerMapOnPosition(map, 11);
        });
		
		$scope.markers = {};
		
		$http({
			method: 'GET',
			url: 'https://www.api.benpedia.com/handistress/markers/get.php'
		}).then(function successCallback(response) {
			console.log(response);
			$scope.markers = response.data;
		}, function errorCallback(response) {
			console.log(response);
		});
		
		$scope.$on('leafletDirectiveMarker.click', function(e, args){
			// call api with args.model.id
		});
    }
]);