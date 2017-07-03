app.controller('mapController', function($scope, $sce, $http, Marker, filterFilter, leafletData, leafletMarkerEvents ){
	// Permet d'afficher ou pas le bouton d'inscription
	$scope.boutonInscription = true;

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

	$scope.openPopin = false // Permet de définir si on ouvre ou pas la popin d'information


	$scope.searchMapSelect = "allTypePlace"; // Definis la valeur de base du select de recherche
	$scope.selectTypePlace = "allTypePlace"; // Definis la valeur de base pour le select type categorie lieu
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
				enable: ['click', 'drag'], // Les evenements que nous souhaitons ecouté
				logic: 'emit'
			}
		}
	});

	/**********************************************
	*** Mise en place des markers au chargement ***
	***********************************************/
	/** Creation de la liste pour recherche **/
	$http.get('json/listMarkers.json')
		.success(function(data){
			/** Définition de la liste de markers **/
			$scope.markersList = data;
		})
		.error(function(msg){
			console.log('erreur chargement des markers ' + msg);
		});

	/** Creation des markers au chargement de la page **/
	$scope.getAllMarkers = Marker.getAllMarkers()
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
	$scope.$on('leafletDirectiveMap.drag', function(){
		// console.log($scope.center.lat); // On get la latitude
		// console.log($scope.center.lng); // On get la longitude
	});

	/** Clique sur un marker pour ouvrir un popin à gauche **/
	$scope.$on('leafletDirectiveMarker.click', function(event, args){
		
		/** On recupere les informations contenu dans le markers **/ 
		informations = args.model.enable.split('/');

		if($scope.currentTrace == false){
			/** On ouvre la popin **/
			$scope.openPopin = true;

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
			$scope.descriptionPopin = markerDescription;
			$scope.descriptionPopin = $sce.trustAsHtml($scope.descriptionPopin);

			$scope.descriptionExit = markerDescriptionExit;
			$scope.descriptionExit = $sce.trustAsHtml($scope.descriptionExit);

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

			/** Controle pour le metro **/
			$scope.markerSeeMetro = informations[0] == "Metro" ? true : false;

			if($scope.markerSeeMetro){
				
				/**Mise en place des sorties **/
				allSortie = markerSortie.split(';');
				$scope.allExitPopin = '';

				allSortie.forEach(function(element) {
					if(element != "" ){
						infoSortie = element.split(' ** ');

						if(element.search('unique') != '-1'){
							$scope.allExitPopin += "Ne dispose que d'une sortie";
						}
						else{
							$scope.allExitPopin += "Sortie n° "+infoSortie[0]+" - "+ infoSortie[1]+"<br>";
						}
					}
				});
				$scope.allExitPopin = $sce.trustAsHtml($scope.allExitPopin);

				/** Permet de savoir si le metro est accessible aux handicapés **/
				$scope.subwayHandicap = markerSortie.search('true') != '-1' ? true : false ;
				console.log($scope.subwayHandicap);

				allSubway = markerSubway.split(' ** ');
				$scope.linesMetros = '';

				allSubway.forEach(function(element){
					if(element !=""){
						$scope.linesMetros += "<span class='subway-popin line"+element+"'>"+element+"</span>";
					}
				});
				$scope.linesMetros = $sce.trustAsHtml($scope.linesMetros);

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


		/** Ok c'est pour moi **/
		console.log("value du escaliers -> "+$scope.traceMap.stairs);
		console.log("value du escalators -> "+$scope.traceMap.escalators);

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

				/** Définition des valeurs pour le routing **/
				$scope.routing = L.Routing.control({
					waypoints: [
						L.latLng(parseFloat(startPoint[0]['latitude']), parseFloat(startPoint[0]['longitude'])),
						// L.latLng(48.866636,2.337372), // Test itinéraire optimisé
						L.latLng(parseFloat(endPoint[0]['latitude']), parseFloat(endPoint[0]['longitude']))
					],
					createMarker: function(){ return null; },
					router : mapboxRouter,
					show: true,
					language : 'fr',
				});

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
			$scope.routing.hide();
			$scope.routing = '';
		}

		/* On vide tout sur la carte */
		delete $scope.markers.value;
		$scope.markers = {};
		allMarkers = [];


		/** Si on clique alors que le filtre est actif, on le désactive et plus rien n'est sur la carte **/
		if($scope.filter == 1){
			$scope.filter = 0;
		}
		else{

			// Dans le cas contraire, on remets filter à 1 car le filtre est actic
			$scope.filter = 1;

			/** Ici on charge la fonction dans le models **/
			$scope.getAllMarkers = Marker.getAllMarkers()
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
			$scope.routing.hide();
			$scope.routing = '';
		}

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

			$scope.getAllMarkers = Marker.getPlacesMarkers()
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
			$scope.routing.hide();
			$scope.routing = '';
		}

		/* On vide tout sur la carte */
		delete $scope.markers.value;
		$scope.markers = {};
		allMarkers = [];

		if($scope.filter == 3){
			$scope.filter = 0;
		}
		else{
			$scope.filter = 3;

			$scope.getAllMarkers = Marker.getAccessMarkers()
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
			$scope.routing.hide();
			$scope.routing = '';
		}

		/* On vide tout sur la carte */
		delete $scope.markers.value;
		$scope.markers = {};
		allMarkers = [];

		$scope.getAllMarkers = Marker.getTypePlace($scope.selectTypePlace)
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
			$scope.routing.hide();
			$scope.routing = '';
		}

		/* On vide tout sur la carte */
		delete $scope.markers.value;
		$scope.markers = {};
		allMarkers = [];

		$scope.getAllMarkers = Marker.getTypeAccess($scope.selectTypeAccess)
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