app.controller('mapController', function($scope , Marker, filterFilter){

	$scope.filter = 1;

	$scope.markers = Marker.getMarkers()
		.then(function(markers){ // Ici tout ce que nous devons faire en cas de succès
			$scope.markers = markers;
		}, function(msg){ // Ici action en cas d'erreur
			console.log(msg);
		});

	$scope.traceMap = function(){
		test = filterFilter($scope.markers, { 'nameMarker': 'Concosrde'}, true );
		if(test.length != 0 ){
			console.log('je suis dedans');
			$scope.markers = test;
		}

		console.log($scope.traceMap.start);
		console.log($scope.traceMap.end);
	}

	$scope.seeAll = function(){
		if($scope.filter == 1){
			$scope.filter = 0;
			// Action à mener pour vider la carte
		}
		else{
			$scope.filter = 1;
		}
	}

	$scope.seePlace = function(){
		if($scope.filter == 2){
			$scope.filter = 0;
			// Action à mener pour vider la carte
		}
		else{
			$scope.filter = 2;
		}
	}

	$scope.seeAccess = function(){
		if($scope.filter == 3){
			$scope.filter = 0;
			// Action à mener pour vider la carte
		}
		else{
			$scope.filter = 3;
		}
	}
});
