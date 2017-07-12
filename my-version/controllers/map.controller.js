app.controller('mapController', function($scope, $rootScope, $sce, $http, Marker, filterFilter, leafletData, leafletMarkerEvents ){
	// Permet d'afficher ou pas le bouton d'inscription
	$scope.boutonInscription = true;

	// Permet d'afficher le menu responsive
	$scope.menuResponsive = true;
	$scope.mapPage = true;
	
	/*****************************************************
	*** Variable globale pour fonctionnement de la map ***
	*****************************************************/
	allMarkers = []; // Variable pour markers
	$scope.markersList = ''; // Variable contenant la liste des markers existant, permettant la mise place de la recherche ou tracer l'itinéraire

	$scope.openFilter = false; // Permet de savoir si le filtre est ouvert ou pas
	$scope.filter = 1; // Pour activer le type de filtre, all markers actuellement

	$scope.openMenu = false; // Variable pour afficher contenu du menu ouvert
	$scope.closeMenu = true; // Variable pour afficher contenu du menu fermé
	$scope.activeTrace = true; // Formulaire de trace visible
	$scope.activeSearch = false; // Formulaire de recherche invisible
	
	$scope.routing = ''; // Variable contenant l'itinéraire
	$scope.currentTrace = false; // Permet de dire si l'itinéraire est tracé ou pas 
	$scope.optimizationRoute = []; // Tableau pour optimiser les routes si besoin

	$scope.openPopin = false // Permet de définir si on ouvre ou pas la popin d'information
	$scope.countExit = 0; // Permet de définir une valeur de base pour le nombre sortie des metro, qu'on affichera ensuite sur la carte

	$scope.searchMapSelect = "allTypePlace"; // Definis la valeur de base du select de recherche
	$scope.selectTypePlace = "2,3,4,5,6,7,8,9,10,11"; // Definis la valeur de base pour le select type categorie lieu
	$scope.selectTypeAccess = "allTypeAccess"; // Definis la valeur de base pour le select type categorie accès

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
				enable: ['click', 'dragend'], // Les evenements que nous souhaitons ecouté
				logic: 'emit'
			}
		}
	});

	/**********************************************
	*** Mise en place des markers au chargement ***
	***********************************************/
	/** Creation de la liste pour recherche **/
	$scope.searchByName = function (search) {
		var data = {
			search: search
		};
		
		return $http({
				method: 'POST',
				url: 'https://www.api.benpedia.com/handistress/markers/searchByName.php',
				headers: {
					'Content-Type': undefined
				},
				data: data
			}).then(function successCallback(response) {
				var markers = [];
				angular.forEach(response.data, function(item) {
					markers.push(item);
				});
				return markers;
			}, function errorCallback(response) {
				console.log(response);
			});
	};
	
	$http.get('json/listMarkers.json')
		.success(function(data){
			/** Définition de la liste de markers **/
			$scope.markersList = data;
		})
		.error(function(msg){
			console.log('erreur chargement des markers ' + msg);
		});

	/** Creation des markers au chargement de la page **/
	$scope.getAllMarkers = Marker.getAllMarkers($scope.center.lat, $scope.center.lng, 0.01)
		.then(function(markers){ // Ici tout ce que nous devons faire en cas de succès
			
			/** variables pour définitions des couleurs et icones des markers **/
			iconColor = 'white'; // couleur de l'icon par default

			/** Parcours des retours **/
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
						colorMarker = 'black';
						iconColor = 'lightgray';
						break;
				}

				/** Ternaire pour definir messsage de la popin **/
				markerMessage = markers[key].typePlaces == "NULL" ? "Accès - "+markers[key].nameMarker : markers[key].typePlaces+" - "+markers[key].nameMarker ;

				/** Information générale du markers pour afficher dans la popin **/
				markerEnable = markers[key].typePlaces+"/"+markers[key].nameMarker+"/"+markers[key].descriptionMarker+"/"+markers[key].accessEnterExit+"/"+markers[key].toiletAdapt+"/"+markers[key].equipmentAdapt+"/"+ markers[key].handicapGantry+"/"+ markers[key].exitNumber+"/"+ markers[key].informationOffice+"/"+ markers[key].subwayLine;
				
				/** Mise en place du markers courant **/
				value = {
					lat: parseFloat(markers[key].latitude),
					lng: parseFloat(markers[key].longitude) ,
					message: markerMessage,
					enable : markerEnable,
					icon: {
						type: 'awesomeMarker',
						icon : iconMarker,
						iconColor : iconColor,
						markerColor: colorMarker
					}
				}
				/** On insert dans le tableau **/
				allMarkers.push(value);
			}

			/** On definit les markers sur la carte **/
			$scope.markers = allMarkers;

		}, function(msg){ 
			console.log('erreur get all markers '+msg);
		});

	/************************************
	*** Action directement sur la map ***
	************************************/
	/** Drag sur la map **/
	$scope.$on('leafletDirectiveMap.dragend', function(){

		/** On verifie que si l'itinéraire est tracè pour l'afficher **/
		if( $scope.currentTrace == false){
			/** On vide les valeurs des markers **/
			$scope.markers = {};
			delete $scope.markers.value;
			$scope.filter = 0;
			allMarkers = [];

			$scope.getAllMarkers = Marker.getAllMarkers($scope.center.lat, $scope.center.lng, 0.01)
				.then(function(markers){ // Ici tout ce que nous devons faire en cas de succès

					/** variables pour définitions des couleurs et icones des markers **/
					iconColor = 'white'; // couleur de l'icon par default

					/** Parcours des retours **/
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
								colorMarker = 'black';
								iconColor = 'lightgray';
								break;
						}

						/** Ternaire pour definir messsage de la popin **/
						markerMessage = markers[key].typePlaces == "NULL" ? "Accès - "+markers[key].nameMarker : markers[key].typePlaces+" - "+markers[key].nameMarker ;

						/** Information générale du markers pour afficher dans la popin **/
						markerEnable = markers[key].typePlaces+"/"+markers[key].nameMarker+"/"+markers[key].descriptionMarker+"/"+markers[key].accessEnterExit+"/"+markers[key].toiletAdapt+"/"+markers[key].equipmentAdapt+"/"+ markers[key].handicapGantry+"/"+ markers[key].exitNumber+"/"+ markers[key].informationOffice+"/"+ markers[key].subwayLine;

						/** Mise en place du markers courant **/
						value = {
							lat: parseFloat(markers[key].latitude),
							lng: parseFloat(markers[key].longitude) ,
							message: markerMessage,
							enable : markerEnable,
							icon: {
								type: 'awesomeMarker',
								icon : iconMarker,
								iconColor : iconColor,
								markerColor: colorMarker
							}
						}
						/** On insert dans le tableau **/
						allMarkers.push(value);
					}

					/** On definit les markers sur la carte **/
					$scope.markers = allMarkers;
				}, function(msg){ 
					console.log('erreur get all markers '+msg);
				});
		}
	});

	/** Clique sur un marker pour ouvrir un popin à gauche **/
	$scope.$on('leafletDirectiveMarker.click', function(event, args){

		if($scope.currentTrace == false && args.model.enable != undefined){

			/** On ouvre la popin **/
			$scope.openPopin = true;

			/** On recupere les informations contenu dans le markers **/ 
			informations = args.model.enable.split('/');

			/** titre pour la popin **/
			markerType = informations[0];
			markerTitle = informations[1];

			/** Mise en place des informations pour la popin **/
			$scope.titlePopin = markerType != "NULL" ? markerType+" - "+markerTitle : "Accès - "+markerTitle;
			markerDescription = informations[2] != "" ? informations[2] : "Pas de description générale";
			

			if(informations[3]){
				markerDescriptionExit = informations[3] == "null" ? "Absence de description des sorties et entrées" : informations[3];
			}
			else{
				markerDescriptionExit = "Absence Description des sorties et entrées" ;
			}	

			markerToilet = informations[4];
			markerEquipment = informations[5];
			markerGantry = informations[6];
			
			/** Information si metro **/
			markerSortie = informations[7];
			markerOffice = informations[8];
			markerSubway = informations[9];

			/** Variable de retour pour la Popin  **/
			$scope.descriptionPopin = $sce.trustAsHtml(markerDescription);
			// $scope.descriptionExit = $sce.trustAsHtml(markerDescriptionExit);
			$scope.descriptionExit = markerType != "NULL" ? $sce.trustAsHtml(markerDescriptionExit) : "" ;


			/** Controle des toilets **/
			if(markerType != "Metro" && markerType != "Parking" && markerType != "NULL" ){
				$scope.markerSeeToilet = true;
				$scope.toilet = markerToilet == 'null' || markerToilet == "0" ? false : true ; 
			}

			/** Controle des equipements**/
			if(markerType != "NULL" ){
				$scope.markerSeeEquipment = true;
				$scope.equipment = markerEquipment== 'null' || markerEquipment == "0" ? false : true ;
			}

			/** Controle sur portique handicape **/
			if(markerType != "NULL" ){
				$scope.markerSeeGantry = true;
				$scope.gantry = markerGantry== 'null' || markerGantry == "0" ? false : true ;
			}

			/** Si markerType est null, alors accès, tout à false **/
			if(markerType == "NULL"){
				$scope.markerSeeToilet = false;
				$scope.markerSeeEquipment = false;
				$scope.markerSeeGantry = false;
			}

			/** Permet de supprimer les markers de sorties si metro **/
			if($scope.markerSeeMetro){
				for(var clean = 1; clean <= $scope.countExit; clean++){
					allMarkers.splice(-1,1);
				}
				$scope.countExit = 0;
			}
			
			/** Controle pour le metro **/
			$scope.markerSeeMetro = informations[0] == "Metro" ? true : false;

			if($scope.markerSeeMetro){
				/** Permet de fermer la popup sur la carte **/
				leafletData.getMap().then(function(map){ map.closePopup(); });

				/** Variable pour savoir si on est rentré dans une variable de type metro **/
				/**Mise en place des sorties **/
				allSortie = markerSortie.split(';');
				$scope.allExitPopin = '';



				allSortie.forEach(function(element) {
					if(element != "" ){
						infoSortie = element.split('**');

						if(element.search('unique') != '-1'){
							$scope.allExitPopin += "Ne dispose que d'une sortie";
						}
						else{
							$scope.countExit ++;
							$scope.allExitPopin += "Sortie n° "+infoSortie[0].trim()+" - "+ infoSortie[1].trim()+"<br>";

							console.log(infoSortie[4]);

							/** On verifie si la sortie est accessible pour attribuer la bonne couleur **/
							colorAccessExit = infoSortie[4].search('true') != '-1' ? 'lightgreen' : 'lightred' ;

							value = {
								lat: parseFloat(infoSortie[2]),
								lng: parseFloat(infoSortie[3]) ,
								message: "Sortie n° "+infoSortie[0]+" - "+ infoSortie[1],
								icon: {
									type: 'awesomeMarker',
									icon : 'glyphicon-log-out',
									iconColor : '',
									markerColor: colorAccessExit
								}
							}
							allMarkers.push(value);
						}
					}
				});
				$scope.allExitPopin = $sce.trustAsHtml($scope.allExitPopin);

				/** Permet de savoir si le metro est accessible aux handicapés **/
				$scope.subwayHandicap = markerSortie.search('true') != '-1' ? true : false ;

				/** Definis les lignes de metros present à cet endroit **/
				allSubway = markerSubway.split(' ** ');
				$scope.linesMetros = '';

				for(key in allSubway){
					if(allSubway[key] !=""){
						$scope.linesMetros += "<span class='subway-popin line"+allSubway[key]+"'>"+allSubway[key]+"</span>";
					}
				}
				$scope.linesMetros = $sce.trustAsHtml($scope.linesMetros);

				/** On regarde si il y a un bureau d'information **/
				$scope.office = markerOffice == "1" ? true : false ;
				$scope.markerSeeToilet = false;
			}
		}
	});

	/** Fermeture de la popin d'information **/
	$scope.closePopin = function(){ $scope.openPopin = false; }

	/*************************************
	*** Action se situant dans le menu ***
	*************************************/
	/** Tracer des itinéraire  **/
	$scope.traceMap = function(){

		/** On definis le niveau de l'accès, soit par ses informations de compte, soit par le formulaire si pas de compte **/
		if($rootScope.userData){
			$scope.traceMap.stairs = $rootScope.userData.accessStairs;
			$scope.traceMap.escalators = $rootScope.userData.accessEscalator;
			$scope.traceMap.flatEscalators = $rootScope.userData.accessFlatEscalator;
			$scope.traceMap.elevator = $rootScope.userData.accessElevator;
			$scope.traceMap.ramp = $rootScope.userData.accessRamp;
			$scope.traceMap.flatPavement = $rootScope.userData.accessPavement;
			$scope.traceMap.hightPavement = $rootScope.userData.accessHightPavement;
		}
		else{
			$scope.traceMap.stairs = $scope.traceMap.stairs == undefined ? false : $scope.traceMap.stairs ;
			$scope.traceMap.escalators = $scope.traceMap.escalators == undefined ? false : $scope.traceMap.escalators ;
			$scope.traceMap.flatEscalators = $scope.traceMap.flatEscalators == undefined ? false : $scope.traceMap.flatEscalators ;
			$scope.traceMap.elevator = $scope.traceMap.elevator == undefined ? false : $scope.traceMap.elevator ;
			$scope.traceMap.ramp = $scope.traceMap.ramp == undefined ? false : $scope.traceMap.ramp ;
			$scope.traceMap.flatPavement = $scope.traceMap.flatPavement == undefined ? false : $scope.traceMap.flatPavement ;
			$scope.traceMap.hightPavement = $scope.traceMap.hightPavement == undefined ? false : $scope.traceMap.hightPavement ;
		}

		/** On recupere les valeurs du formulaires **/
		startPoint = filterFilter($scope.markersList, { 'nameMarker': $scope.traceMap.start.nameMarker}, true );
		endPoint = filterFilter($scope.markersList, { 'nameMarker': $scope.traceMap.end.nameMarker}, true );		

		/** On cache la popin si ouverte **/
		$scope.openPopin = false;

		/** On vide les valeurs des markers **/
		$scope.markers = {};
		delete $scope.markers.value;
		$scope.filter = 0;
		allMarkers = [];

		/** On verifie qu'on a bien trouvé des informations pour les deux **/
		if(startPoint.length > 0 && endPoint.length > 0){
			/** On dit que l'itinéraire est tracé **/
			$scope.currentTrace = true;
			
			/** Mise en place des markers de départ et d'arrivé **/
			valueStart = {
				lat: parseFloat(startPoint[0]['latitude']),
				lng: parseFloat(startPoint[0]['longitude']),
				message: "Depart",
				title : startPoint[0]['nameMarker'],
				icon: {
					type : 'awesomeMarker',
					icon : ' icon-location',
					iconColor : 'white',
					markerColor: 'darkblue'
				}
			};

			allMarkers.push(valueStart);

			valueEnd = {
				lat: parseFloat(endPoint[0]['latitude']),
				lng: parseFloat(endPoint[0]['longitude']),
				message: 'Arrivé',
				title: endPoint[0]['nameMarker'],
				icon: {
					type: 'awesomeMarker',
					icon : ' icon-racing-flags',
					iconColor : 'white',
					markerColor: 'darkred'
				}
			};

			/** Insertion dans la carte des markers **/
			allMarkers.push(valueEnd);
			$scope.markers = allMarkers;

			/************************
			*** Version with OSRM ***
			************************/
			leafletData.getMap().then(function(map){
				/** Permet d'effacer l'ancien itinéraire et d'en tracer un nouveau **/
				if($scope.routing != ''){
					$scope.routing.setWaypoints([]);
					$scope.optimizationRoute = [];
					$scope.routing.hide();
					$scope.routing = '';
				}

				/** Option de routing pour mapbox **/
				optionRouting = {
					profile: 'mapbox/walking',
					language : 'fr',
				};

				/** Appel à l'api MAP box pour le routing leaflet **/
				mapboxRouter = L.Routing.mapbox('pk.eyJ1IjoiamFjazE5IiwiYSI6ImNqMms1MGpueTAwMDMyd2x1bHoyMWducXEifQ.2jAcRq_NIGBIaNM3oHNhWg', optionRouting);

				/** Définition des valeurs pour le routing de base **/
				$scope.routing = L.Routing.control({
					waypoints: [
						L.latLng(parseFloat(startPoint[0]['latitude']), parseFloat(startPoint[0]['longitude'])),
						L.latLng(parseFloat(endPoint[0]['latitude']), parseFloat(endPoint[0]['longitude']))
					],
					createMarker: function(){ return null; },
					router : mapboxRouter,
					show: true,
					language : 'fr',
				});

				// forbiddenAccess = [ {"lat":48.86635, "lng": 2.33753} ]; // test
				/** Tableau de base des accès interdis **/
				forbiddenAccess = [];
				typeToSearch = '';

				/** Variable pour définir si un accès interdit à été trouvé ou pas **/
				$scope.findForbidenAcces = false;

				/** On regarde les type d'accès à chercher **/
				if($scope.traceMap.stairs == false)
					typeToSearch+="1,";

				if($scope.traceMap.escalators == false)
					typeToSearch+="2,";

				if($scope.traceMap.flatEscalators == false)
					typeToSearch+="3,";

				if($scope.traceMap.elevator == false)
					typeToSearch+="4,";

				if($scope.traceMap.ramp == false)
					typeToSearch+="5,";

				if($scope.traceMap.flatPavement == false)
					typeToSearch+="6,";

				if($scope.traceMap.hightPavement == false)
					typeToSearch+="7,";
				

				/** On enleve la dernière virgule pour split plus efficament **/
				typeToSearch = typeToSearch.slice(0, -1);
		

				searchForbidAccess = Marker.searchForbiddenAccess(typeToSearch)
						.then(function(findForbiddenAccess){
							for(key in findForbiddenAccess){
								coordinateAccess = {
									"lat" : parseFloat(findForbiddenAccess[key].latitude), 
									"lng" : parseFloat(findForbiddenAccess[key].longitude),
									"newlat" : parseFloat(findForbiddenAccess[key].newLat),
									"newlng" : parseFloat(findForbiddenAccess[key].newLong),
								}
								forbiddenAccess.push(coordinateAccess);
							}

							/** On recupere ici les informations de la route pour voir les coordonnées gps et vérifier si un de nos accès y est **/
							$scope.routing.on('routeselected', function(element) {
								/** Objet route **/
								var route = element.route;
								coordinatesTrace = route.coordinates;

								for(keyCoordinate in coordinatesTrace ){
									for(keyAccess in forbiddenAccess){
										/** On parse en string pour faciliter la recherche **/
										latCoordinate = String(coordinatesTrace[keyCoordinate].lat);
										latAccess = String(forbiddenAccess[keyAccess].lat).substring(0,6);

										lngCoordinate = String(coordinatesTrace[keyCoordinate].lng);
										lngAccess = String(forbiddenAccess[keyAccess].lng).substring(0,5);

										console.log(latCoordinate+' - '+latAccess);
										console.log(lngCoordinate+' - '+lngAccess);

										/** On regarde si on a un accès interdit dans la route basique **/
										if(latCoordinate.search(latAccess) != "-1" && lngCoordinate.search(lngAccess) != "-1" ){
											$scope.findForbidenAcces = true;
											$scope.optimizationRoute.push(L.latLng(forbiddenAccess[keyAccess].newlat, forbiddenAccess[keyAccess].newlng));
										}
									}
								}

								/** suppression des doublons **/
								saveLastInfoCoord = {"lat": "", "lng":""};
								$scope.optimizationRoute = $scope.optimizationRoute.filter(function(currentCoord){
									if(saveLastInfoCoord.lat == currentCoord.lat && saveLastInfoCoord.lng == currentCoord.lng){ deleteCoord = false; }
									else{ deleteCoord = true; }

									/** on attrribue le dernier element à la variable de sauvegarde **/
									saveLastInfoCoord = currentCoord;

									/** on retourne la valeur pour nettoyer le code **/
									return deleteCoord;
								});

								$scope.optimizationRoute.unshift(L.latLng(parseFloat(startPoint[0]['latitude']), parseFloat(startPoint[0]['longitude'])));
								$scope.optimizationRoute.push(L.latLng(parseFloat(endPoint[0]['latitude']), parseFloat(endPoint[0]['longitude'])));
							});
						});				

				/** Petit temps de latence afin que les variables soit bien mise a jour **/
				setTimeout(function(){
					console.log($scope.findForbidenAcces);
					console.log($scope.optimizationRoute);
					if($scope.findForbidenAcces)
						$scope.routing.setWaypoints($scope.optimizationRoute);
				}, 500);


				/** On ajoute le routing à la carte **/
				$scope.routing.addTo(map);				
			});
		}
	}

	/** Chercher marker(s) sur la map **/	
	$scope.searchMap = function(){

		/** On supprime tous ce qui ne devrait pas apparaitre lors d'une recherche **/
		$scope.openPopin = false; // On cache la popin si ouverte
		$scope.currentTrace = false; // L'itinéraire tracé est faux

		/** On supprime l'itinéraire si existe  **/
		if($scope.routing != ''){
			$scope.routing.setWaypoints([]);
			$scope.optimizationRoute = [];
			$scope.routing.hide();
			$scope.routing = '';
		}

		/* On vide tout sur la carte */
		delete $scope.markers.value;
		$scope.markers = {};
		allMarkers = [];
		$scope.filter = 0;

		/** couleur de base des icones **/
		iconColor = 'white';

		/** 
		A checker mais si le select == allTypePlace et les input checkbox == undefined, 
		la recherche ne se fait que sur la barre de recherche 
		**/
		console.log("value du select -> "+$scope.searchMapSelect);
		console.log("value du escaliers -> "+$scope.searchMap.stairs);
		console.log("value du escalators -> "+$scope.searchMap.escalators);
		/** Api de recherche  **/
		$scope.getAllMarkers = Marker.searchMarkers( $scope.searchMap.value)
			.then(function(markers){
				/* Ici on definit les variables pour les markers */
				iconColor = 'white';

				/** Parcours de la réponse **/
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
							colorMarker = 'black';
							iconColor = 'lightgray';
							break;
					}

					/** Ternaire pour definir messsage de la popin **/
					markerMessage = markers[key].typePlaces == "NULL" ? "Accès - "+markers[key].nameMarker : markers[key].typePlaces+" - "+markers[key].nameMarker ;
					
					/** Information générale du markers pour afficher dans la popin **/
					markerEnable = markers[key].typePlaces+"/"+markers[key].nameMarker+"/"+markers[key].descriptionMarker+"/"+markers[key].accessEnterExit+"/"+markers[key].toiletAdapt+"/"+markers[key].equipmentAdapt+"/"+ markers[key].handicapGantry+"/"+ markers[key].exitNumber+"/"+ markers[key].informationOffice+"/"+ markers[key].subwayLine;
					
					/** Mise en place du marker avec toute les informations **/
					value = {
						lat: parseFloat(markers[key].latitude),
						lng: parseFloat(markers[key].longitude),
						message: markers[key].typePlaces+" - "+markers[key].nameMarker,
						enable : markerEnable,
						icon: {
							type: 'awesomeMarker',
							icon : iconMarker,
							iconColor : iconColor,
							markerColor: colorMarker
						}
					}

					/** On definit la latitude et longitude pour recentrer la carte **/
					searchLat= parseFloat(markers[key].latitude);
					searchLng= parseFloat(markers[key].longitude);

					/** On mets dans le tableau les informations du marker créé **/
					allMarkers.push(value);
				}
				
				/** on recentre la carte sur les dernieres coordonnées géographique trouvés  **/
				$scope.center.lat = searchLat;
				$scope.center.lng = searchLng;
				$scope.center.zoom = 14;

				/** Résultat de la recheche sur la carte **/
				$scope.markers = allMarkers;
			},
			function(msg){
				console.log('erreur : '+msg);
			});
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

	/**********************************
	*** Fonction filtre de la carte ***
	**********************************/
	/** Ouverture du filtre **/
	$scope.actionFilter = function(){
		$scope.openFilter = $scope.openFilter == true ? false : true ;
	}

	/** Permet de voir tout les markers disponibles  **/
	$scope.seeAll = function(){

		/** On supprime tous ce qui ne devrait pas apparaitre lors d'une recherche **/
		$scope.openPopin = false; // On cache la popin si ouverte
		$scope.currentTrace = false; // L'itinéraire tracé est faux

		/** On supprime l'itinéraire si existe  **/
		if($scope.routing != ''){
			$scope.routing.setWaypoints([]);
			$scope.optimizationRoute = [];
			$scope.routing.hide();
			$scope.routing = '';
		}

		/* On vide tout sur la carte */
		delete $scope.markers.value;
		$scope.markers = {};
		allMarkers = [];

		/** On attribue la valeur tout les lieux et tout les accès **/
		$scope.selectTypePlace = "2,3,4,5,6,7,8,9,10,11";
		$scope.selectTypeAccess = "allTypeAccess";

		/** Si on clique alors que le filtre est actif, on le désactive et plus rien n'est sur la carte **/
		if($scope.filter == 1){
			$scope.filter = 0;
		}
		else{

			// Dans le cas contraire, on remets filter à 1 car le filtre est actic
			$scope.filter = 1;

			/** Ici on charge la fonction dans le models **/
			$scope.getAllMarkers = Marker.getAllMarkers($scope.center.lat, $scope.center.lng, 0.01)
				.then(function(markers){
					/* Ici on definit les variables pour les markers */
					iconColor = 'white';

					/** Parcours de la réponse **/
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
								colorMarker = 'black';
								iconColor = 'lightgray';
								break;
						}

						/** Ternaire pour definir messsage de la popin **/
						markerMessage = markers[key].typePlaces == "NULL" ? "Accès - "+markers[key].nameMarker : markers[key].typePlaces+" - "+markers[key].nameMarker ;
					
						/** Information générale du markers pour afficher dans la popin **/
						markerEnable = markers[key].typePlaces+"/"+markers[key].nameMarker+"/"+markers[key].descriptionMarker+"/"+markers[key].accessEnterExit+"/"+markers[key].toiletAdapt+"/"+markers[key].equipmentAdapt+"/"+ markers[key].handicapGantry+"/"+ markers[key].exitNumber+"/"+ markers[key].informationOffice+"/"+ markers[key].subwayLine;
					
						/** Mise en place du marker avec toute les informations **/
						value = {
							lat: parseFloat(markers[key].latitude),
							lng: parseFloat(markers[key].longitude) ,
							message: markers[key].typePlaces+" - "+markers[key].nameMarker,
							enable : markerEnable,
							icon: {
								type: 'awesomeMarker',
								icon : iconMarker,
								iconColor : iconColor,
								markerColor: colorMarker
							}
						}

						/** On mets dans le tableau les informations du marker créé **/
						allMarkers.push(value);
					}
					$scope.markers = allMarkers;
				}, function(msg){
					console.log(msg); // Ici action en cas d'erreur
				});
		}
	}

	/** Permet de voir que les markers de type Lieu **/
	$scope.seePlace = function(){
		/** On supprime tous ce qui ne devrait pas apparaitre lors d'une recherche **/
		$scope.openPopin = false; // On cache la popin si ouverte
		$scope.currentTrace = false; // L'itinéraire tracé est faux

		/** On supprime l'itinéraire si existe  **/
		if($scope.routing != ''){
			$scope.routing.setWaypoints([]);
			$scope.optimizationRoute = [];
			$scope.routing.hide();
			$scope.routing = '';
		}

		/** On attribue la valeur tout les lieux pour etre sur et supprime la valeur d'accès **/
		$scope.selectTypePlace = "2,3,4,5,6,7,8,9,10,11";
		$scope.selectTypeAccess = "";

		/* On vide tout sur la carte */
		delete $scope.markers.value;
		$scope.markers = {};
		allMarkers = [];

		/** Si on clique alors que le filtre est actif, on le désactive et plus rien n'est sur la carte **/
		if($scope.filter == 2){
			$scope.filter = 0;
		}
		else{
			$scope.filter = 2;

			$scope.getAllMarkers = Marker.getPlacesMarkers($scope.center.lat, $scope.center.lng, 0.01)
				.then(function(markers){					
					/** Parcours de la réponse **/
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
							default :
								iconMarker = ' icon-bed';
								colorMarker = 'cadetblue';
								break;
						}

						/** Ternaire pour definir messsage de la popin **/
						markerMessage = markers[key].typePlaces == "NULL" ? "Accès - "+markers[key].nameMarker : markers[key].typePlaces+" - "+markers[key].nameMarker ;

						/** Information générale du markers pour afficher dans la popin **/
						markerEnable = markers[key].typePlaces+"/"+markers[key].nameMarker+"/"+markers[key].descriptionMarker+"/"+markers[key].accessEnterExit+"/"+markers[key].toiletAdapt+"/"+markers[key].equipmentAdapt+"/"+ markers[key].handicapGantry+"/"+ markers[key].exitNumber+"/"+ markers[key].informationOffice+"/"+ markers[key].subwayLine;
						
						/** Mise en place du marker avec toute les informations **/
						value = {
							lat: parseFloat(markers[key].latitude),
							lng: parseFloat(markers[key].longitude) ,
							message: markerMessage,
							enable : markerEnable,
							icon: {
								type: 'awesomeMarker',
								icon : iconMarker,
								iconColor : 'white',
								markerColor: colorMarker
							}
						}	
						/** On mets dans le tableau les informations du marker créé **/
						allMarkers.push(value);
					}
					$scope.markers = allMarkers;
				}, function(msg){ // Ici action en cas d'erreur
					console.log(msg);
				});
		}
	}

	/** Permet de voir les markers de type accès **/
	$scope.seeAccess = function(){
		/** On supprime tous ce qui ne devrait pas apparaitre lors d'une recherche **/
		$scope.openPopin = false; // On cache la popin si ouverte
		$scope.currentTrace = false; // L'itinéraire tracé est faux

		/** On supprime l'itinéraire si existe  **/
		if($scope.routing != ''){
			$scope.routing.setWaypoints([]);
			$scope.optimizationRoute = [];
			$scope.routing.hide();
			$scope.routing = '';
		}

		/* On vide tout sur la carte */
		delete $scope.markers.value;
		$scope.markers = {};
		allMarkers = [];

		/** On attribue la valeur tous les accès pour etre sur et supprime la valeur de lieu **/
		$scope.selectTypePlace = "";
		$scope.selectTypeAccess = "allTypeAccess";

		if($scope.filter == 3){
			$scope.filter = 0;
		}
		else{
			$scope.filter = 3;

			$scope.getAllMarkers = Marker.getAccessMarkers($scope.center.lat, $scope.center.lng, 0.01)
				.then(function(markers){

					/** Parcours de la réponse **/
					for(key in markers){
						
						/** Ternaire pour definir messsage de la popin **/
						markerMessage = "Accès - "+markers[key].nameMarker;

						/** Information générale du markers pour afficher dans la popin **/
						markerEnable = markers[key].typePlaces+"/"+markers[key].nameMarker+"/"+markers[key].descriptionMarker+"/"+markers[key].accessEnterExit+"/"+markers[key].toiletAdapt+"/"+markers[key].equipmentAdapt+"/"+ markers[key].handicapGantry+"/"+ markers[key].exitNumber+"/"+ markers[key].informationOffice+"/"+ markers[key].subwayLine;
						
						/** Mise en place du marker avec toute les informations **/
						value = {
							lat: parseFloat(markers[key].latitude),
							lng: parseFloat(markers[key].longitude) ,
							message: markerMessage,
							enable : markerEnable,
							icon: {
								type: 'awesomeMarker',
								icon : ' icon-access',
								iconColor : 'lightgray',
								markerColor: 'black'
							}
						}	
						/** On mets dans le tableau les informations du marker créé **/
						allMarkers.push(value);
					}
					$scope.markers = allMarkers;
				}, function(msg){
					console.log(msg);
				});
		}
	}

	/** Permet de voir un type de markers de type lieu **/
	$scope.typePlace = function(){
		$scope.filter = 0;

		/** On supprime tous ce qui ne devrait pas apparaitre lors d'une recherche **/
		$scope.openPopin = false; // On cache la popin si ouverte
		$scope.currentTrace = false; // L'itinéraire tracé est faux

		/** On supprime l'itinéraire si existe  **/
		if($scope.routing != ''){
			$scope.routing.setWaypoints([]);
			$scope.optimizationRoute = [];
			$scope.routing.hide();
			$scope.routing = '';
		}

		/* On vide tout sur la carte */
		delete $scope.markers.value;
		$scope.markers = {};
		allMarkers = [];


		/** Petit controle pour affecter le type de filtre**/
		$scope.filter = $scope.selectTypePlace== "2,3,4,5,6,7,8,9,10,11" ? 2 : 0 ;
		$scope.selectTypeAccess = "";


		$scope.getAllMarkers = Marker.getTypePlace($scope.center.lat, $scope.center.lng, 0.01, $scope.selectTypePlace)
			.then(function(markers){
				/** Parcours de la réponse **/
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
						default :
							iconMarker = ' icon-bed';
							colorMarker = 'cadetblue';
							break;
					}

					/** Ternaire pour definir messsage de la popin **/
					markerMessage = markers[key].typePlaces == "NULL" ? "Accès - "+markers[key].nameMarker : markers[key].typePlaces+" - "+markers[key].nameMarker ;

					/** Information générale du markers pour afficher dans la popin **/
					markerEnable = markers[key].typePlaces+"/"+markers[key].nameMarker+"/"+markers[key].descriptionMarker+"/"+markers[key].accessEnterExit+"/"+markers[key].toiletAdapt+"/"+markers[key].equipmentAdapt+"/"+ markers[key].handicapGantry+"/"+ markers[key].exitNumber+"/"+ markers[key].informationOffice+"/"+ markers[key].subwayLine;

					/** Mise en place du marker avec toute les informations **/
					value = {
						lat: parseFloat(markers[key].latitude),
						lng: parseFloat(markers[key].longitude),
						message: markerMessage,
						enable : markerEnable,
						icon: {
							type: 'awesomeMarker',
							icon : iconMarker,
							iconColor : 'white',
							markerColor: colorMarker
						}
					}

					/** On mets dans le tableau les informations du marker créé **/
					allMarkers.push(value);
				}
				$scope.markers = allMarkers;
			}, function(msg){
				console.log(msg);
		});
	}

	/** Permet de voir un type de markers de type accès **/
	$scope.typeAccess = function(){
		$scope.filter = 0;

		/** On supprime tous ce qui ne devrait pas apparaitre lors d'une recherche **/
		$scope.openPopin = false; // On cache la popin si ouverte
		$scope.currentTrace = false; // L'itinéraire tracé est faux

		/** On supprime l'itinéraire si existe  **/
		if($scope.routing != ''){
			$scope.routing.setWaypoints([]);
			$scope.optimizationRoute = [];
			$scope.routing.hide();
			$scope.routing = '';
		}

		/* On vide tout sur la carte */
		delete $scope.markers.value;
		$scope.markers = {};
		allMarkers = [];

		/** Petit controle de la valeur pour appliquer le filtre **/
		$scope.filter = $scope.selectTypeAccess == "allTypeAccess" ? 3 : 0 ;
		$scope.selectTypePlace = "";
		
		$scope.getAllMarkers = Marker.getTypeAccess($scope.center.lat, $scope.center.lng, 0.01, $scope.selectTypeAccess)
			.then(function(markers){

				/** Parcours de la réponse **/
				for(key in markers){
					/** Ternaire pour definir messsage de la popin **/
					markerMessage = "Accès - "+markers[key].nameMarker;

					/** Information générale du markers pour afficher dans la popin **/
					markerEnable = markers[key].typePlaces+"/"+markers[key].nameMarker+"/"+markers[key].descriptionMarker+"/"+markers[key].accessEnterExit+"/"+markers[key].toiletAdapt+"/"+markers[key].equipmentAdapt+"/"+ markers[key].handicapGantry+"/"+ markers[key].exitNumber+"/"+ markers[key].informationOffice+"/"+ markers[key].subwayLine;

					/** Mise en place du marker avec toute les informations **/
					value = {
						lat: parseFloat(markers[key].latitude),
						lng: parseFloat(markers[key].longitude),
						message: markerMessage,
						enable : markerEnable,
						icon: {
							type: 'awesomeMarker',
							icon : ' icon-access',
							iconColor : 'lightgray',
							markerColor: 'black'
						}
					}

					/** On mets dans le tableau les informations du marker créé **/
					allMarkers.push(value);
				}
				$scope.markers = allMarkers;
			}, function(msg){
				console.log(msg);
		});
	}
});