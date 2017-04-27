app.controller('mapController', function($scope , Marker){

	$scope.markers = Marker.getMarkers()
		.then(function(markers){ // Ici tout ce que nous devons faire en cas de succès
			$scope.markers = markers;
		}, function(msg){ // Ici action en cas d'erreur
			console.log(msg);
		});

	$scope.traceMap = function(){
		console.log($scope.traceMap.start);
		console.log($scope.traceMap.end);
	}
});