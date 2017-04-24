app.controller('HomeController', ['$scope', 'leafletData',
    function($scope, leafletData){
        $scope.message = "HOME";
		
		$scope.center = {
			lat: 51.505,
			lng: -0.09,
			zoom: 8
		};
		
		leafletData.getMap('mymap').then(function(map) {
            L.GeoIP.centerMapOnPosition(map, 15);
        });
    }
]);