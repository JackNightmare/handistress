app.controller('mapController', function($scope , Marker, filterFilter){

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

	$scope.seeAll = function(){
		console.log('test All');
	}

	$scope.seePlace = function(){
		console.log('test Place');
	}

	$scope.seeAccess = function(){
		console.log('test Access');
	}
});
