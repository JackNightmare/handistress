app.controller('mapController', function($scope , Marker, filterFilter){

	$scope.markers = Marker.getMarkers()
		.then(function(markers){ // Ici tout ce que nous devons faire en cas de succès
			$scope.markers = markers;
		}, function(msg){ // Ici action en cas d'erreur
			console.log(msg);
		});

	$scope.traceMap = function(){
		test = filterFilter($scope.markers, { 'id': '1'}, true ); // On indique, on veut que la valeur soit strictement egal à l'id
		console.log($scope.traceMap.start);
		console.log($scope.traceMap.end);
	}
});