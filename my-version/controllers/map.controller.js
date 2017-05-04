app.controller('mapController', function($scope , Marker, filterFilter){

	/****************************************
	*** Mise en place de la carte leaflet ***
	****************************************/
	angular.extend($scope, {
		center : {
			lat: 48.853403,
			lng: 2.348784,
			zoom: 12
		},
		markers: {},
		tiles : {
			name: 'Mapbox theme',
			url: 'https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamFjazE5IiwiYSI6IlFWWUxfTFkifQ.qKRrC7c1lO1V6ydol1nLsQ',
			type: 'xyz',
			options: {
				apikey: 'pk.eyJ1IjoiamFjazE5IiwiYSI6IlFWWUxfTFkifQ.qKRrC7c1lO1V6ydol1nLsQ',
				mapid: ''
			}
		},
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

	$scope.removeMarkers = function(){
		$scope.markers = {};
	}

	/********************************
	*** Mise en place des markers ***
	********************************/
	var allMarkers = [];

	$scope.getMarkers = Marker.getMarkers()
		.then(function(markers){ // Ici tout ce que nous devons faire en cas de succès
			$scope.getMarkers = markers;
			for(key in markers){
				value = {
					lat: parseFloat(markers[key].latitude), 
					lng: parseFloat(markers[key].longitude) , 
					message: markers[key].nameMarker,
					icon: {
						type: 'awesomeMarker',
						icon : 'usd',
						markerColor: 'blue'
					}
				}
				allMarkers.push(value);
			}
			$scope.markers = allMarkers;

		}, function(msg){ // Ici action en cas d'erreur
			console.log(msg);
		});


	/**********************************
	*** Fonction filtre de la carte ***
	**********************************/
	$scope.filter = 1;

	$scope.traceMap = function(){
		test = filterFilter($scope.getMarkers, { 'nameMarker': 'Concorde'}, true );
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
			$scope.markers = {};
		}
		else{
			$scope.filter = 1;
			$scope.markers = allMarkers;
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
