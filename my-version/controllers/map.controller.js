app.controller('mapController', function($scope , Marker, filterFilter){
	var allMarkers = [];

	/****************************************
	*** Mise en place de la carte leaflet ***
	****************************************/
	angular.extend($scope, {
		center : {
			lat: 48.847319,
			lng: 2.386581,
			zoom: 12
		},
		markers: {},
		defaults : {
			scrollWheelZomm: false,
			zoomControlPosition: 'topright',
		},
		events: {
			map: {
                enable: ['click', 'drag'], // Les evenements que nous souhaitons ecouté
                logic: 'emit'
            }
        }
	});

	$scope.$on('leafletDirectiveMap.drag', function(){
		console.log($scope.center.lat); // On get la latitude
		console.log($scope.center.lng); // On get la longitude
	});

	$scope.addMarkers = function(){
		angular.extend($scope, {
			markers: {
				m1: {
					lat: 51.505,
					lng: -0.09,
					message: "I'm a static marker",
				},
				m2: {
					lat: 51,
					lng: 0,
					focus: true,
					message: "Hey, drag me if you want",
				}
			}
		})
	}

	$scope.removeMarkers = function(){
		$scope.markers = {};
	}

	// On recupere les marqueurs
	$scope.getMarkers = Marker.getMarkers()
		.then(function(markers){ // Ici tout ce que nous devons faire en cas de succès
			$scope.getMarkers = markers;
			$scope.addMarkers();
		}, function(msg){ // Ici action en cas d'erreur
			console.log(msg);
		});


	/**********************************
	*** Fonction filtre de la carte ***
	**********************************/
	$scope.filter = 1;

	$scope.traceMap = function(){
		test = filterFilter($scope.getMarkers, { 'nameMarker': 'Concosrde'}, true );
		if(test.length != 0 ){
			console.log('je suis dedans');
			$scope.getMarkers = test;
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
