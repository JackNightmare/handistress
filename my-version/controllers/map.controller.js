app.controller('mapController', function($scope , Marker, filterFilter, leafletData ){

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
						icon : 'apple',
						iconColor : 'white',
						markerColor: 'black'
					}
				}
				allMarkers.push(value);
			}
			$scope.markers = allMarkers;

		}, function(msg){ // Ici action en cas d'erreur
			console.log(msg);
		});


	/**********************
	*** Action drag map ***
	**********************/
	$scope.$on('leafletDirectiveMap.drag', function(){
		console.log($scope.center.lat); // On get la latitude
		console.log($scope.center.lng); // On get la longitude
	});

	/**********************************
	*** Fonction filtre de la carte ***
	**********************************/
	$scope.filter = 1;
	$scope.typeForm = 'test1';


	$scope.traceMap = function(){
		startPoint = filterFilter($scope.getMarkers, { 'nameMarker': $scope.traceMap.start}, true );
		endPoint = filterFilter($scope.getMarkers, { 'nameMarker': $scope.traceMap.end}, true );

		$scope.markers = {}; // On vide le markers sur la carte
		// infoTrace = []; // On vide la variable pour tracer l'itinéraire

		if(startPoint.length > 0 && endPoint.length > 0){

			leafletData.getMap().then(function(map){
				
				map.fitBounds([
					[parseFloat(startPoint[0]['latitude']), parseFloat(startPoint[0]['longitude'])],
					[parseFloat(endPoint[0]['latitude']), parseFloat(endPoint[0]['longitude'])]
				]);

				L.Routing.control({
					waypoints: [
						L.latLng(parseFloat(startPoint[0]['latitude']), parseFloat(startPoint[0]['longitude'])),
						L.latLng(parseFloat(endPoint[0]['latitude']), parseFloat(endPoint[0]['longitude']))
					],
					routeWhileDragging: true,
					reverseWaypoints: true,
					showAlternatives: true,
					altLineOptions: {
						styles: [
							{color: 'black', opacity: 0.15, weight: 9},
							{color: 'white', opacity: 0.8, weight: 6},
							{color: 'blue', opacity: 0.5, weight: 2}
						]
					}
				}).addTo(map);
			});

			// valueStart = {
			// 				lat : parseFloat(startPoint[0]['latitude']),
			// 				lng : parseFloat(startPoint[0]['longitude']),
			// 				message : startPoint[0]['nameMarker']
			// 			};
			//
			// valueEnd = {
			// 				lat : parseFloat(endPoint[0]['latitude']),
			// 				lng : parseFloat(endPoint[0]['longitude']),
			// 				message : endPoint[0]['nameMarker']
			// 			};
			//
			// infoTrace.push(valueStart);
			// infoTrace.push(valueEnd);

			// $scope.markers = infoTrace;
		}
	}

	$scope.searchMap = function(){
		$scope.markers = {};
		resultSearch = [];

		theSearch = filterFilter($scope.getMarkers, { 'infoSearch': $scope.searchMap.value});

		if(theSearch.length > 0){
			for (keySearch in theSearch){
				infoResult = {
					lat : parseFloat(theSearch[keySearch]["latitude"]),
					lng : parseFloat(theSearch[keySearch]["longitude"]),
					message : theSearch[keySearch]["nameMarker"],
					icon: {
						type: 'awesomeMarker',
						icon : 'apple',
						iconColor : 'white',
						markerColor: 'black'
					}
				};

				resultSearch.push(infoResult);
			}
		}

		$scope.markers = resultSearch;
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

	$scope.switchForm = function(){
		if($scope.typeForm == 'test1'){
			$scope.typeForm = 'test2';
		}
		else{
			$scope.typeForm = 'test1';
		}
	}

	$scope.removeMarkers = function(){
		$scope.markers = {};
	}

	// $scope.addRouting = function(){
		// leafletData.getMap().then(function(map){
		// 	map.fitBounds([ [48.54, 2.54],[48.60, 2.60] ]);
		//
		// 	L.Routing.control({
		// 		waypoints: [
		// 			L.latLng(48.54, 2.54),
		// 			L.latLng(48.60, 2.60)
		// 		]
		// 	}).addTo(map);
		// });
	// };
});
