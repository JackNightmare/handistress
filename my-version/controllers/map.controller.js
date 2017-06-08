app.controller('mapController', function($scope , Marker, filterFilter, leafletData, leafletMarkerEvents ){
	// Permet d'afficher ou pas le bouton d'inscription
  $scope.boutonInscription = true;

	/*****************************************************
	*** Variable globale pour fonctionnement de la map ***
	*****************************************************/
	var allMarkers = []; // Variable pour markers
	$scope.filter = 1; // Pour activer le type de filtre, all markers actuellement
	$scope.routing = ''; // Variable option pour tracer itinéraire

	$scope.openMenu = false; // Variable pour afficher contenu du menu ouvert
	$scope.closeMenu = true; // Variable pour afficher contenu du menu fermé

	$scope.activeTrace = true; // Formulaire de trace visible
	$scope.activeSearch = false; // Formulaire de recherche invisible



	/****************************************
	*** Mise en place de la carte leaflet ***
	****************************************/
	angular.extend($scope, {
		center : {
			lat: 48.853403, // a changer par la géolocalisation de la personne
			lng: 2.348784, // idem
			zoom: 16
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

	/**********************************************
	*** Mise en place des markers au chargement ***
	***********************************************/
	$scope.getMarkers = Marker.getMarkers()
		.then(function(markers){ // Ici tout ce que nous devons faire en cas de succès

			/** variable globale pour les markers **/
			$scope.markersList = markers;
			iconColor = 'white'; // couleur de l'icon par default

			for(key in markers){
				switch(markers[key].typePlaces) {
					case "Ecole":
						iconMarker = ' icon-school';
						colorMarker = 'lightgray';
						break;
					case "Metro":
						iconMarker = ' icon-subway';
						colorMarker = 'darkgreen';
						break;
					case "Gare":
						iconMarker = ' icon-subway';
						colorMarker = 'darkpurple';
						break;
					case "Aéroport":
						iconMarker = ' icon-airplane';
						colorMarker = 'lightblue';
						break;
					case "Restaurant":
						iconMarker = ' icon-restaurant';
						colorMarker = 'darkblue';
						break;
					case "Boutique":
						iconMarker = ' icon-cart';
						colorMarker = 'darkred';
						break;
					case "Loisir":
						iconMarker = ' icon-dice';
						colorMarker = 'orange';
						break;
					case "Parking":
						iconMarker = ' icon-local_parking';
						colorMarker = 'blue';
						break;
					case "Administration":
						iconMarker = ' icon-newspaper';
						colorMarker = 'gray';
						break;
					case "Hébergement":
						iconMarker = ' icon-bed';
						colorMarker = 'cadetblue';
						break;
					default :
						iconMarker = ' icon-access';
						colorMarker = ' white';
						iconColor = 'black';
						break;
				}

				value = {
					lat: parseFloat(markers[key].latitude),
					lng: parseFloat(markers[key].longitude) ,
					message: markers[key].typePlaces+" - "+markers[key].nameMarker,
					title: markers[key].typePlaces+" - "+markers[key].nameMarker,
					/*enable: ,*/
					icon: {
						type: 'awesomeMarker',
						icon : iconMarker,
						iconColor : iconColor,
						markerColor: colorMarker
					}
				}
				allMarkers.push(value);
			}
			$scope.markers = allMarkers;

		}, function(msg){ // Ici action en cas d'erreur
			console.log(msg);
		});

	/************************************
	*** Action directement sur la map ***
	************************************/
	/** Drag sur la map **/
	$scope.$on('leafletDirectiveMap.drag', function(){
		// console.log($scope.center.lat); // On get la latitude
		// console.log($scope.center.lng); // On get la longitude
	});

	/** Clique sur un marker **/
	$scope.$on('leafletDirectiveMarker.click', function(event, args){
		/*Ouvrir un petit menu avec tout les informations */
		console.log(args.model.message);

	});

	/**********************************
	*** Fonction filtre de la carte ***
	**********************************/
	/** Tracer des itinéraire  **/
	$scope.traceMap = function(){

		startPoint = filterFilter($scope.markersList, { 'nameMarker': $scope.traceMap.start}, true );
		endPoint = filterFilter($scope.markersList, { 'nameMarker': $scope.traceMap.end}, true );

		$scope.markers = {}; // On vide le markers sur la carte
		$scope.filter = 0;

		if(startPoint.length > 0 && endPoint.length > 0){

			/************************
			*** Version with OSRM ***
			************************/
			leafletData.getMap().then(function(map){
				/** Permet d'effacer l'ancien itinéraire et d'en tracer un nouveau **/
				if($scope.routing != ''){
					$scope.routing.setWaypoints([]);
					$scope.routing = '';
				}

				optionRouting = {
					profile: 'mapbox/walking',
					language : 'fr',
					// alternatives : false
				};

				mapboxRouter = L.Routing.mapbox('pk.eyJ1IjoiamFjazE5IiwiYSI6ImNqMms1MGpueTAwMDMyd2x1bHoyMWducXEifQ.2jAcRq_NIGBIaNM3oHNhWg', optionRouting);

				$scope.routing = L.Routing.control({
					waypoints: [
						L.latLng(parseFloat(startPoint[0]['latitude']), parseFloat(startPoint[0]['longitude'])),
						L.latLng(parseFloat(endPoint[0]['latitude']), parseFloat(endPoint[0]['longitude']))
					],
					router : mapboxRouter,
					show: false,
					language : 'fr',
				});

				$scope.routing.addTo(map);
			});
		}
	}

	/** Chercher marker(s) sur la map **/
	$scope.searchMap = function(){

		/** On supprime l'itinéraire si existe  **/
		if($scope.routing != ''){
			$scope.routing.setWaypoints([]);
			$scope.routing = '';
		}

		/* On vide tout sur la carte */
		$scope.markers = {};
		resultSearch = [];
		$scope.filter = 0;

		/* couleur de base des icones */
		iconColor = 'white';

		/* Tableau avec résultats des recherches effectuées */
		theSearch = filterFilter($scope.markersList, { 'infoSearch': $scope.searchMap.value});

		if(theSearch.length > 0){
			for (keySearch in theSearch){
				switch(theSearch[keySearch]["typePlaces"]) {
					case "Ecole":
						iconMarker = ' icon-school';
						colorMarker = 'lightgray';
						break;
					case "Metro":
						iconMarker = ' icon-subway';
						colorMarker = 'darkgreen';
						break;
					case "Gare":
						iconMarker = ' icon-subway';
						colorMarker = 'darkpurple';
						break;
					case "Aéroport":
						iconMarker = ' icon-airplane';
						colorMarker = 'lightblue';
						break;
					case "Restaurant":
						iconMarker = ' icon-restaurant';
						colorMarker = 'darkblue';
						break;
					case "Boutique":
						iconMarker = ' icon-cart';
						colorMarker = 'darkred';
						break;
					case "Loisir":
						iconMarker = ' icon-dice';
						colorMarker = 'orange';
						break;
					case "Parking":
						iconMarker = ' icon-local_parking';
						colorMarker = 'blue';
						break;
					case "Administration":
						iconMarker = ' icon-newspaper';
						colorMarker = 'gray';
						break;
					case "Hébergement":
						iconMarker = ' icon-bed';
						colorMarker = 'cadetblue';
						break;
					default :
						iconMarker = ' icon-access';
						colorMarker = ' white';
						iconColor = 'black';
						break;
				}

				infoResult = {
					lat : parseFloat(theSearch[keySearch]["latitude"]),
					lng : parseFloat(theSearch[keySearch]["longitude"]),
					message : theSearch[keySearch]["typePlaces"]+" - "+theSearch[keySearch]["nameMarker"],
					icon: {
						type: 'awesomeMarker',
						icon : iconMarker,
						iconColor : iconColor,
						markerColor: colorMarker
					}
				};

				searchLat = parseFloat(theSearch[keySearch]["latitude"]);
				searchLng =  parseFloat(theSearch[keySearch]["longitude"]);

				resultSearch.push(infoResult);
			}
		}
		/** on recentre la carte sur les dernieres coordonnées géographique trouvés  **/
		$scope.center.lat = searchLat;
		$scope.center.lng = searchLng;
		$scope.center.zoom = 14;

		/** Résultat de la recheche sur la carte **/
		$scope.markers = resultSearch;
	}

	/** Ouverture et fermeture du menu **/
	$scope.actionMenu = function(){
		if($scope.openMenu == true && $scope.closeMenu== false){
			$scope.openMenu = false;
			$scope.closeMenu = true;
		}
		else{
			$scope.openMenu = true;
			$scope.closeMenu = false;
		}
	}

	/** Ouverture du formulaire correspondant **/
	$scope.formTrace = function(){
		if($scope.activeTrace == false && $scope.activeSearch == true){
			$scope.activeTrace = true;
			$scope.activeSearch = false;
		}
	}

	$scope.formSearch = function(){
		if($scope.activeTrace == true && $scope.activeSearch == false){
			$scope.activeTrace = false;
			$scope.activeSearch = true;
		}
	}

	/** Permet de voir tout les markers disponibles  **/
	$scope.seeAll = function(){

		/** On supprime l'itinéraire si existe  **/
		if($scope.routing != ''){
			$scope.routing.setWaypoints([]);
			$scope.routing = '';
		}

		/* On le vide obligatoirement les markers */
		$scope.markers = {};
		allMarkers = [];

		/** on recntre le zoom **/
		$scope.center.zoom = 15;

		/** Si on clique alors que le filtre est actif, on le désactive et plus rien n'est sur la carte **/
		if($scope.filter == 1){
			$scope.filter = 0;
		}
		else{

			// Dans le cas contraire, on remets filter à 1 car le filtre est actic
			$scope.filter = 1;

			/** Ici on charge la fonction dans le models **/
			$scope.getMarkers = Marker.getMarkers()
			.then(function(markers){

				/* Ici on definit les variables pour les markers */
				iconColor = 'white';

				for(key in markers){
					switch(markers[key].typePlaces) {
						case "Ecole":
							iconMarker = ' icon-school';
							colorMarker = 'lightgray';
							break;
						case "Metro":
							iconMarker = ' icon-subway';
							colorMarker = 'darkgreen';
							break;
						case "Gare":
							iconMarker = ' icon-subway';
							colorMarker = 'darkpurple';
							break;
						case "Aéroport":
							iconMarker = ' icon-airplane';
							colorMarker = 'lightblue';
							break;
						case "Restaurant":
							iconMarker = ' icon-restaurant';
							colorMarker = 'darkblue';
							break;
						case "Boutique":
							iconMarker = ' icon-cart';
							colorMarker = 'darkred';
							break;
						case "Loisir":
							iconMarker = ' icon-dice';
							colorMarker = 'orange';
							break;
						case "Parking":
							iconMarker = ' icon-local_parking';
							colorMarker = 'blue';
							break;
						case "Administration":
							iconMarker = ' icon-newspaper';
							colorMarker = 'gray';
							break;
						case "Hébergement":
							iconMarker = ' icon-bed';
							colorMarker = 'cadetblue';
							break;
						default :
							iconMarker = ' icon-access';
							colorMarker = ' white';
							iconColor = 'black';
							break;
					}

					value = {
						lat: parseFloat(markers[key].latitude),
						lng: parseFloat(markers[key].longitude) ,
						message: markers[key].nameMarker,
						icon: {
							type: 'awesomeMarker',
							icon : iconMarker,
							iconColor : iconColor,
							markerColor: colorMarker
						}
					}
					/* On mets dans le tableau les informations du marker créé */
					allMarkers.push(value);
				}
				$scope.markers = allMarkers;
			}, function(msg){
				console.log(msg); // Ici action en cas d'erreur
			});
		}
	}

	/******************
	*** A améliorer ***
	******************/
	$scope.seePlace = function(){

		/** On supprime l'itinéraire si existe  **/
		if($scope.routing != ''){
			$scope.routing.setWaypoints([]);
			$scope.routing = '';
		}

		/* On le vide obligatoirement les markers */
		$scope.markers = {};
		allMarkers = [];

		/** Si on clique alors que le filtre est actif, on le désactive et plus rien n'est sur la carte **/
		if($scope.filter == 2){
			$scope.filter = 0;
		}
		else{
			$scope.filter = 2;
		}
	}

	$scope.seeAccess = function(){
		/** On supprime l'itinéraire si existe  **/
		if($scope.routing != ''){
			$scope.routing.setWaypoints([]);
			$scope.routing = '';
		}

		if($scope.filter == 3){
			$scope.filter = 0;
		}
		else{
			$scope.filter = 3;
		}
	}

	/** Suprresion des markers **/
	// $scope.removeMarkers = function(){
	// 	$scope.markers = {};
	// }

});
